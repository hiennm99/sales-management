// hooks/useShops.ts - TanStack Query hooks for shops
import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
    type UseMutationOptions
} from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { shopService, type CreateShopData, type UpdateShopData } from '../services/shopService';
import type { Shop } from '../types/shop';

// =====================
// QUERY KEYS FACTORY
// =====================
export const shopKeys = {
    all: ['shops'] as const,
    lists: () => [...shopKeys.all, 'list'] as const,
    details: () => [...shopKeys.all, 'detail'] as const,
    detail: (id: number) => [...shopKeys.details(), id] as const,
    byAbbr: (abbr: string) => [...shopKeys.all, 'abbr', abbr] as const,
    current: () => [...shopKeys.all, 'current'] as const,
    hasShops: () => [...shopKeys.all, 'hasShops'] as const,
    stats: (id?: number) => [...shopKeys.all, 'stats', id] as const,
} as const;

// =====================
// DEFAULT OPTIONS
// =====================
const queryDefaults = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
    retry: (failureCount: number, error: any) => {
        // Don't retry on 404s or validation errors
        if (error?.message?.includes('not found') ||
            error?.message?.includes('already exists') ||
            error?.status === 404) {
            return false;
        }
        return failureCount < 2;
    },
} as const;

// =====================
// QUERY HOOKS
// =====================

/**
 * Get all shops
 */
export function useShops(options?: Partial<UseQueryOptions<Shop[], Error>>) {
    return useQuery({
        queryKey: shopKeys.lists(),
        queryFn: () => shopService.getShops(),
        ...queryDefaults,
        ...options,
    });
}

/**
 * Get shop by ID
 */
export function useShop(
    id?: number,
    options?: Partial<UseQueryOptions<Shop, Error>>
) {
    return useQuery({
        queryKey: shopKeys.detail(id!),
        queryFn: () => shopService.getShopById(id!),
        enabled: !!id,
        ...queryDefaults,
        ...options,
    });
}

/**
 * Get shop by abbreviation
 */
export function useShopByAbbr(
    abbr?: string,
    options?: Partial<UseQueryOptions<Shop, Error>>
) {
    return useQuery({
        queryKey: shopKeys.byAbbr(abbr!),
        queryFn: () => shopService.getShopByAbbr(abbr!),
        enabled: !!abbr && abbr.length === 3,
        ...queryDefaults,
        ...options,
    });
}

/**
 * Get current/default shop
 */
export function useCurrentShop(options?: Partial<UseQueryOptions<Shop | null, Error>>) {
    return useQuery({
        queryKey: shopKeys.current(),
        queryFn: () => shopService.getCurrentShop(),
        staleTime: 2 * 60 * 1000, // 2 minutes - current shop changes rarely
        gcTime: 5 * 60 * 1000,    // 5 minutes
        retry: 1,
        ...options,
    });
}

/**
 * Check if any shops exist
 */
export function useHasShops(options?: Partial<UseQueryOptions<boolean, Error>>) {
    return useQuery({
        queryKey: shopKeys.hasShops(),
        queryFn: () => shopService.hasShops(),
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000,    // 5 minutes
        retry: 1,
        ...options,
    });
}

/**
 * Get shop statistics
 */
export function useShopStats(
    id?: number,
    options?: Partial<UseQueryOptions<{
        totalShops: number;
        totalProducts: number;
        productsByShop: Record<string, number>;
    }, Error>>
) {
    return useQuery({
        queryKey: shopKeys.stats(id),
        queryFn: () => shopService.getShopStats(id),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000,
        ...options,
    });
}

// =====================
// MUTATION HOOKS
// =====================

/**
 * Create shop mutation
 */
