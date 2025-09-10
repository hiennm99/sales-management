// hooks/useSales.ts - Optimized for TanStack Query best practices
import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
    type UseMutationOptions
} from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { saleService } from '../services/saleService';
import { realtime } from '../services/supabaseClient';
import type { Sale, SaleFilters, CreateSaleData, UpdateSaleData } from '../types/sale';

// Simplified query keys
export const saleKeys = {
    all: ['sales'] as const,
    lists: () => [...saleKeys.all, 'list'] as const,
    list: (filters: SaleFilters) => [...saleKeys.lists(), filters] as const,
    detail: (id: string) => [...saleKeys.all, 'detail', id] as const,
    stats: (params?: { dateFrom?: string; dateTo?: string }) =>
        [...saleKeys.all, 'stats', params] as const,
    shops: () => [...saleKeys.all, 'shops'] as const,
    sizes: () => [...saleKeys.all, 'sizes'] as const,
};

// Convert FilterState to SaleFilters
const normalizeFilters = (filters?: any): SaleFilters => {
    if (!filters) return {};

    return {
        shopName: filters.selectedShops?.length === 1 ? filters.selectedShops[0] : undefined,
        generalStatus: filters.statusFilter !== 'All' ? filters.statusFilter?.toLowerCase() : undefined,
        dateFrom: filters.dateRange?.from,
        dateTo: filters.dateRange?.to,
        overdueOnly: filters.overdueOnly,
        productType: filters.productType !== 'All' ? filters.productType : undefined,
        selectedShops: filters.selectedShops?.length > 1 ? filters.selectedShops : undefined,
        sizesFilter: filters.sizesFilter?.length > 0 ? filters.sizesFilter : undefined,
        searchTerm: filters.searchTerm,
    };
};

// Default query options
const queryDefaults = {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
    retry: 2,
} as const;

// =====================
// QUERY HOOKS
// =====================

export function useSales(filters?: any, options?: Partial<UseQueryOptions<Sale[], Error>>) {
    const saleFilters = useMemo(() => normalizeFilters(filters), [filters]);

    return useQuery({
        queryKey: saleKeys.list(saleFilters),
        queryFn: () => saleService.getAllSales(saleFilters),
        ...queryDefaults,
        ...options,
    });
}

export function useSale(id?: string, options?: Partial<UseQueryOptions<Sale, Error>>) {
    return useQuery({
        queryKey: saleKeys.detail(id!),
        queryFn: () => saleService.getSaleById(id!),
        enabled: !!id,
        ...queryDefaults,
        ...options,
    });
}

export function useSalesStats(dateFrom?: string, dateTo?: string) {
    return useQuery({
        queryKey: saleKeys.stats({ dateFrom, dateTo }),
        queryFn: () => saleService.getStats(dateFrom, dateTo),
        staleTime: 60 * 1000, // 1 minute
        ...queryDefaults,
    });
}

export function useShopNames() {
    return useQuery({
        queryKey: saleKeys.shops(),
        queryFn: () => saleService.getShopNames(),
        staleTime: 30 * 60 * 1000, // 30 minutes - shops don't change often
    });
}

export function useProductSizes() {
    return useQuery({
        queryKey: saleKeys.sizes(),
        queryFn: () => saleService.getProductSizes(),
        staleTime: 30 * 60 * 1000, // 30 minutes - sizes don't change often
    });
}

// =====================
// MUTATION HOOKS
// =====================

export function useCreateSale(options?: UseMutationOptions<Sale, Error, CreateSaleData>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saleService.createSale,
        onMutate: () => {
            toast.loading('Creating sale...', { id: 'create-sale' });
        },
        onSuccess: (newSale) => {
            toast.success(`Sale ${newSale.orderId} created!`, { id: 'create-sale' });

            // Add to cache
            queryClient.setQueryData(saleKeys.detail(newSale.id), newSale);

            // Invalidate lists and stats
            queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: saleKeys.stats() });
        },
        onError: (error) => {
            toast.error(`Failed to create sale: ${error.message}`, { id: 'create-sale' });
        },
        ...options,
    });
}

