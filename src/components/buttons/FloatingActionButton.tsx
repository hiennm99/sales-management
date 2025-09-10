// src/components/common/FloatingActionButton.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
    Plus,
    ShoppingCart,
    Package,
    Users,
    FileText,
    TrendingUp,
    Settings,
    Zap,
    X,
    ChevronUp
} from 'lucide-react';

interface FloatingAction {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    path: string;
    color: string;
    gradient: string;
    description: string;
    shortcut?: string;
}

const FLOATING_ACTIONS: FloatingAction[] = [
    {
        id: 'add-sale',
        label: 'New Sale',
        icon: Plus,
        path: '/sales/add',
        color: 'purple',
        gradient: 'from-purple-500 to-violet-600',
        description: 'Create new sale order',
        shortcut: 'Ctrl+N'
    },
    {
        id: 'add-product',
        label: 'Add Product',
        icon: Package,
        path: '/products/add',
        color: 'blue',
        gradient: 'from-blue-500 to-cyan-600',
        description: 'Add new product to inventory',
        shortcut: 'Ctrl+P'
    },
    {
        id: 'quick-report',
        label: 'Quick Report',
        icon: TrendingUp,
        path: '/analytics/quick',
        color: 'emerald',
        gradient: 'from-emerald-500 to-green-600',
        description: 'Generate quick sales report',
        shortcut: 'Ctrl+R'
    },
    {
        id: 'customers',
        label: 'Customers',
        icon: Users,
        path: '/customers',
        color: 'orange',
        gradient: 'from-orange-500 to-red-600',
        description: 'Manage customers',
        shortcut: 'Ctrl+U'
    }
];

export const FloatingActionButton: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleActionClick = (action: FloatingAction) => {
        navigate(action.path);
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Action Items */}
            {isOpen && (
                <div className="absolute bottom-20 left-0 space-y-3 animate-in slide-in-from-bottom-8 duration-300">
                    {FLOATING_ACTIONS.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <div
                                key={action.id}
                                className="flex items-center group"
                                style={{
                                    animationDelay: `${index * 50}ms`
                                }}
                            >
                                {/* Action Label */}
                                <div className="mr-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                                    <div className="bg-slate-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-xl border border-slate-700/50">
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="text-sm font-medium">{action.label}</p>
                                                <p className="text-xs text-slate-400">{action.description}</p>
                                            </div>
                                            {action.shortcut && (
                                                <div className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                                    {action.shortcut}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => handleActionClick(action)}
                                    className={`w-14 h-14 bg-gradient-to-r ${action.gradient} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 group-hover:shadow-${action.color}-500/25`}
                                >
                                    <Icon className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Main FAB Button */}
            <button
                onClick={toggleMenu}
                className={`w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-105 ${
                    isOpen ? 'rotate-45' : ''
                }`}
            >
                {isOpen ? (
                    <X className="w-7 h-7 text-white transition-transform duration-300" />
                ) : (
                    <Zap className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
                )}
            </button>

            {/* Pulse Effect */}
            {!isOpen && (
                <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl animate-ping opacity-20"></div>
            )}

            {/* Keyboard Shortcut Hint */}
            {!isOpen && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-slate-900/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                        Quick Actions
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900/90"></div>
                    </div>
                </div>
            )}
        </div>
    );
};