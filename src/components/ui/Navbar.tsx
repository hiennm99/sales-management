// src/components/layout/Navbar.tsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from "../../contexts/AuthContext";
import {
    LogOut,
    User,
    Settings,
    Bell,
    ChevronDown,
    Menu,
    X,
    Search,
    Shield,
    Calendar,
    Zap,
    Sun,
    Moon
} from 'lucide-react';

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [notifications] = useState([
        { id: 1, message: "New sale recorded: $2,500", time: "2 min ago", unread: true },
        { id: 2, message: "Monthly report is ready", time: "1 hour ago", unread: false },
        { id: 3, message: "Team meeting in 30 minutes", time: "30 min ago", unread: true },
    ]);
    const [showNotifications, setShowNotifications] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setIsProfileOpen(false);
            setIsMobileMenuOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleProfileClick = () => {
        setIsProfileOpen(false);
        navigate('/profile');
    };

    const handleSettingsClick = () => {
        setIsProfileOpen(false);
        navigate('/settings');
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'from-red-500 to-pink-500';
            case 'manager':
                return 'from-blue-500 to-cyan-500';
            case 'staff':
                return 'from-green-500 to-emerald-500';
            default:
                return 'from-gray-500 to-slate-500';
        }
    };

    const unreadNotifications = notifications.filter(n => n.unread).length;

    if (!user) return null;

    return (
        // --- LOGIC MỚI: Giảm z-index từ 50 xuống 40 ---
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Brand - Enhanced */}
                    <div className="flex items-center cursor-pointer group" onClick={() => navigate('/dashboard')}>
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <span className="text-white text-lg font-bold">S</span>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                        <div className="ml-3">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                SalesFlow
                            </h1>
                            <p className="text-xs text-gray-600 -mt-0.5">Sales Management</p>
                        </div>
                    </div>

                    {/* Search Bar - Better contrast */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-violet-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search sales, customers, products..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/60 outline-none text-sm transition-all duration-300 hover:bg-gray-100 focus:bg-white text-gray-800 placeholder-gray-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-blue-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Right Side Icons - Better contrast */}
                    <div className="hidden md:flex items-center space-x-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            ) : (
                                <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
                            )}
                        </button>

                        {/* Notifications - Better design */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                            >
                                <Bell className="w-5 h-5 group-hover:animate-pulse" />
                                {unreadNotifications > 0 && (
                                    <div className="absolute -top-1 -right-1">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-medium text-white shadow-lg animate-pulse">
                                            {unreadNotifications}
                                        </span>
                                        <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-gradient-to-r from-red-400 to-pink-400 opacity-75 animate-ping"></span>
                                    </div>
                                )}
                            </button>

                            {/* Notifications Dropdown - White background */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-50 transform animate-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 pb-3 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900 flex items-center">
                                            <Zap className="w-4 h-4 mr-2 text-violet-500" />
                                            Notifications
                                        </h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                                                        notification.unread ? 'bg-violet-50 border-l-2 border-violet-500' : ''
                                                    }`}
                                                >
                                                    <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-gray-500">
                                                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                <p>No notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile - Better contrast */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 p-2 text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-300/50 group"
                            >
                                <div className="relative">
                                    <div className={`w-9 h-9 bg-gradient-to-br ${getRoleColor(user.role)} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                        <span className="text-white text-sm font-medium">
                                            {user.fullName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-32">{user.fullName}</p>
                                    <p className="text-xs text-gray-600 truncate capitalize">{user.role}</p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                    isProfileOpen ? 'rotate-180' : ''
                                }`} />
                            </button>

                            {/* Profile Dropdown - White background */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-4 z-50 transform animate-in slide-in-from-top-2 duration-200">
                                    {/* User Header - Simple design */}
                                    <div className="px-6 py-4 mb-4 bg-slate-50 mx-4 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-medium text-lg">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-800 truncate">{user.fullName}</p>
                                                <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                                <div className="flex items-center mt-1">
                                                    <Shield className="w-3 h-3 mr-1 text-slate-400" />
                                                    <span className="text-xs text-slate-500 capitalize font-medium">{user.role}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Member since {new Date(user.createdAt).getFullYear()}
                                            </div>
                                            {user.lastLoginAt && (
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                    Online
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Menu Items - Better contrast */}
                                    <div className="px-2">
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                                        >
                                            <User className="w-5 h-5 mr-3 text-gray-500 group-hover:text-violet-600" />
                                            <span className="font-medium">View Profile</span>
                                        </button>
                                        <button
                                            onClick={handleSettingsClick}
                                            className="w-full flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                                        >
                                            <Settings className="w-5 h-5 mr-3 text-gray-500 group-hover:text-violet-600" />
                                            <span className="font-medium">Account Settings</span>
                                        </button>
                                    </div>

                                    {/* Logout - Danger Zone */}
                                    <div className="border-t border-gray-100 mt-4 pt-4 px-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                                        >
                                            <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Better contrast */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4 bg-white/95 backdrop-blur-xl">
                        {/* Mobile Search */}
                        <div className="px-2 pb-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none text-sm text-gray-800"
                                />
                            </div>
                        </div>

                        {/* User Info Mobile */}
                        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-2xl mx-2 mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(user.role)} rounded-xl flex items-center justify-center shadow-lg`}>
                                <span className="text-white font-medium">
                                    {user.fullName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{user.fullName}</p>
                                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-white rounded-full text-gray-700 mt-1 border border-gray-200">
                                    <Shield className="w-3 h-3 mr-1" />
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        {/* Mobile Menu Items */}
                        <div className="space-y-1 px-2">
                            <button className="w-full flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200">
                                <Bell className="w-5 h-5 mr-3" />
                                Notifications
                                {unreadNotifications > 0 && (
                                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={handleProfileClick}
                                className="w-full flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200"
                            >
                                <User className="w-5 h-5 mr-3" />
                                Profile
                            </button>
                            <button
                                onClick={handleSettingsClick}
                                className="w-full flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200"
                            >
                                <Settings className="w-5 h-5 mr-3" />
                                Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}