export function useUpdateSale(options?: UseMutationOptions<Sale, Error, { id: string; data: UpdateSaleData }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => saleService.updateSale(id, data),
        onMutate: ({ id }) => {
            toast.loading('Updating sale...', { id: `update-${id}` });
        },
        onSuccess: (updatedSale, { id }) => {
            toast.success('Sale updated!', { id: `update-${id}` });

            // Update cache
            queryClient.setQueryData(saleKeys.detail(id), updatedSale);
            queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
        },
        onError: (error, { id }) => {
            toast.error(`Update failed: ${error.message}`, { id: `update-${id}` });
        },
        ...options,
    });
}

export function useUpdateSaleStatus(
    options?: UseMutationOptions<Sale, Error, { id: string; status: string; updatedBy: string }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status, updatedBy }) =>
            saleService.updateStatus(id, status as any, updatedBy),
        onSuccess: (updatedSale, { id }) => {
            toast.success(`Status updated to ${updatedSale.generalStatus}`);

            queryClient.setQueryData(saleKeys.detail(id), updatedSale);
            queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: saleKeys.stats() });
        },
        onError: (error) => {
            toast.error(`Status update failed: ${error.message}`);
        },
        ...options,
    });
}

export function useDeleteSale(options?: UseMutationOptions<void, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saleService.deleteSale,
        onMutate: (id) => {
            toast.loading('Deleting sale...', { id: `delete-${id}` });
        },
        onSuccess: (_, id) => {
            toast.success('Sale deleted!', { id: `delete-${id}` });

            // Remove from cache
            queryClient.removeQueries({ queryKey: saleKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: saleKeys.stats() });
        },
        onError: (error, id) => {
            toast.error(`Delete failed: ${error.message}`, { id: `delete-${id}` });
        },
        ...options,
    });
}

export function useBulkUpdateStatus(
    options?: UseMutationOptions<Sale[], Error, { ids: string[]; status: string; updatedBy: string }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ids, status, updatedBy }) =>
            saleService.bulkUpdateStatus(ids, status as any, updatedBy),
        onSuccess: (results) => {
            toast.success(`Updated ${results.length} sales`);
            queryClient.invalidateQueries({ queryKey: saleKeys.all });
        },
        onError: (error) => {
            toast.error(`Bulk update failed: ${error.message}`);
        },
        ...options,
    });
}

// =====================
// REAL-TIME HOOK (Centralized)
// =====================

export function useSalesRealtime() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = realtime.subscribeToTable('sales', (payload) => {
            console.log('Sales real-time update:', payload);

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: saleKeys.stats() });

            // Optional: Show toast notifications
            switch (payload.eventType) {
                case 'INSERT':
                    toast('New sale added', { icon: '➕' });
                    break;
                case 'UPDATE':
                    toast('Sale updated', { icon: '✏️' });
                    break;
                case 'DELETE':
                    toast('Sale deleted', { icon: '🗑️' });
                    break;
            }
        });

        return () => realtime.unsubscribe(channel);
    }, [queryClient]);
}

// =====================
// COMPOSITE HOOKS
// =====================

export function useSalesDashboard(filters?: any) {
    const sales = useSales(filters);
    const stats = useSalesStats();
    const shops = useShopNames();
    const sizes = useProductSizes();

    return {
        sales: sales.data || [],
        stats: stats.data,
        shops: shops.data || [],
        sizes: sizes.data || [],

        isLoading: sales.isLoading || stats.isLoading,
        error: sales.error || stats.error,

        refetch: () => {
            sales.refetch();
            stats.refetch();
        }
    };
}

export function useSaleForm(id?: string) {
    const sale = useSale(id);
    const create = useCreateSale();
    const update = useUpdateSale();

    return {
        sale: sale.data,
        isLoading: sale.isLoading,
        isSubmitting: create.isPending || update.isPending,
        error: sale.error || create.error || update.error,

        createSale: create.mutateAsync,
        updateSale: (data: UpdateSaleData) =>
            id ? update.mutateAsync({ id, data }) : Promise.reject('No ID provided'),

        isSuccess: create.isSuccess || update.isSuccess,
    };
}