import { createFTPClient } from '@/lib/ftp';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET(
   _req: Request,
   { params }: { params: Promise<{ path?: string[] }> }
) {
   let client;

   try {
      const { path: pathSegments } = await params;
      const folderPath = pathSegments ? `/${pathSegments.join('/')}` : '/';

      client = await createFTPClient();
      const list = await client.list(folderPath);

      const files = list.map(item => {
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

      return NextResponse.json({
         success: true,
         files,
         currentPath: folderPath,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (error: any) {
      console.error('FTP list error:', error);
      return NextResponse.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   } finally {
      client?.close();
   }
}
