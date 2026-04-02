"use client"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateFolderInput from "./create-folder-input";

export default function CreateRootFolder() {
    const [showNewFolderInput, setShowNewFolderInput] = useState<boolean>(false)

    return (
        !showNewFolderInput ? (
            <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1 w-full mb-2 cursor-pointer"
                onClick={() => setShowNewFolderInput(true)}
            >
                <Plus className="h-4 w-4" />
                <span>New Folder</span>
            </Button>
        ) : (<CreateFolderInput showInputFieldController={[showNewFolderInput, setShowNewFolderInput]} />)
    )
}
