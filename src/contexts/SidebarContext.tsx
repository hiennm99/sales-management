// src/contexts/SidebarContext.tsx
import { createContext, useContext, useState } from 'react';
import type {ReactNode} from "react";

interface SidebarContextType {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    const value = {
        collapsed,
        setCollapsed,
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}