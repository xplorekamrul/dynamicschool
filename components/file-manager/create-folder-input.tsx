"use client"
import { Button } from "@/components/ui/button";
import { useFileManager } from "@/context/file-manager-context";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CreateFolderInput({
    showInputFieldController,
    parantPath
}:{
    showInputFieldController: [ boolean, (S:boolean) => void ]
    parantPath?: string
}) {
    const newFolderInputRef = useRef<HTMLDivElement>(null);
    const [showNewFolderInput, setShowNewFolderInput] = showInputFieldController;
    const [newFolderName, setNewFolderName] = useState("");

    const { createFolder, creatingFolder } = useFileManager()

    // Effect to handle clicks outside the new folder input
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                !creatingFolder &&
                showNewFolderInput &&
                newFolderInputRef.current &&
                !newFolderInputRef.current.contains(event.target as Node)
            ) {
                setShowNewFolderInput(false);
                setNewFolderName("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNewFolderInput, creatingFolder, setShowNewFolderInput]);

    const handleCreateFolder = () => {
        if (!newFolderName.trim() || creatingFolder) return;
        createFolder({ name: newFolderName, path: parantPath }, {
            onSuccessCallback() {
                setNewFolderName('')
                setShowNewFolderInput(false)
            },
        });
    }

    return (
        <div
            ref={newFolderInputRef}
            className="flex items-center"
        >
            <input
                type="text"
                className="text-sm border rounded px-2 py-1 w-full"
                placeholder="New folder name"
                value={newFolderName}
                onChange={(e) => {
                    e.stopPropagation() 
                    setNewFolderName(e.target.value)
                }}
                autoFocus
                onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === 'Enter') handleCreateFolder();
                    if (e.key === 'Escape') {
                        if (creatingFolder) return;
                        setShowNewFolderInput(false);
                        setNewFolderName("");
                    }
                }}
                disabled={creatingFolder}
            />
            <Button
                type="button"
                size="sm"
                variant="ghost"
                className="ml-1 p-1"
                onClick={handleCreateFolder}
                disabled={creatingFolder || !newFolderName.trim()}
            >
                {creatingFolder ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
        </div>
    )
}
