import { Client } from 'basic-ftp';

export interface FTPConfig {
  host: string;
  user: string;
  password: string;
  port?: number;
  secure?: boolean;
}

export function getFTPConfig(): FTPConfig {
  return {
    host: process.env.FTP_HOST || '',
    user: process.env.FTP_USER || '',
    password: process.env.FTP_PASSWORD || '',
    port: parseInt(process.env.FTP_PORT || '21'),
    secure: process.env.FTP_SECURE === 'true',
  };
}

export async function createFTPClient(config?: FTPConfig) {
  const ftpConfig = config || getFTPConfig();
  const client = new Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: ftpConfig.host,
      user: ftpConfig.user,
      password: ftpConfig.password,
      port: ftpConfig.port || 21,
      secure: ftpConfig.secure || false,
      // Allow self-signed certificates
      ...(ftpConfig.secure && {
        secureOptions: {
          rejectUnauthorized: false,
        },
      }),
    });
    return client;
  } catch (err) {
    console.error('FTP connection failed:', err);
    throw err;
  }
}

export function getFTPBaseDir(): string {
  return process.env.FTP_BASE_DIR || "uploads";
}

/**
 * Ensures the base directory exists on the FTP server
 */
export async function ensureFTPBaseDir(client: Client) {
  const baseDir = getFTPBaseDir();
  try {
    const rootList = await client.list("/");

    const exists = rootList.some(item => item.name === baseDir && item.isDirectory);

    if (!exists) await client.ensureDir(baseDir);

  } catch (err) {
    console.error(`Failed to ensure base directory '${baseDir}':`, err);
    throw new Error(`Base directory '${baseDir}' could not be created or accessed`);
  }
}