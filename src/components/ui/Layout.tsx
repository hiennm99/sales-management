// src/components/layout/Layout.tsx

import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { FloatingActionButton } from '../buttons/FloatingActionButton';
import { useSidebar } from "../../contexts/SidebarContext.tsx";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { collapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/20 via-transparent to-zinc-200/10"></div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main content wrapper */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${
                collapsed ? 'ml-20' : 'ml-72'
            }`}>
                {/* Top Navbar */}
                <Navbar />

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto relative">
                    {/* Background container cho main content */}
                    <div className="min-h-full bg-slate-50 border-l border-slate-200/50">
                        <div className="p-6 max-w-12xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Floating Action Button - positioned at bottom left of main content */}
                <FloatingActionButton />
            </div>
        </div>
    );
};