export function useCreateShop(
    options?: UseMutationOptions<Shop, Error, CreateShopData>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (shopData: CreateShopData) => shopService.createShop(shopData),

        onMutate: (variables) => {
            const toastId = `create-shop-${Date.now()}`;
            toast.loading(`Creating shop "${variables.name}"...`, { id: toastId });
            return { toastId };
        },

        onSuccess: (newShop, variables, context) => {
            const { toastId } = context!;
            toast.success(`Shop "${newShop.name}" created successfully!`, { id: toastId });

            // Update shops list cache
            queryClient.setQueryData<Shop[]>(
                shopKeys.lists(),
                (old) => old ? [newShop, ...old] : [newShop]
            );

            // Set individual shop caches
            queryClient.setQueryData(shopKeys.detail(newShop.id), newShop);
            queryClient.setQueryData(shopKeys.byAbbr(newShop.abbr_3), newShop);

            // Update hasShops cache
            queryClient.setQueryData(shopKeys.hasShops(), true);

            // If this is the first shop, it becomes the current shop
            queryClient.invalidateQueries({ queryKey: shopKeys.current() });

            // Invalidate stats
            queryClient.invalidateQueries({ queryKey: shopKeys.stats() });
        },

        onError: (error, variables, context) => {
            const { toastId } = context!;
            toast.error(`Failed to create shop: ${error.message}`, { id: toastId });
            console.error('Create shop error:', error);
        },

        ...options,
    });
}

/**
 * Update shop mutation
 */
export function useUpdateShop(
    options?: UseMutationOptions<Shop, Error, { id: number; updates: UpdateShopData }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }) => shopService.updateShop(id, updates),

        onMutate: async ({ id, updates }) => {
            const toastId = `update-shop-${id}`;
            toast.loading('Updating shop...', { id: toastId });

            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: shopKeys.detail(id) });

            // Snapshot previous value
            const previousShop = queryClient.getQueryData<Shop>(shopKeys.detail(id));

            // Optimistic update
            if (previousShop && updates) {
                const optimisticShop: Shop = {
                    ...previousShop,
                    ...updates,
                    abbr_3: updates.abbr_3?.toUpperCase() || previousShop.abbr_3,
                    name: updates.name?.trim() || previousShop.name,
                    updated_at: new Date().toISOString(),
                };
                queryClient.setQueryData(shopKeys.detail(id), optimisticShop);
            }

            return { previousShop, toastId };
        },

        onSuccess: (updatedShop, { id }, context) => {
            const { toastId } = context!;
            toast.success(`Shop "${updatedShop.name}" updated successfully!`, { id: toastId });

            // Update all relevant caches
            queryClient.setQueryData(shopKeys.detail(id), updatedShop);
            queryClient.setQueryData(shopKeys.byAbbr(updatedShop.abbr_3), updatedShop);

            // Update shops list
            queryClient.setQueryData<Shop[]>(
                shopKeys.lists(),
                (old) => old?.map(shop => shop.id === id ? updatedShop : shop) || []
            );

            // Update current shop if this was it
            queryClient.setQueryData<Shop | null>(
                shopKeys.current(),
                (current) => current?.id === id ? updatedShop : current
            );

            // Invalidate stats as shop details might affect them
            queryClient.invalidateQueries({ queryKey: shopKeys.stats() });
        },

        onError: (error, { id }, context) => {
            const { previousShop, toastId } = context!;
            toast.error(`Failed to update shop: ${error.message}`, { id: toastId });

            // Rollback optimistic update
            if (previousShop) {
                queryClient.setQueryData(shopKeys.detail(id), previousShop);
            }

            console.error('Update shop error:', error);
        },

        ...options,
    });
}

/**
 * Delete shop mutation
 */
