import React from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"

type PopConfirmDialogProps = {
    triggerButton?: React.ReactNode
    confirmButton?: React.ReactNode
    confirmAction?: () => void
    cancelButton?: React.ReactNode
    cancelAction?: () => void
    title?: string
    description?: string
    isLoading?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function PopConfirmDialog({
    triggerButton,
    confirmButton,
    confirmAction,
    cancelButton,
    cancelAction,
    title,
    description,
    isLoading,
     open,
    onOpenChange
}:Readonly<PopConfirmDialogProps>) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger  asChild>
                {triggerButton ?? (
                    <Button variant="default" size="sm">
                        Open
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent className="fixed top-1/4 left-1/2">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title??"Are you absolutely sure?"}</AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter >
                    {cancelButton ? ( cancelButton ) : (
                        <AlertDialogCancel 
                            onClick={() => cancelAction ? cancelAction() : null}
                            disabled={isLoading}
                            className="cursor-pointer"
                        >
                            {isLoading && <Loader2 className="animate-spin"/>}
                            {isLoading ? "Loading..." : "Cancel"}
                        </AlertDialogCancel>
                    )}
                    {confirmButton ? ( confirmButton ) : (
                        <AlertDialogAction 
                            onClick={() => confirmAction ? confirmAction() : null}
                            disabled={isLoading}
                            className="cursor-pointer"
                        >
                            {isLoading && <Loader2 className="animate-spin"/>}
                            {isLoading ? "Loading..." : "Confirm"}
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
