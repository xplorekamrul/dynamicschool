"use client"
import {
    useCreateFolderMutation,
    useDeleteFileMutation,
    useDeleteFolderMutation,
    useRenameFileMutation,
    // useRenameFileMutation, 
    useRenameFolderMutation,
    useUploadFileMutation
} from "@/lib/file-manager/mutation";
import { useFoldersQuery, useListFiles } from "@/lib/file-manager/queries";
import { FileItem, FileManagerContextType, MutationsCallbacks, ViewMode } from "@/types/file-manager";
import { createContext, useContext, useState } from "react";

export const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined)

export function useFileManager() {
    const context = useContext(FileManagerContext);
    if (!context) {
        throw new Error("useFileManager must be used within FileManagerProvider");
    }
    return context;
}

export function FileManagerProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
    const [activeFolderPath, setActiveFolderPath] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [openUploader, setOpenUploader] = useState<boolean>(false)
    const [selectedFiles, setSelectedFiles] = useState<Array<Pick<FileItem, 'name' | 'path'>>>([])
    const [deletingFilePath, setDeletingFilePath] = useState<string | null>(null)

    // Fetch folders and files
    const { data: foldersData } = useFoldersQuery();
    const { data: filesData } = useListFiles(activeFolderPath || "");

    //Folder Mutations
    const { mutateAsync: createFolderMutation, isPending: creatingFolder } = useCreateFolderMutation();
    const { mutateAsync: deleteFolderMutation, isPending: deletingFolder } = useDeleteFolderMutation();
    const { mutateAsync: renameFolderMutation, isPending: renamingFolder } = useRenameFolderMutation();

    // Create folder handler
    const createFolder = (
        { name, path }: { name: string, path?: string },
        callbacks?: MutationsCallbacks
    ) => {
        console.log("name, path", name, path);

        createFolderMutation(
            { name, path },
            {
                onSuccess: () => {
                    callbacks?.onSuccessCallback?.();
                },
                onError: () => {
                    callbacks?.onErrorCallback?.();
                }
            }
        );
    };

    // Delete folder handler
    const deleteFolder = (
        path: string,
        callbacks?: MutationsCallbacks
    ) => {
        deleteFolderMutation(path, {
            onSuccess: () => {
                callbacks?.onSuccessCallback?.();
                setActiveFolderPath(null)
            },
            onError: () => {
                callbacks?.onErrorCallback?.();
            }
        });
    };

    // Rename folder handler
    const renameFolder = (
        { path, newName }: { path: string, newName: string },
        callbacks?: MutationsCallbacks
    ) => {
        renameFolderMutation(
            { path, newName },
            {
                onSuccess: () => {
                    callbacks?.onSuccessCallback?.();
                },
                onError: () => {
                    callbacks?.onErrorCallback?.();
                }
            }
        );
    };

    //FIle Mutations
    const { mutateAsync: uploadFileMutation, isPending: fileUploading } = useUploadFileMutation();
    const { mutateAsync: deleteFileMutation } = useDeleteFileMutation();
    const { mutateAsync: renameFileMutation, isPending: renamingFile } = useRenameFileMutation();

    // upload files mutation
    const uploadFile = (
        { name, path, file }: { name: string, path: string, file: File },
        callbacks?: MutationsCallbacks
    ) => {
        uploadFileMutation(
            { name, path, file },
            {
                onSuccess: () => {
                    callbacks?.onSuccessCallback?.();
                },
                onError: () => {
                    callbacks?.onErrorCallback?.();
                }
            }
        )
    }

    // delete files mutation
    const deleteFile = (
        { path }: { path: string },
        callbacks?: MutationsCallbacks
    ) => {
        setDeletingFilePath(path);
        deleteFileMutation(path, {
            onSuccess: () => {
                setDeletingFilePath(null);
                callbacks?.onSuccessCallback?.();
            },
            onError: () => {
                setDeletingFilePath(null);
                callbacks?.onErrorCallback?.();
            }
        })
    }

    // rename file mutation
    const renameFile = (
        { path, newName }: { path: string; newName: string },
        callbacks?: MutationsCallbacks
    ) => {
        renameFileMutation({
            path,
            newName
        }, {
            onSuccess: () => {
                callbacks?.onSuccessCallback?.();
            },
            onError: () => {
                callbacks?.onErrorCallback?.();
            }
        })
    }

    return (
        <FileManagerContext.Provider value={{
            viewMode,
            setViewMode,
            openUploader,
            setOpenUploader,
            selectedFiles,
            setSelectedFiles,
            folders: foldersData || [],
            files: filesData?.files || [],
            activeFolderPath,
            setActiveFolderPath,
            createFolder,
            deleteFolder,
            renameFolder,
            creatingFolder,
            deletingFolder,
            renamingFolder,
            uploadFile,
            deleteFile,
            renameFile,
            fileUploading,
            deletingFilePath,
            renamingFile
        }}>
            {children}
        </FileManagerContext.Provider>
    )
}

