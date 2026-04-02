/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createFTPClient, getFTPBaseDir, ensureFTPBaseDir } from "@/lib/ftp";
import { auth } from "@/lib/auth";
import { Buffer } from "node:buffer";
import { Readable } from "node:stream";

// GET → List files under a folder (query param: ?path=folder/path)
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const folderPath = url.searchParams.get("path") || "";
  const baseDir = getFTPBaseDir();

  const targetDir = folderPath ? `/${decodeURIComponent(folderPath)}` : baseDir;

  // return NextResponse.json({ targetDir });

  const client = await createFTPClient();
  try {
    await ensureFTPBaseDir(client);
    const list = await client.list(targetDir);
    const files = list
      .filter((item: any) => item.isFile)
      .map((file: any) => ({
        name: file.name,
        path: `${targetDir}/${file.name}`,
        size: file.size,
        modifiedAt: file.modifiedAt,
      }));
    return NextResponse.json({ files });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.close();
  }
}

// POST → Upload file under a folder
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Parse FormData instead of JSON
  const formData = await req.formData();
  const path = (formData.get('path') as string) || "";
  const name = formData.get('name') as string;
  const file = formData.get('file') as File;

  if (!name || !file) return NextResponse.json({ error: "Name and file required" }, { status: 400 });

  const client = await createFTPClient();
  const baseDir = getFTPBaseDir();
  const targetDir = path ? `/${decodeURIComponent(path)}` : baseDir;

  try {
    await ensureFTPBaseDir(client);
    await client.ensureDir(targetDir);

    // Ensure unique file name
    let finalName = name;
    const list = await client.list(targetDir);
    const existingNames = list.filter((f: any) => f.isFile).map((f: any) => f.name);
    let counter = 1;
    
    while (existingNames.includes(finalName)) {
      const parts = name.split(".");
      const ext = parts.length > 1 ? "." + parts.pop() : "";
      const base = parts.join(".");
      finalName = `${base}(${counter})${ext}`;
      counter++;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buf =
      Buffer.isBuffer(arrayBuffer)
        ? arrayBuffer
        : arrayBuffer instanceof Uint8Array
          ? Buffer.from(arrayBuffer)
          : Buffer.from(arrayBuffer)

    const stream = Readable.from(buf)

    await client.uploadFrom(stream, `${targetDir}/${finalName}`);

    return NextResponse.json({
      success: true,
      file: {
        name: finalName,
        path: `${targetDir}/${finalName}`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.close();
  }
}