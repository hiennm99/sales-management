// src/contexts/ShopContext.tsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from "react";
import type { Shop } from '../types/shop';
import { useShops, useCurrentShop } from '../hooks/useShops';

interface ShopContextType {
    // Data from React Query
    shops: Shop[];
    currentShop: Shop | null;

    // Loading states
    isLoading: boolean;
    isError: boolean;
    error: Error | null;

    // Actions
    setCurrentShopById: (shopId: number) => void;
    setCurrentShopByAbbr: (abbr: string) => void;
    refreshShops: () => Promise<void>;

    // Helper functions
    getShopById: (id: number) => Shop | undefined;
    getShopByAbbr: (abbr: string) => Shop | undefined;

    // Status checks
    hasShops: boolean;
    hasMultipleShops: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
    // Use React Query hooks
    const shopsQuery = useShops();
    const currentShopQuery = useCurrentShop();

    // Local state for current shop selection
    const [selectedShopId, setSelectedShopId] = useState<number | null>(null);

    // Initialize current shop from localStorage or first available shop
    useEffect(() => {
        if (shopsQuery.data && shopsQuery.data.length > 0 && !selectedShopId) {
            const savedShopId = localStorage.getItem('salesflow_current_shop_id');
            const shopToSelect = savedShopId
                ? shopsQuery.data.find(s => s.id === Number(savedShopId))
                : shopsQuery.data[0];

            if (shopToSelect) {
                setSelectedShopId(shopToSelect.id);
                localStorage.setItem('salesflow_current_shop_id', String(shopToSelect.id));
                console.log(`Shop context initialized with: ${shopToSelect.name} (${shopToSelect.abbr_3})`);
            }
        }
    }, [shopsQuery.data, selectedShopId]);

    // Get current shop from selected ID or fallback to query result
    const getCurrentShop = useCallback((): Shop | null => {
        if (selectedShopId && shopsQuery.data) {
            return shopsQuery.data.find(s => s.id === selectedShopId) || null;
        }
        return currentShopQuery.data || null;
    }, [selectedShopId, shopsQuery.data, currentShopQuery.data]);

    // Actions
    const setCurrentShopById = useCallback((shopId: number) => {
        const selectedShop = shopsQuery.data?.find(shop => shop.id === shopId);
        if (selectedShop) {
            setSelectedShopId(shopId);
            localStorage.setItem('salesflow_current_shop_id', String(shopId));
            console.log(`Switched to shop: ${selectedShop.name} (${selectedShop.abbr_3})`);
        } else {
            console.warn(`Shop with ID ${shopId} not found`);
        }
    }, [shopsQuery.data]);

    const setCurrentShopByAbbr = useCallback((abbr: string) => {
        const selectedShop = shopsQuery.data?.find(shop => shop.abbr_3.toLowerCase() === abbr.toLowerCase());
        if (selectedShop) {
            setCurrentShopById(selectedShop.id);
        } else {
            console.warn(`Shop with abbreviation '${abbr}' not found`);
        }
    }, [shopsQuery.data, setCurrentShopById]);

    const refreshShops = useCallback(async () => {
        await Promise.all([
            shopsQuery.refetch(),
            currentShopQuery.refetch()
        ]);
    }, [shopsQuery, currentShopQuery]);

    // Helper functions
    const getShopById = useCallback((id: number): Shop | undefined => {
        return shopsQuery.data?.find(shop => shop.id === id);
    }, [shopsQuery.data]);

    const getShopByAbbr = useCallback((abbr: string): Shop | undefined => {
        return shopsQuery.data?.find(shop => shop.abbr_3.toLowerCase() === abbr.toLowerCase());
    }, [shopsQuery.data]);

    const value: ShopContextType = {
        // Data
        shops: shopsQuery.data || [],
        currentShop: getCurrentShop(),

        // Loading states
        isLoading: shopsQuery.isLoading || currentShopQuery.isLoading,
        isError: shopsQuery.isError || currentShopQuery.isError,
        error: shopsQuery.error || currentShopQuery.error,

        // Actions
        setCurrentShopById,
        setCurrentShopByAbbr,
        refreshShops,

        // Helpers
        getShopById,
        getShopByAbbr,

        // Status
        hasShops: (shopsQuery.data?.length || 0) > 0,
        hasMultipleShops: (shopsQuery.data?.length || 0) > 1,
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
}

// Custom hook to use ShopContext
export function useShop() {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
}

// Additional helper hooks
export function useCurrentShopId(): number | null {
    const { currentShop } = useShop();
    return currentShop?.id || null;
}

export function useCurrentShopAbbr(): string | null {
    const { currentShop } = useShop();
    return currentShop?.abbr_3 || null;
}

export function useShopSelection() {
    const { shops, currentShop, setCurrentShopById, setCurrentShopByAbbr, hasShops, hasMultipleShops } = useShop();

    return {
        shops,
        currentShop,
        setCurrentShopById,
        setCurrentShopByAbbr,
        hasShops,
        hasMultipleShops,
        canSwitchShops: hasMultipleShops,
    };
}