export function useDeleteShop(
    options?: UseMutationOptions<void, Error, { id: number; name: string }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }) => shopService.deleteShop(id),

        onMutate: async ({ id, name }) => {
            const toastId = `delete-shop-${id}`;
            toast.loading(`Deleting shop "${name}"...`, { id: toastId });

            // Cancel related queries
            await queryClient.cancelQueries({ queryKey: shopKeys.detail(id) });

            // Snapshot for rollback
            const previousShops = queryClient.getQueryData<Shop[]>(shopKeys.lists());
            const shopToDelete = previousShops?.find(s => s.id === id);

            // Optimistically remove from list
            queryClient.setQueryData<Shop[]>(
                shopKeys.lists(),
                (old) => old?.filter(shop => shop.id !== id) || []
            );

            return { previousShops, shopToDelete, toastId };
        },

        onSuccess: (_, { id, name }, context) => {
            const { shopToDelete, toastId } = context!;
            toast.success(`Shop "${name}" deleted successfully`, { id: toastId });

            // Remove from individual caches
            queryClient.removeQueries({ queryKey: shopKeys.detail(id) });

            if (shopToDelete) {
                queryClient.removeQueries({ queryKey: shopKeys.byAbbr(shopToDelete.abbr_3) });
            }

            // Update hasShops status
            const remainingShops = queryClient.getQueryData<Shop[]>(shopKeys.lists());
            queryClient.setQueryData(shopKeys.hasShops(), (remainingShops?.length || 0) > 0);

            // Invalidate current shop (might need to select a new one)
            queryClient.invalidateQueries({ queryKey: shopKeys.current() });

            // Invalidate stats
            queryClient.invalidateQueries({ queryKey: shopKeys.stats() });
        },

        onError: (error, { id }, context) => {
            const { previousShops, toastId } = context!;
            toast.error(`Failed to delete shop: ${error.message}`, { id: toastId });

            // Rollback optimistic update
            if (previousShops) {
                queryClient.setQueryData(shopKeys.lists(), previousShops);
            }

            console.error('Delete shop error:', error);
        },

        ...options,
    });
}

// =====================
// COMPOSITE HOOKS
// =====================

/**
 * Shop setup hook - for initial configuration
 */
export function useShopSetup() {
    const hasShops = useHasShops();
    const currentShop = useCurrentShop({ enabled: hasShops.data === true });
    const createMutation = useCreateShop();

    return {
        // Data
        hasShops: hasShops.data || false,
        currentShop: currentShop.data,

        // States
        isLoading: hasShops.isLoading || currentShop.isLoading,
        isCreating: createMutation.isPending,

        // Errors
        error: hasShops.error || currentShop.error || createMutation.error,
        hasError: !!(hasShops.error || currentShop.error || createMutation.error),

        // Actions
        createFirstShop: (shopData: CreateShopData) =>
            createMutation.mutateAsync(shopData),

        // Status
        needsSetup: hasShops.isSuccess && !hasShops.data,
        isReady: hasShops.data && currentShop.data,

        // Refresh
        refetch: () => Promise.all([
            hasShops.refetch(),
            currentShop.refetch(),
        ]),
    };
}

/**
 * Shop management hook - for admin operations
 */
export function useShopManagement() {
    const shops = useShops();
    const stats = useShopStats();
    const updateMutation = useUpdateShop();
    const deleteMutation = useDeleteShop();
    const queryClient = useQueryClient();

    return {
        // Data
        shops: shops.data || [],
        stats: stats.data,

        // States
        isLoading: shops.isLoading || stats.isLoading,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        // Errors
        error: shops.error || stats.error || updateMutation.error || deleteMutation.error,
        hasError: !!(shops.error || stats.error || updateMutation.error || deleteMutation.error),

        // Actions
        updateShop: (id: number, updates: UpdateShopData) =>
            updateMutation.mutateAsync({ id, updates }),

        deleteShop: (id: number, name: string) =>
            deleteMutation.mutateAsync({ id, name }),

        // Bulk operations
        refreshAll: () => Promise.all([
            shops.refetch(),
            stats.refetch(),
        ]),

        invalidateAll: () => {
            queryClient.invalidateQueries({ queryKey: shopKeys.all });
        },

        // Status
        isEmpty: shops.data?.length === 0,
        hasMultipleShops: (shops.data?.length || 0) > 1,
    };
}

/**
 * Shop form hook - for create/edit operations
 */
