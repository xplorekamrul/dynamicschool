export type ViewMode = "grid" | "list";

export interface Folder {
  name: string;
  path: string;
  children: Folder[];
}

export interface FileItem {
  name: string;
  path: string;
  size: number;
  modifiedAt?: string;
}

export interface MutationsCallbacks {
  onSuccessCallback?: () => void
  onErrorCallback?: () => void
}

export interface FileManagerContextType {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  openUploader: boolean;
  setOpenUploader: (setOpenUploader: boolean) => void;
  selectedFiles: Array<Pick<FileItem, 'name' | 'path'>>;
  setSelectedFiles: React.Dispatch<React.SetStateAction<Pick<FileItem, "name" | "path">[]>>;
  folders: Array<Folder>;
  files: Array<FileItem>
  activeFolderPath: string | null;
  setActiveFolderPath: (path: string | null) => void;
  createFolder: (
    { name, path }: { name: string, path?: string },
    callbacks?: MutationsCallbacks
  ) => void;
  deleteFolder: (
    path: string,
    callbacks?: MutationsCallbacks
  ) => void;
  renameFolder: (
    { path, newName }: { path: string, newName: string },
    callbacks?: {
      onSuccessCallback?: () => void;
      onErrorCallback?: () => void;
    }
  ) => void;
  creatingFolder: boolean
  deletingFolder: boolean
  renamingFolder: boolean
  uploadFile: (
    { name, path, file }: { name: string, path: string, file: File },
    callbacks?: MutationsCallbacks
  ) => void
  deleteFile: ({ path }: { path: string }, callbacks?: MutationsCallbacks) =>void
  renameFile: (
    { path, newName }: { path: string; newName: string }, 
    callbacks?: MutationsCallbacks
  ) =>void
  fileUploading: boolean
  deletingFilePath: string | null
  renamingFile: boolean
}