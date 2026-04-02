"use server"
import { createFTPClient } from '@/lib/ftp';
import { Folder } from '@/types/file-manager';
import path from 'path';

export async function getFiles(folderPath = '/') {
  let client;

  try {
    client = await createFTPClient();
    const list = await client.list(folderPath);

    const files = list.map((item) => {
      let type: string;

      if (item.isDirectory) {
        type = 'directory';
      } else {
        const ext = path.extname(item.name).toLowerCase().replace('.', '');
        type = ext || 'unknown';
      }

      return {
        name: item.name,
        type,
        size: item.size,
        modifiedAt: item.modifiedAt,
        permissions: item.permissions,
        path: `${folderPath}/${item.name}`.replace(/\/+/g, '/'),
      };
    });

    return {
      success: true,
      files,
      currentPath: folderPath,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('FTP list error:', error);
    return {
      success: false,
      error: error.message,
    };
  } finally {
    client?.close();
  }
}

export async function getFolderStructure(folderPath = '/'): Promise<Array<Folder>> {
  let client;

  try {
    client = await createFTPClient();
    const list = await client.list(folderPath);

    const folders = [];

    for (const item of list) {
      if (item.isDirectory) {
        const fullPath = `${folderPath}/${item.name}`.replace(/\/+/g, '/');
        const children = await getFolderStructure(fullPath); // recursion
        folders.push({
          name: item.name,
          path: fullPath,
          children,
        });
      }
    }

    return folders;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('FTP folder structure error:', error);
    return [];
  } finally {
    client?.close();
  }
}
