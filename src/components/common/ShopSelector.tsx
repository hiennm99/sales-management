// src/components/common/ShopSelector.tsx
import React, { useState } from 'react';
import { ChevronDown, Check, Store, Coffee, Zap, Palette, Smartphone, Car, Home, Gamepad2, Building2, AlertCircle } from 'lucide-react';
import { useShopSelection } from '../../contexts/ShopContext';
import { useSidebar } from '../../contexts/SidebarContext';

// Define available themes
const SHOP_THEMES = [
    {
        icon: Store,
        gradient: 'from-blue-500 to-blue-600',
        bgClass: 'bg-blue-500',
        shadowClass: 'shadow-blue-500/20'
    },
    {
        icon: Coffee,
        gradient: 'from-amber-500 to-orange-600',
        bgClass: 'bg-amber-500',
        shadowClass: 'shadow-amber-500/20'
    },
    {
        icon: Zap,
        gradient: 'from-purple-500 to-violet-600',
        bgClass: 'bg-purple-500',
        shadowClass: 'shadow-purple-500/20'
    },
    {
        icon: Palette,
        gradient: 'from-pink-500 to-rose-600',
        bgClass: 'bg-pink-500',
        shadowClass: 'shadow-pink-500/20'
    },
    {
        icon: Smartphone,
        gradient: 'from-emerald-500 to-teal-600',
        bgClass: 'bg-emerald-500',
        shadowClass: 'shadow-emerald-500/20'
    },
    {
        icon: Car,
        gradient: 'from-red-500 to-red-600',
        bgClass: 'bg-red-500',
        shadowClass: 'shadow-red-500/20'
    },
    {
        icon: Home,
        gradient: 'from-green-500 to-green-600',
        bgClass: 'bg-green-500',
        shadowClass: 'shadow-green-500/20'
    },
    {
        icon: Gamepad2,
        gradient: 'from-indigo-500 to-indigo-600',
        bgClass: 'bg-indigo-500',
        shadowClass: 'shadow-indigo-500/20'
    },
    {
        icon: Building2,
        gradient: 'from-cyan-500 to-cyan-600',
        bgClass: 'bg-cyan-500',
        shadowClass: 'shadow-cyan-500/20'
    }
];

// Generate consistent theme based on shop ID
const getShopTheme = (shopId: number) => {
    return SHOP_THEMES[shopId % SHOP_THEMES.length];
};

export const ShopSelector: React.FC = () => {
    const {
        shops,
        currentShop,
        setCurrentShopById,
        hasShops,
        hasMultipleShops,
        canSwitchShops
    } = useShopSelection();

    const { collapsed } = useSidebar();
    const [isOpen, setIsOpen] = useState(false);

    // Loading state
    if (!hasShops && shops.length === 0) {
        return (
            <div className={`w-full ${collapsed ? 'p-3 h-12 flex items-center justify-center' : 'p-4'} bg-slate-800/50 animate-pulse rounded-2xl`}>
                {collapsed ? (
                    <Store className="w-6 h-6 text-slate-400" />
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-xl animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 bg-slate-600 rounded animate-pulse"></div>
                            <div className="h-2 w-1/2 bg-slate-600 rounded animate-pulse"></div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // No shops available
    if (!hasShops) {
        return collapsed ? (
            <div className="w-full flex items-center justify-center p-3 h-12 bg-slate-800 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-slate-400" />
            </div>
        ) : (
            <div className="text-center p-4 bg-slate-800/30 rounded-2xl border border-slate-600/20">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300">No shops configured</p>
                <p className="text-xs text-slate-500 mt-1">Go to Settings to add shops</p>
            </div>
        );
    }

    // No current shop selected
    if (!currentShop) {
        return collapsed ? (
            <div className="w-full flex items-center justify-center p-3 h-12 bg-slate-800 rounded-2xl">
                <Store className="w-6 h-6 text-slate-400" />
            </div>
        ) : (
            <div className="text-center p-4 bg-slate-800/30 rounded-2xl border border-slate-600/20">
                <Store className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300">No shop selected</p>
                {hasShops && (
                    <button
                        onClick={() => setCurrentShopById(shops[0].id)}
                        className="text-xs text-purple-400 hover:text-purple-300 mt-1"
                    >
                        Select {shops[0].name}
                    </button>
                )}
            </div>
        );
    }

    const currentTheme = getShopTheme(currentShop.id);
    const CurrentIcon = currentTheme.icon;

    const handleShopSelect = (shopId: number) => {
        setCurrentShopById(shopId);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => canSwitchShops ? setIsOpen(!isOpen) : undefined}
                disabled={!canSwitchShops}
                className={`group w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 bg-gradient-to-r ${currentTheme.gradient} hover:shadow-lg hover:${currentTheme.shadowClass} ${
                    collapsed ? 'justify-center' : ''
                } ${
                    canSwitchShops ? 'cursor-pointer' : 'cursor-default'
                }`}
            >
                <div className={`${collapsed ? 'w-6 h-6' : 'w-10 h-10'} ${currentTheme.bgClass} bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10`}>
                    <CurrentIcon className={`${collapsed ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                </div>

                {!collapsed && (
                    <>
                        <div className="flex-1 text-left">
                            <p className="text-white font-semibold text-sm truncate">
                                {currentShop.name}
                            </p>
                            <p className="text-white/70 text-xs">
                                {canSwitchShops ? 'Tap to switch shop' : 'Single shop mode'}
                            </p>
                        </div>

                        {canSwitchShops && (
                            <ChevronDown
                                className={`w-4 h-4 text-white/80 transition-transform duration-200 ${
                                    isOpen ? 'rotate-180' : ''
                                }`}
                            />
                        )}
                    </>
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        <div className="font-medium">{currentShop.name}</div>
                        <div className="text-xs text-slate-300">
                            {currentShop.abbr_3}
                            {canSwitchShops && ' • Click to switch'}
                        </div>
                        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
                    </div>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && canSwitchShops && (
                <div className={`absolute ${collapsed ? 'left-full ml-2 top-0' : 'top-full left-0 right-0 mt-2'} bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-600/20 overflow-hidden z-50 min-w-64`}>
                    <div className="p-2">
                        <div className="text-xs text-slate-400 px-3 py-2 uppercase tracking-wider">
                            Available Shops ({shops.length})
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-1">
                            {shops.map((shop) => {
                                const theme = getShopTheme(shop.id);
                                const Icon = theme.icon;
                                const isSelected = shop.id === currentShop.id;

                                return (
                                    <button
                                        key={shop.id}
                                        onClick={() => handleShopSelect(shop.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-700/50 ${
                                            isSelected ? 'bg-slate-700/30 ring-1 ring-purple-500/30' : ''
                                        }`}
                                    >
                                        <div className={`w-8 h-8 bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center shadow-sm`}>
                                            <Icon className="w-4 h-4 text-white" />
                                        </div>

                                        <div className="flex-1 text-left">
                                            <p className="text-white font-medium text-sm">
                                                {shop.name}
                                            </p>
                                            <p className="text-slate-400 text-xs">
                                                {shop.abbr_3}
                                                {shop.created_at && ` • Created ${new Date(shop.created_at).toLocaleDateString()}`}
                                            </p>
                                        </div>

                                        {isSelected && (
                                            <Check className="w-4 h-4 text-green-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="mt-2 pt-2 border-t border-slate-600/20">
                            <p className="text-xs text-slate-500 px-3 py-1">
                                Manage shops in Settings
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};