import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder, deleteFile, deleteFolder, renameFile, renameFolder, uploadFile } from "./helpers";

export function useCreateFolderMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFolder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ftp", "folders"] });
        },
    });
}

export function useRenameFolderMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ path, newName }: { path: string; newName: string }) => renameFolder(path, newName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ftp", "folders"] });
        },
    });
}

export function useDeleteFolderMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (path: string) => deleteFolder(path),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ftp", "folders"] });
        },
    });
}

// files mutaions
export function useUploadFileMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { path: string; name: string; file: File }) => uploadFile(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["ftp", "files", variables.path] });
        },
    });
}

export function useRenameFileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ path, newName }: { path: string; newName: string }) => renameFile(path, newName),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["ftp", "files", variables.path.split("/").slice(0, -1).join("/")] });
        },
    })
}

export function useDeleteFileMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (path: string) => deleteFile(path),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ftp", "files"] });
        },
    });
}