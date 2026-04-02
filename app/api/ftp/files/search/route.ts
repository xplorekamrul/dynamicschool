/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createFTPClient, getFTPBaseDir, ensureFTPBaseDir } from "@/lib/ftp";
import { auth } from "@/lib/auth";

async function listAllFiles(client: any, dir: string): Promise<any[]> {
  const allFiles: any[] = [];

  try {
    const list = await client.list(dir);

    for (const item of list) {
      if (item.isFile) {
        allFiles.push({
          name: item.name,
          path: `${dir}/${item.name}`,
          size: item.size,
          modifiedAt: item.modifiedAt,
        });
      } else if (item.isDirectory && item.name !== "." && item.name !== "..") {
        const subFiles = await listAllFiles(client, `${dir}/${item.name}`);
        allFiles.push(...subFiles);
      }
    }
  } catch (err: any) {
    console.error(`Error listing directory ${dir}:`, err.message);
  }

  return allFiles;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const query = url.searchParams.get("q") || "";
  const baseDir = getFTPBaseDir();
  const client = await createFTPClient();

  try {
    await ensureFTPBaseDir(client);
    if (!query.trim()) return NextResponse.json({ files: [], query: "" });
    const normalizedQuery = query.trim().replace(/^\/+|\/+$/g, '');
    const searchPath = `${baseDir}/${normalizedQuery}`;

    let files: any[] = [];

    try {
      const list = await client.list(searchPath);
      if (list.length > 0) files = await listAllFiles(client, searchPath);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      const lastSlashIndex = searchPath.lastIndexOf('/');
      const dirPath = searchPath.substring(0, lastSlashIndex);
      const fileName = searchPath.substring(lastSlashIndex + 1);

      try {
        const dirList = await client.list(dirPath);
        const matchingFile = dirList.find((item: any) =>
          item.isFile && item.name.toLowerCase().includes(fileName.toLowerCase())
        );

        if (matchingFile) {
          files = [{
            name: matchingFile.name,
            path: `${dirPath}/${matchingFile.name}`,
            size: matchingFile.size,
            modifiedAt: matchingFile.modifiedAt,
          }];
        } else {
          const matchingFiles = dirList
            .filter((item: any) =>
              item.isFile && item.name.toLowerCase().includes(fileName.toLowerCase())
            )
            .map((file: any) => ({
              name: file.name,
              path: `${dirPath}/${file.name}`,
              size: file.size,
              modifiedAt: file.modifiedAt,
            }));

          files = matchingFiles;
        }
      } catch (innerErr: any) {
        console.error(`Error searching for file:`, innerErr.message);
      }
    }

    return NextResponse.json({ files, query: normalizedQuery });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.close();
  }
}
