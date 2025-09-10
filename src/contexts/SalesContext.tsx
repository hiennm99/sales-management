// src/contexts/SalesContext.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from "react";
import type { Sale } from '../types/sale.ts';
import { mockSales } from '../data/mockSales';
import { useAuth } from './AuthContext';
import { useShop } from './ShopContext';

interface SaleContextType {
    // Data
    sales: Sale[];

    // Filtered data
    salesByCurrentShop: Sale[];

    // Actions
    addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Sale>;
    updateSale: (id: string, sale: Partial<Sale>) => Promise<Sale>;
    deleteSale: (id: string) => Promise<void>;
    getSaleById: (id: string) => Sale | undefined;

    // Filtering and searching
    filterSales: (filters: SaleFilters) => Sale[];
    searchSales: (query: string) => Sale[];

    // Statistics
    getSalesStats: (shopAbbr?: string) => SalesStats;

    // Loading and error states
    isLoading: boolean;
    error: string | null;

    // Actions
    refresh: () => Promise<void>;
    clearError: () => void;
}

interface SaleFilters {
    shopAbbr?: string;
    status?: Sale['status'];
    dateFrom?: Date;
    dateTo?: Date;
    minAmount?: number;
    maxAmount?: number;
}

interface SalesStats {
    total: number;
    totalAmount: number;
    averageAmount: number;
    byStatus: Record<Sale['status'], number>;
    byMonth: Record<string, number>;
    recentSales: Sale[];
}

const SalesContext = createContext<SaleContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { currentShop } = useShop();

    const [sales, setSales] = useState<Sale[]>(mockSales);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generate unique sale ID
    const generateSaleId = useCallback(() => {
        const year = new Date().getFullYear();
        const count = sales.length + 1;
        return `ORD-${year}-${String(count).padStart(4, '0')}`;
    }, [sales.length]);

    // Add sale
    const addSale = useCallback(async (newSale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sale> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

            const sale: Sale = {
                ...newSale,
                id: generateSaleId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setSales(prev => [sale, ...prev]);
            console.log(`Sale ${sale.id} created successfully`);

            return sale;
        } catch (err) {
            const errorMessage = 'Failed to create sale';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [generateSaleId]);

    // Update sale
    const updateSale = useCallback(async (id: string, updatedData: Partial<Sale>): Promise<Sale> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 150));

            const existingSale = sales.find(sale => sale.id === id);
            if (!existingSale) {
                throw new Error('Sale not found');
            }

            const updatedSale: Sale = {
                ...existingSale,
                ...updatedData,
                updatedAt: new Date().toISOString(),
            };

            setSales(prev => prev.map(sale =>
                sale.id === id ? updatedSale : sale
            ));

            console.log(`Sale ${id} updated successfully`);
            return updatedSale;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update sale';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [sales]);

    // Delete sale
    const deleteSale = useCallback(async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 200));

            const existingSale = sales.find(sale => sale.id === id);
            if (!existingSale) {
                throw new Error('Sale not found');
            }

            setSales(prev => prev.filter(sale => sale.id !== id));
            console.log(`Sale ${id} deleted successfully`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete sale';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [sales]);

    // Get sale by ID
    const getSaleById = useCallback((id: string): Sale | undefined => {
        return sales.find(sale => sale.id === id);
    }, [sales]);

    // Filter sales
    const filterSales = useCallback((filters: SaleFilters): Sale[] => {
        return sales.filter(sale => {
            if (filters.shopAbbr && sale.shopAbbr !== filters.shopAbbr) return false;
            if (filters.status && sale.status !== filters.status) return false;
            if (filters.dateFrom && new Date(sale.createdAt) < filters.dateFrom) return false;
            if (filters.dateTo && new Date(sale.createdAt) > filters.dateTo) return false;
            if (filters.minAmount && sale.totalAmount < filters.minAmount) return false;
            if (filters.maxAmount && sale.totalAmount > filters.maxAmount) return false;
            return true;
        });
    }, [sales]);

    // Search sales
    const searchSales = useCallback((query: string): Sale[] => {
        if (!query.trim()) return sales;

        const lowercaseQuery = query.toLowerCase();
        return sales.filter(sale =>
            sale.id.toLowerCase().includes(lowercaseQuery) ||
            sale.customerName.toLowerCase().includes(lowercaseQuery) ||
            sale.customerEmail?.toLowerCase().includes(lowercaseQuery) ||
            sale.products.some(product =>
                product.title.toLowerCase().includes(lowercaseQuery) ||
                product.sku.toLowerCase().includes(lowercaseQuery)
            )
        );
    }, [sales]);

    // Get sales statistics
    const getSalesStats = useCallback((shopAbbr?: string): SalesStats => {
        const filteredSales = shopAbbr
            ? sales.filter(sale => sale.shopAbbr === shopAbbr)
            : sales;

        const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

        const byStatus = filteredSales.reduce((acc, sale) => {
            acc[sale.status] = (acc[sale.status] || 0) + 1;
            return acc;
        }, {} as Record<Sale['status'], number>);

        const byMonth = filteredSales.reduce((acc, sale) => {
            const month = new Date(sale.createdAt).toISOString().slice(0, 7);
            acc[month] = (acc[month] || 0) + sale.totalAmount;
            return acc;
        }, {} as Record<string, number>);

        return {
            total: filteredSales.length,
            totalAmount,
            averageAmount: filteredSales.length > 0 ? totalAmount / filteredSales.length : 0,
            byStatus,
            byMonth,
            recentSales: filteredSales.slice(0, 10)
        };
    }, [sales]);

    // Get sales by current shop
    const salesByCurrentShop = useCallback((): Sale[] => {
        if (!currentShop) return [];
        return filterSales({ shopAbbr: currentShop.abbr_3 });
    }, [currentShop, filterSales]);

    // Refresh data (for future API integration)
    const refresh = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API refresh
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('Sales data refreshed');
        } catch (err) {
            setError('Failed to refresh sales data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Auto-clear errors after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const value: SalesContextType = {
        // Data
        sales,
        salesByCurrentShop: salesByCurrentShop(),

        // Actions
        addSale,
        updateSale,
        deleteSale,
        getSaleById,

        // Filtering and searching
        filterSales,
        searchSales,

        // Statistics
        getSalesStats,

        // States
        isLoading,
        error,

        // Actions
        refresh,
        clearError,
    };

    return (
        <SalesContext.Provider value={value}>
            {children}
        </SalesContext.Provider>
    );
}

export function useSales() {
    const context = useContext(SalesContext);
    if (!context) {
        throw new Error('useSales must be used within SalesProvider');
    }
    return context;
}

// Helper hooks
export function useCurrentShopSales() {
    const { salesByCurrentShop, isLoading, error } = useSales();
    const { currentShop } = useShop();

    return {
        sales: salesByCurrentShop,
        shopName: currentShop?.name || 'No Shop Selected',
        isLoading,
        error,
        isEmpty: salesByCurrentShop.length === 0
    };
}

export function useSalesStats(shopAbbr?: string) {
    const { getSalesStats } = useSales();
    const stats = getSalesStats(shopAbbr);

    return {
        ...stats,
        hasData: stats.total > 0,
        isEmpty: stats.total === 0
    };
}