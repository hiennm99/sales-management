import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-slate-100/30"></div>

            {/* Top Navbar - Always visible */}
            <Navbar />

            {/* Main layout with sidebar */}
            <div className="flex relative z-10">
                {/* Left Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto min-h-[calc(100vh-64px)]">
                    <div className="p-6 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};