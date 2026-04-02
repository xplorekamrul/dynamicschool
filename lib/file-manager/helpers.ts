// folder helpers 
export async function fetchFolders() {
  const res = await fetch("/api/ftp/folders", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch folders");
  const data = await res.json();
  return data.folders;
}

export async function createFolder(values: { name: string; path?: string }) {
  const res = await fetch("/api/ftp/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error("Failed to create folder");
  return res.json();
}


export async function renameFolder(path: string, newName: string) {
  const res = await fetch(`/api/ftp/folders/${encodeURIComponent(path)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newName }),
  });
  if (!res.ok) throw new Error("Failed to rename folder");
  return res.json();
}

export async function deleteFolder(path: string) {
  const res = await fetch(`/api/ftp/folders/${encodeURIComponent(path)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete folder");
  return res.json();
}

// files helpers
export async function listFiles(path = "") {
  const res = await fetch(`/api/ftp/files?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error("Failed to list files");
  return res.json();
}

export async function searchFiles(query: string) {
  const res = await fetch(`/api/ftp/files/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to search files");
  return res.json();
}

export async function uploadFile({ 
  path = "", 
  name, 
  file 
}: { 
  path?: string; 
  name: string; 
  file: File
}) {
  const formData = new FormData();
  formData.append('path', path);
  formData.append('name', name);
  formData.append('file', file);

  const res = await fetch("/api/ftp/files", {
    method: "POST",
    // DON'T set Content-Type - browser will set it with boundary
    body: formData,
  });
  
  if (!res.ok) throw new Error("Failed to upload file");
  return res.json();
}

export async function renameFile(path: string, newName: string) {
  const res = await fetch(`/api/ftp/files/${encodeURIComponent(path)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newName }),
  });
  if (!res.ok) throw new Error("Failed to rename file");
  return res.json();
}

export async function deleteFile(path: string) {
  const res = await fetch(`/api/ftp/files/${encodeURIComponent(path)}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete file");
  return res.json();
}


