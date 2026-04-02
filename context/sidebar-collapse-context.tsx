"use client";

import { createContext, use, useState } from "react";

type SidebarCollapseContextType = {
    open: boolean
    setOpen: (S: boolean) => void
}

const SidebarCollapseContext = createContext<SidebarCollapseContextType | undefined>(undefined);

export default function SidebarCollapseContextProvider({children}:{children: React.ReactNode;}) {
    const [open, setOpen] = useState(true)
    return <SidebarCollapseContext value={{ open, setOpen}}>{children}</SidebarCollapseContext>
}

export const useSidebar = () => {
    const ctx = use(SidebarCollapseContext);
    if (!ctx) throw new Error("useSidebar must be used within SidebarCollapseContextProvider");
    return ctx;
}