"use client";

import { createContext, useContext } from "react";

interface InstituteContextType {
   instituteId: string | null;
}

const InstituteContext = createContext<InstituteContextType | undefined>(undefined);

export function useInstituteId() {
   const context = useContext(InstituteContext);
   if (!context) {
      throw new Error("useInstituteId must be used within InstituteProvider");
   }
   return context.instituteId;
}

export function InstituteProvider({
   children,
   instituteId,
}: {
   children: React.ReactNode;
   instituteId: string | null;
}) {
   return (
      <InstituteContext.Provider value={{ instituteId }}>
         {children}
      </InstituteContext.Provider>
   );
}
