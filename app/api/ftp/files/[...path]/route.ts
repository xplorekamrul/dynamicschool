/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { createFTPClient, ensureFTPBaseDir, getFTPBaseDir } from "@/lib/ftp";
import { NextResponse } from "next/server";

interface RouteParams {
  path: string[];
}

// GET → List files under a dynamic folder/path (files ONLY, no directories)
export async function GET(
  req: Request,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { path: pathArray } = await params;
    const path = pathArray.join("/");
    const baseDir = getFTPBaseDir();
    const targetDir = path ? `${baseDir}/${path}` : baseDir;

    const client = await createFTPClient();
    try {
      await ensureFTPBaseDir(client);
      const list = await client.list(targetDir);

      // Filter to include ONLY files, no directories
      const files = list
        .filter((item: any) => item.isFile)
        .map((f: any) => ({
          name: f.name,
          path: `${targetDir}/${f.name}`,
          size: f.size,
          modifiedAt: f.modifiedAt,
        }));

      return NextResponse.json({ files });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } finally {
      client.close();
    }
  } catch (err: any) {
    console.error("Auth or general error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// PATCH → Rename a file
export async function PATCH(
  req: Request,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { path: pathArray } = await params;
    const path = pathArray.join("/");
    const { newName } = await req.json();

    if (!path || !newName) return NextResponse.json({ error: "Path and newName required" }, { status: 400 });

    const client = await createFTPClient();
    const baseDir = getFTPBaseDir();
    const oldPath = `${baseDir}/${path}`;
    const parts = path.split("/");
    parts[parts.length - 1] = newName;
    const newPath = `${baseDir}/${parts.join("/")}`;

    try {
      await client.rename(oldPath, newPath);
      return NextResponse.json({ success: true, path: newPath });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } finally {
      client.close();
    }
  } catch (err: any) {
    console.error("Auth or general error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE → Delete a file
export async function DELETE(
  req: Request,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { path: pathArray } = await params;
    const path = pathArray.join("/");

    if (!path) return NextResponse.json({ error: "Path required" }, { status: 400 });

    const client = await createFTPClient();
    const targetPath = `/${decodeURIComponent(path)}`;

    try {
      await client.remove(targetPath);
      return NextResponse.json({ success: true });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } finally {
      client.close();
    }
  } catch (err: any) {
    console.error("Auth or general error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}