import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import {
    LayoutDashboard,
    Settings,
    Search,
    TrendingUp,
    Plus,
    Target,
    Zap,
    ChevronRight,
    Activity,
    Package,
    DollarSign,
    ShoppingCart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const { user, hasRole } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

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

    // Filter menu items based on user role
    const visibleMenuItems = menuItems.filter(item =>
        user && hasRole && item.roles.some(role => hasRole(role))
    );

    const getRoleGradient = (role: string) => {
        switch (role) {
            case 'admin': return 'from-red-500 to-pink-500';
            case 'manager': return 'from-blue-500 to-cyan-500';
            case 'staff': return 'from-green-500 to-emerald-500';
            default: return 'from-gray-500 to-slate-500';
        }
    };

    return (
        <div className={`${collapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-[calc(100vh-64px)] transition-all duration-300 shadow-2xl relative`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2220%22%20height=%2220%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2020%200%20L%200%200%200%2020%22%20fill=%22none%22%20stroke=%22white%22%20stroke-opacity=%220.03%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22%20/%3E%3C/svg%3E')] opacity-50"></div>

            <div className="relative p-6">
                {/* Collapse Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-8 w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-10"
                >
                    <ChevronRight className={`w-3 h-3 text-white transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
                </button>

                {/* User Profile Card */}
                {!collapsed && (
                    <div className="mb-8 p-5 bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-2xl border border-slate-600/30 shadow-xl">
                        <div className="flex items-center mb-4">
                            <div className="relative">
                                <div className={`w-12 h-12 bg-gradient-to-br ${getRoleGradient(user?.role || '')} rounded-2xl flex items-center justify-center shadow-lg`}>
                                    <span className="text-white text-lg font-bold">
                                        {user?.fullName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full animate-pulse"></div>
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                                <p className="font-semibold text-white truncate text-sm">{user?.fullName}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r ${getRoleGradient(user?.role || '')} text-xs font-medium text-white shadow-lg`}>
                                <Target className="w-3 h-3 mr-1.5" />
                                {user?.role?.toUpperCase()}
                            </div>
                            <div className="flex items-center text-xs text-green-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                Online
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Add Sale Button */}
                <div className={`mb-8 ${collapsed ? 'px-0' : ''}`}>
                    <NavLink
                        to="/sales/add"
                        className={`group flex items-center ${collapsed ? 'justify-center p-3' : 'justify-center gap-3 px-6 py-4'} bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Plus className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5'} relative z-10`} />
                        {!collapsed && <span className="relative z-10">Add Sale</span>}
                    </NavLink>
                </div>

                {/* Search Bar */}
                {!collapsed && (
                    <div className="relative mb-8">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300 text-white placeholder-slate-400"
                        />
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="space-y-2">
                    {!collapsed && (
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full mr-3"></div>
                                <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                    Menu
                                </p>
                            </div>
                        </div>
                    )}

                    {visibleMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={`group flex items-center ${
                                    collapsed
                                        ? 'justify-center p-3'
                                        : 'gap-4 px-4 py-3'
                                } rounded-2xl transition-all duration-300 relative overflow-hidden ${
                                    isActive
                                        ? `bg-gradient-to-r ${item.color} shadow-lg shadow-violet-500/25`
                                        : 'hover:bg-slate-800/50 hover:backdrop-blur-sm'
                                }`}
                            >
                                {/* Background glow for active item */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                                )}

                                {/* Icon */}
                                <div className="relative z-10 flex items-center justify-center">
                                    <Icon className={`${
                                        collapsed ? 'w-6 h-6' : 'w-5 h-5'
                                    } ${
                                        isActive
                                            ? 'text-white'
                                            : 'text-slate-400 group-hover:text-white'
                                    } transition-colors duration-300`} />
                                </div>

                                {/* Label and Badge */}
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

                                {/* Tooltip for collapsed mode */}
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

                {/* Stats Section */}
                {!collapsed && (
                    <div className="mt-8 p-5 bg-gradient-to-br from-slate-800/30 to-slate-700/20 backdrop-blur-sm rounded-2xl border border-slate-600/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full mr-3"></div>
                                <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                    Quick Stats
                                </p>
                            </div>
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                                        <DollarSign className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Today's Sales</p>
                                        <p className="text-sm font-semibold text-white">$2,450</p>
                                    </div>
                                </div>
                                <div className="text-xs text-emerald-400 flex items-center">
                                    <Activity className="w-3 h-3 mr-1" />
                                    +12%
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Active Orders</p>
                                        <p className="text-sm font-semibold text-white">18</p>
                                    </div>
                                </div>
                                <div className="text-xs text-orange-400 flex items-center">
                                    <Activity className="w-3 h-3 mr-1" />
                                    +3
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};