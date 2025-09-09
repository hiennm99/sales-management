import { useState, useRef, useEffect } from 'react';
import {useAuth} from "../../contexts/AuthContext.tsx";
import {
    LogOut,
    User,
    Settings,
    Bell,
    ChevronDown,
    Menu,
    X
} from 'lucide-react';

export function Navbar() {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'manager':
                return 'bg-blue-100 text-blue-800';
            case 'staff':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!user) return null;

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">SF</span>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">SalesFlow</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user.fullName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{user.fullName}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getRoleColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                        {user.department && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                📁 {user.department}
                                            </p>
                                        )}
                                        {user.lastLoginAt && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                Last login: {new Date(user.lastLoginAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-1">
                                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <User className="w-4 h-4 mr-3" />
                                            View Profile
                                        </button>
                                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <Settings className="w-4 h-4 mr-3" />
                                            Settings
                                        </button>
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-gray-100 pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Sign Out
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
                            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="space-y-3">
                            {/* User Info Mobile */}
                            <div className="flex items-center space-x-3 px-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium">
                                        {user.fullName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{user.fullName}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            {/* Mobile Menu Items */}
                            <div className="space-y-1">
                                <button className="w-full flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Bell className="w-4 h-4 mr-3" />
                                    Notifications
                                </button>
                                <button className="w-full flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <User className="w-4 h-4 mr-3" />
                                    Profile
                                </button>
                                <button className="w-full flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Settings className="w-4 h-4 mr-3" />
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}