/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { createFTPClient, ensureFTPBaseDir, getFTPBaseDir } from "@/lib/ftp";
import type { Folder } from "@/types/file-manager";
import { NextResponse } from "next/server";

/**
 * Recursively list folders from an FTP directory
 */
async function listFoldersRecursive(client: any, path: string): Promise<Folder[]> {
    const list = await client.list(path);
    const folders: Folder[] = [];

    for (const item of list) {
        if (item.isDirectory) {
            const folderPath = `${path}/${item.name}`;
            const children = await listFoldersRecursive(client, folderPath);
            folders.push({
                name: item.name,
                path: folderPath,
                children,
            });
        }
    }

    return folders;
}

/**
 * GET → List all folders under FTP_BASE_DIR recursively
 */
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await createFTPClient();
        const baseDir = getFTPBaseDir();

        try {
            await ensureFTPBaseDir(client);
            const folders = await listFoldersRecursive(client, baseDir);
            return NextResponse.json({ baseDir, folders });
        } catch (err: any) {
            console.error("FTP list error:", err);
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
 * POST → Create a folder (auto rename if exists)
 * Request body: { name: string, path?: string }
 */
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { name, path = "" } = await req.json();

        if (!name) return NextResponse.json({ error: "Folder name is required" }, { status: 400 });

        const client = await createFTPClient();
        const baseDir = getFTPBaseDir();

        try {
            await ensureFTPBaseDir(client);
            const targetDir = path ? `/${path}` : baseDir;
            const folderList = await client.list(targetDir);


            let folderName = name;
            let counter = 1;

            while (folderList.some((f: any) => f.isDirectory && f.name === folderName)) {
                folderName = `${name} ${counter++}`;
            }

            const newFolderPath = `${targetDir}/${folderName}`;
            await client.ensureDir(newFolderPath);
            await client.cd("/");

            return NextResponse.json({
                success: true,
                message: `Folder '${folderName}' created successfully.`,
                folder: { name: folderName, path: newFolderPath },
            });
        } catch (err: any) {
            console.error("FTP create folder error:", err);
            return NextResponse.json({ error: err.message }, { status: 500 });
        } finally {
            client.close();
        }
    } catch (err: any) {
        console.error("Auth or general error:", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