export function useShopForm(id?: number) {
    const shop = useShop(id);
    const createMutation = useCreateShop();
    const updateMutation = useUpdateShop();

    return {
        // Data
        shop: shop.data,
        isEditing: !!id,

        // States
        isLoading: shop.isLoading,
        isSubmitting: createMutation.isPending || updateMutation.isPending,

        // Errors
        error: shop.error || createMutation.error || updateMutation.error,
        hasError: !!(shop.error || createMutation.error || updateMutation.error),

        // Actions
        createShop: (shopData: CreateShopData) =>
            createMutation.mutateAsync(shopData),

        updateShop: (updates: UpdateShopData) => {
            if (!id) {
                throw new Error('No shop ID provided for update');
            }
            return updateMutation.mutateAsync({ id, updates });
        },

        // Status
        isSuccess: createMutation.isSuccess || updateMutation.isSuccess,
        isError: createMutation.isError || updateMutation.isError,

        // Reset form state
        reset: () => {
            createMutation.reset();
            updateMutation.reset();
        },
    };
}

/**
 * Shop selector hook - for choosing active shop
 */
export function useShopSelector() {
    const shops = useShops();
    const currentShop = useCurrentShop();
    const hasShops = useHasShops();

    return {
        // Data
        shops: shops.data || [],
        currentShop: currentShop.data,
        hasShops: hasShops.data || false,

        // States
        isLoading: shops.isLoading || currentShop.isLoading || hasShops.isLoading,

        // Errors
        error: shops.error || currentShop.error || hasShops.error,

        // Helpers
        getShopByAbbr: (abbr: string) =>
            shops.data?.find(shop => shop.abbr_3 === abbr.toUpperCase()),

        getShopById: (id: number) =>
            shops.data?.find(shop => shop.id === id),

        // Status
        isEmpty: shops.data?.length === 0,
        hasMultiple: (shops.data?.length || 0) > 1,
        needsSetup: hasShops.isSuccess && !hasShops.data,

        // Actions
        refetch: () => Promise.all([
            shops.refetch(),
            currentShop.refetch(),
            hasShops.refetch(),
        ]),
    };
}

/**
 * Shop validation hook - for form validation
 */
export function useShopValidation() {
    const shops = useShops();

    const validateName = (name: string, excludeId?: number): string | null => {
        if (!name || name.trim().length === 0) {
            return 'Shop name is required';
        }

        if (name.trim().length > 100) {
            return 'Shop name must be less than 100 characters';
        }

        const existingShop = shops.data?.find(shop =>
            shop.name.toLowerCase() === name.trim().toLowerCase() &&
            shop.id !== excludeId
        );

        if (existingShop) {
            return 'Shop name already exists';
        }

        return null;
    };

    const validateAbbr = (abbr: string, excludeId?: number): string | null => {
        if (!abbr || abbr.length !== 3) {
            return 'Shop abbreviation must be exactly 3 characters';
        }

        if (!/^[A-Z]{3}$/.test(abbr.toUpperCase())) {
            return 'Shop abbreviation must contain only letters';
        }

        const existingShop = shops.data?.find(shop =>
            shop.abbr_3 === abbr.toUpperCase() &&
            shop.id !== excludeId
        );

        if (existingShop) {
            return 'Shop abbreviation already exists';
        }

        return null;
    };

    const validateShopData = (data: CreateShopData | UpdateShopData, excludeId?: number) => {
        const errors: Record<string, string> = {};

        if ('name' in data && data.name !== undefined) {
            const nameError = validateName(data.name, excludeId);
            if (nameError) errors.name = nameError;
        }

        if ('abbr_3' in data && data.abbr_3 !== undefined) {
            const abbrError = validateAbbr(data.abbr_3, excludeId);
            if (abbrError) errors.abbr_3 = abbrError;
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0,
        };
    };

    return {
        // Validation functions
        validateName,
        validateAbbr,
        validateShopData,

        // Loading state
        isLoading: shops.isLoading,

        // Available shops for reference
        existingShops: shops.data || [],
    };
}