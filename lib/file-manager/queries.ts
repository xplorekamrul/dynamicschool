import { useQuery } from "@tanstack/react-query";
import { fetchFolders, listFiles, searchFiles } from "./helpers";

export function useFoldersQuery() {
    return useQuery({
        queryKey: ["ftp", "folders"],
        queryFn: fetchFolders,
    });
}

export function useListFiles(path = "") {
    return useQuery({
        queryKey: ["ftp", "files", path],
        queryFn: () => listFiles(path)
    });
}

export function useSearchFiles(query: string) {
    return useQuery({
        queryKey: ["ftp", "files", "search", query],
        queryFn: () => searchFiles(query),
        enabled: false, // Only fetch when explicitly triggered
    });
}