// src/components/Layout/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router';
import {
    LayoutDashboard,
    List,
    BarChart3,
    Settings,
    Search
} from 'lucide-react';

export const Sidebar: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'sales-list', label: 'Sales List', icon: List, path: '/sales' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
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
                        className="w-full bg-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path === '/sales' && location.pathname.startsWith('/sales'));

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={({ isActive: navIsActive }) => `
                                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                                    ${isActive || navIsActive
                                    ? 'bg-purple-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-700'
                                }
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Quick Stats */}
                <div className="mt-8 p-3 bg-slate-700 rounded-lg">
                    <p className="text-xs text-slate-400 mb-2">Today's Sales</p>
                    <p className="text-lg font-semibold text-white">$2,847</p>
                    <p className="text-xs text-green-400">↗ +12.5%</p>
                </div>
            </div>
        </div>
    );
};