// src/components/layout/Sidebar.tsx

import React from 'react';
import { NavLink, useLocation } from 'react-router';
import {
    LayoutDashboard,
    Settings,
    Search,
    TrendingUp,
    ChevronRight,
    Activity,
    Package,
    DollarSign,
    ShoppingCart,
    Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ShopSelector } from "../common/ShopSelector.tsx";
import { useSidebar } from "../../contexts/SidebarContext.tsx";
import {FloatingActionButton} from "../buttons/FloatingActionButton.tsx";

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const { user, hasRole } = useAuth();
    const { collapsed, setCollapsed } = useSidebar()

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard',
            roles: ['admin', 'manager', 'staff'],
            badge: null,
            color: 'from-violet-500 to-purple-500'
        },
        {
            id: 'sales-list',
            label: 'Sales',
            icon: ShoppingCart,
            path: '/sales',
            roles: ['admin', 'manager', 'staff'],
            badge: '12',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'products',
            label: 'Products',
            icon: Package,
            path: '/products',
            roles: ['admin'],
            badge: null,
            color: 'from-orange-500 to-red-500'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/settings',
            roles: ['admin'],
            badge: null,
            color: 'from-gray-500 to-slate-500'
        },
    ];

    const visibleMenuItems = menuItems.filter(item =>
        user && hasRole && item.roles.some(role => hasRole(role as 'admin' | 'manager' | 'staff'))
    );

    return (
        <div className={`fixed top-0 left-0 h-full z-50 ${collapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 shadow-2xl flex flex-col`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2220%22%20height=%2220%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2020%200%20L%200%200%200%2020%22%20fill=%22none%22%20stroke=%22white%22%20stroke-opacity=%220.03%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22%20/%3E%3C/svg%3E')] opacity-50"></div>

            <div className="relative p-4 flex-grow flex flex-col">
                {/* Collapse Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-8 w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-10"
                >
                    <ChevronRight className={`w-3 h-3 text-white transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
                </button>

                {/* Shop Selector Section */}
                <div className="mb-6">
                    <ShopSelector />
                </div>

                {/* Search Bar */}
                {!collapsed && (
                    <div className="relative mb-6">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300 text-white placeholder-slate-400"
                        />
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="space-y-2 flex-grow">
                    {!collapsed && (
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-5 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full mr-3"></div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Menu
                            </p>
                        </div>
                    )}

                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={`group flex items-center ${
                                    collapsed
                                        ? 'justify-center p-3 h-12'
                                        : 'gap-4 px-4 py-3'
                                } rounded-2xl transition-all duration-300 relative overflow-hidden ${
                                    isActive
                                        ? `bg-gradient-to-r ${item.color} shadow-lg shadow-violet-500/25`
                                        : 'hover:bg-slate-800/50 hover:backdrop-blur-sm'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                                )}
                                <div className="relative z-10 flex items-center justify-center">
                                    <Icon className={`${
                                        collapsed ? 'w-6 h-6' : 'w-5 h-5'
                                    } ${
                                        isActive
                                            ? 'text-white'
                                            : 'text-slate-400 group-hover:text-white'
                                    } transition-colors duration-300`} />
                                </div>
                                {!collapsed && (
                                    <div className="flex items-center justify-between flex-1 relative z-10">
                                        <span className={`font-medium text-sm ${
                                            isActive
                                                ? 'text-white'
                                                : 'text-slate-300 group-hover:text-white'
                                        } transition-colors duration-300`}>
                                            {item.label}
                                        </span>
                                        {item.badge && (
                                            <div className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                                                item.badge === 'New'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                            } backdrop-blur-sm`}>
                                                {item.badge}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {collapsed && (
                                    <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                                        {item.label}
                                        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
                                    </div>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};