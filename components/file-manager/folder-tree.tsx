"use client"
import { useFileManager } from "@/context/file-manager-context";
import type { Folder } from "@/types/file-manager";
import { AnimatePresence, motion } from "framer-motion";
import { Folder as FolderIcon, FolderOpen, Loader2, PenBox, Plus, Trash2, Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import CreateFolderInput from "./create-folder-input";
import PopConfirmDialog from "../dialogs/pop-confirm-dialog";
import { Button } from "@/components/ui/button";

interface FolderTreeProps {
    folders?: Folder[];
    depth?: number;
}

export default function FolderTree({ folders: propFolders, depth = 0 }: FolderTreeProps) {
    const {
        folders: contextFolders,
        activeFolderPath,
        setActiveFolderPath,
        deleteFolder,
        deletingFolder,
        renameFolder,
    } = useFileManager();

    const folders = propFolders ?? contextFolders;

    const [openFolderPath, setOpenFolderPath] = useState<string | null>(null);
    const [openConfirmForPath, setOpenConfirmForPath] = useState<string | null>(null);

    const [showChildFolderInput, setShowChildFolderInput] = useState<{ open: boolean, path?: string }>({ open: false, path: undefined });

    const [editingFolderPath, setEditingFolderPath] = useState<{ open: boolean, path?: string }>({ open: false, path: undefined });
    const [editingFolderName, setEditingFolderName] = useState("");
    const inputRef = useRef<HTMLDivElement>(null);

    const [inputWidth, setInputWidth] = useState(0);
    const measureRef = useRef<HTMLSpanElement>(null);

    // Update input width based on text
    useEffect(() => {
        if (measureRef.current) {
            setInputWidth(measureRef.current.offsetWidth + 20); // padding
        }
    }, [editingFolderName]);

    // Close editing when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                editingFolderPath.open &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                cancelEdit();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [editingFolderPath]);

    if (!folders || folders.length === 0) return null;

    const handleFolderClick = (folderPath: string) => {
        setOpenFolderPath(openFolderPath === folderPath ? null : folderPath);
        setActiveFolderPath(folderPath);
    };

    const handleDeleteFolder = (folderPath: string) => {
        deleteFolder(folderPath, {
            onSuccessCallback: () => setOpenConfirmForPath(null),
            onErrorCallback: () => setOpenConfirmForPath(null),
        });
    };

    const startEdit = (folder: Folder) => {
        setEditingFolderPath({ open: true, path: folder.path });
        setEditingFolderName(folder.name);
    };

    const cancelEdit = () => {
        setEditingFolderPath({ open: false, path: undefined });
        setEditingFolderName("");
    };

    const handleRename = (folderPath: string) => {
        console.log("editingFolderName, folderPath", editingFolderName, folderPath);
        // console.log("folderPath.split('/')", );
        if (editingFolderName === folderPath.split('/')[folderPath.split('/').length - 1]) {
            cancelEdit()
            return
        }
        if (!editingFolderName.trim()) return;
        renameFolder({ newName: editingFolderName, path: folderPath }, {
            onSuccessCallback: cancelEdit,
            onErrorCallback: cancelEdit,
        });
    };

    return (
        <>
            {folders.map((folder) => (
                <div key={folder.path} style={{ marginLeft: depth * 16, padding: "4px 0" }}>
                    <div
                        className={`flex justify-between items-center rounded-md ${activeFolderPath === folder.path ? 'bg-gray-100' : ''} hover:bg-gray-100 px-2.5 py-2 cursor-pointer`}
                        onClick={() => handleFolderClick(folder.path)}
                    >
                        <div className="flex justify-start items-center gap-x-1">
                            {activeFolderPath === folder.path ? (
                                <FolderOpen className="h-5 w-5 text-blue-500" />
                            ) : (
                                <FolderIcon className="h-5 w-5 text-gray-500" />
                            )}
                            {editingFolderPath.open && editingFolderPath.path === folder.path ? (
                                <div className="flex items-center gap-x-1 relative" ref={inputRef}>
                                    {/* invisible span to measure width */}
                                    <span ref={measureRef} className="invisible absolute">{editingFolderName}</span>
                                    <input
                                        type="text"
                                        className="text-sm border rounded px-2 py-1"
                                        value={editingFolderName}
                                        style={{ width: inputWidth }}
                                        onChange={(e) => setEditingFolderName(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleRename(folder.path);
                                            if (e.key === "Escape") cancelEdit();
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="p-1"
                                        onClick={() => handleRename(folder.path)}
                                        disabled={!editingFolderName.trim()}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <span className={`text-sm font-medium truncate ${activeFolderPath === folder.path ? 'text-blue-700' : ''}`}>
                                    {folder.name}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center">
                            {/* Edit button */}
                            {!editingFolderPath.open && (
                                <button
                                    type="button"
                                    className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                                    onClick={(e) => { e.stopPropagation(); startEdit(folder); }}
                                    title="Edit folder"
                                >
                                    <PenBox className="h-3 w-3 text-gray-500" />
                                </button>
                            )}

                            {/* Add subfolder */}
                            <button
                                type="button"
                                className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                                onClick={(e) => { e.stopPropagation(); setShowChildFolderInput({ open: true, path: folder.path }); }}
                                title="Add subfolder"
                            >
                                <Plus className="h-3 w-3 text-gray-500" />
                            </button>

                            {/* Delete folder */}
                            <PopConfirmDialog
                                title="Delete this folder?"
                                description={`This will permanently delete "${folder.name}" and its contents.`}
                                triggerButton={
                                    <button
                                        type="button"
                                        className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                                        onClick={(e) => { e.stopPropagation(); setOpenConfirmForPath(folder.path); }}
                                        disabled={deletingFolder}
                                        title="Delete folder"
                                    >
                                        {deletingFolder ? (
                                            <Loader2 className="h-3 w-3 text-gray-500 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-3 w-3 text-gray-500" />
                                        )}
                                    </button>
                                }
                                isLoading={deletingFolder}
                                open={openConfirmForPath === folder.path}
                                onOpenChange={(open) => { if (!open) setOpenConfirmForPath(null); }}
                                confirmAction={() => handleDeleteFolder(folder.path)}
                                cancelAction={() => setOpenConfirmForPath(null)}
                            />
                        </div>
                    </div>

                    {/* Add subfolder input */}
                    {showChildFolderInput.open && showChildFolderInput.path === folder.path &&
                        <div className="flex items-center ml-6 mt-1 mb-1">
                            <CreateFolderInput
                                showInputFieldController={[true, (S: boolean) => setShowChildFolderInput({ open: S, path: undefined })]}
                                parantPath={folder.path}
                            />
                        </div>
                    }

                    {/* Children folders */}
                    <AnimatePresence>
                        {openFolderPath === folder.path && folder.children.length > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                style={{ overflow: "hidden" }}
                            >
                                <FolderTree folders={folder.children} depth={depth + 1} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </>
    );
}
