import React from 'react';
import {
    LayoutDashboard,
    List,
    Plus,
    BarChart3,
    Settings,
    Search
} from 'lucide-react';

interface SidebarProps {
    currentPage: string;
    onPageChange: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'sales-list', label: 'Sales List', icon: List },
        { id: 'add-sale', label: 'Add Sale', icon: Plus },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-48 bg-slate-800 text-white min-h-screen">
            <div className="p-4">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">SF</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">SalesFlow</h1>
                        <p className="text-xs text-slate-400">Modern Sales Management</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm"
                    />
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onPageChange(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                    currentPage === item.id
                                        ? 'bg-purple-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};