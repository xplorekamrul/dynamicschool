/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { createFTPClient } from "@/lib/ftp";
import { NextResponse } from "next/server";

/**
 * PATCH → Rename a folder
 * Request body: { newName: string }
 * Params: path (URL encoded path relative to base dir)
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const { path } = await params;
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { newName } = await req.json();
    if (!newName)
      return NextResponse.json({ error: "New name is required" }, { status: 400 });

    const client = await createFTPClient();
    const decodedPath = decodeURIComponent(path);
    const currentPath = `/${decodedPath}`;

    try {
      const parentDir = currentPath.split("/").slice(0, -1).join("/");

      // List existing folders in the parent directory
      const folderList = await client.list(parentDir);

      // Function to generate unique folder name
      function getUniqueFolderName(name: string, folderList: any[]) {
        // Regex to extract base name and optional number at the end
        const namePattern = /(.*?)(?: (\d+))?$/;

        const match = name.match(namePattern);
        if (!match) return name;

        const baseName = match[1].trim();

        // Collect existing numbers for folders with same base name
        const existingNumbers = folderList
          .filter(f => f.isDirectory)
          .map(f => {
            const m = f.name.match(namePattern);
            if (m && m[1].trim() === baseName) {
              return m[2] ? parseInt(m[2]) : 0;
            }
            return null;
          })
          .filter(n => n !== null) as number[];

        let counter = 0;
        while (existingNumbers.includes(counter)) {
          counter++;
        }

        return counter === 0 ? baseName : `${baseName} ${counter}`;
      }

      const uniqueName = getUniqueFolderName(newName, folderList);
      const newPath = `${parentDir}/${uniqueName}`;

      // Rename the folder
      await client.rename(currentPath, newPath);

      return NextResponse.json({
        success: true,
        message: `Folder renamed to '${uniqueName}'`,
        folder: { oldPath: currentPath, newPath },
      });
    } catch (err: any) {
      console.error("FTP rename folder error:", err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } finally {
      client.close();
    }
  } catch (err: any) {
    console.error("Auth or general error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE → Delete a folder and all contents
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const { path } = await params;
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await createFTPClient();
    const decodedPath = decodeURIComponent(path);
    const folderPath = `/${decodedPath}`;

    try {
      await client.removeDir(folderPath);

      return NextResponse.json({
        success: true,
        message: `Folder '${folderPath}' deleted successfully.`,
      });
    } catch (err: any) {
      console.error("FTP delete folder error:", err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } finally {
      client.close();
    }
  } catch (err: any) {
    console.error("Auth or general error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
