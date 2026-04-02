import { fetchFolders, createFolder, uploadFile } from "@/lib/file-manager/helpers";

export const IMG_PREFIX = (process.env.NEXT_PUBLIC_IMAGES_PREFIX || "/images").replace(/\/+$/, "");

export function previewFromStoredPath(stored?: string) {
  if (!stored) return "";
  const p = stored.startsWith("/") ? stored : `/${stored}`;
  return `${IMG_PREFIX}${p}`;
}

/** Join and normalize a directory + filename */
export function buildStoredPath(targetDir: string, fileName: string) {
  let dir = targetDir.replace(/\/+$/g, "");
  if (!dir.startsWith("/")) dir = `/${dir}`;
  return `${dir}/${fileName}`.replace(/\/+/g, "/");
}

interface FolderStructure {
  name: string;
  path: string;
  children?: FolderStructure[];
}

export async function getOrCreateInstituteFolder(instituteId: string): Promise<string> {
  const folders: FolderStructure[] = await fetchFolders();

  const stack = [...folders];
  while (stack.length) {
    const f = stack.pop()!;
    if (f.name === instituteId) return f.path;
    if (f.children?.length) stack.push(...f.children);
  }

  const res: unknown = await createFolder({ name: instituteId });
  const folderPath =
    typeof res === "object" &&
    res !== null &&
    "folder" in res &&
    // @ts-expect-error runtime check
    typeof res.folder?.path === "string"
      ? // @ts-expect-error runtime check
        (res.folder.path as string)
      : `/${instituteId}`;

  return folderPath;
}

export async function uploadToInstituteFolder(params: {
  field: "logo" | "favicon";
  file: File;
  instituteId: string;
}) {
  const { field, file, instituteId } = params;

  const targetDir = await getOrCreateInstituteFolder(instituteId);

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const cleanExt = ext ? `.${ext}` : ".png";
  const name = `${field}${cleanExt}`;

  await uploadFile({ path: targetDir, name, file });

  return buildStoredPath(targetDir, name);
}
