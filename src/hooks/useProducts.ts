// hooks/useProducts.ts - TanStack Query hooks for products
import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
    type UseQueryOptions,
    type UseMutationOptions,
    type UseInfiniteQueryOptions
} from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { productService } from '../services/productService';
import type { Product, CreateProductData, UpdateProductData } from '../types/product';

// =====================
// QUERY KEYS FACTORY
// =====================
export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...productKeys.lists(), { filters }] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
    stats: () => [...productKeys.all, 'stats'] as const,
    shopConfig: () => ['shop', 'config'] as const,
    nextSku: (shopAbbr?: string) => [...productKeys.all, 'nextSku', shopAbbr] as const,
} as const;

// =====================
// DEFAULT OPTIONS
// =====================
const queryDefaults = {
    staleTime: 5 * 60 * 1000, // 5 minutes - products don't change often
    gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
    retry: (failureCount: number, error: any) => {
        // Don't retry on 404s or auth errors
        if (error?.message?.includes('not found') || error?.status === 404) {
            return false;
        }
        return failureCount < 2;
    },
} as const;

// =====================
// QUERY HOOKS
// =====================

/**
 * Get all products
 */
export function useProducts(
    shopAbbr?: string,
    options?: Partial<UseQueryOptions<Product[], Error>>
) {
    return useQuery({
        queryKey: productKeys.list({ shopAbbr }),
        queryFn: () => productService.getAllProducts(shopAbbr),
        ...queryDefaults,
        ...options,
    });
}

/**
 * Get single product by ID
 */
export function useProduct(
    id?: string,
    options?: Partial<UseQueryOptions<Product, Error>>
) {
    return useQuery({
        queryKey: productKeys.detail(id!),
        queryFn: () => productService.getProductById(id!),
        enabled: !!id,
        ...queryDefaults,
        ...options,
    });
}

/**
 * Check if shop is configured
 */
export function useShopConfiguration(
    options?: Partial<UseQueryOptions<boolean, Error>>
) {
    return useQuery({
        queryKey: productKeys.shopConfig(),
        queryFn: () => productService.isShopConfigured(),
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

/**
 * Generate next SKU
 */
export function useNextSKU(
    shopAbbr?: string,
    options?: Partial<UseQueryOptions<string, Error>>
) {
    return useQuery({
        queryKey: productKeys.nextSku(shopAbbr),
        queryFn: () => productService.generateNextSKU(shopAbbr),
        enabled: false, // Only fetch when explicitly requested
        staleTime: 0,   // Always fresh
        gcTime: 0,      // Don't cache
        retry: 2,
        ...options,
    });
}

/**
 * Get product statistics
 */
export function useProductStats(
    shopAbbr?: string,
    options?: Partial<UseQueryOptions<{
        total: number;
        withImages: number;
        byShop: Record<string, number>;
    }, Error>>
) {
    return useQuery({
        queryKey: [...productKeys.stats(), shopAbbr],
        queryFn: () => productService.getProductStats(shopAbbr),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000,
        ...options,
    });
}

/**
 * Infinite query for products (for pagination)
 */
export function useInfiniteProducts(
    shopAbbr?: string,
    pageSize: number = 20,
    options?: Partial<UseInfiniteQueryOptions<Product[], Error>>
) {
    return useInfiniteQuery({
        queryKey: [...productKeys.lists(), 'infinite', { shopAbbr, pageSize }],
        queryFn: async ({ pageParam = 0 }) => {
            // This would need to be implemented in your service
            // For now, just return all products
            const products = await productService.getAllProducts(shopAbbr);
            const start = pageParam * pageSize;
            const end = start + pageSize;
            return products.slice(start, end);
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === pageSize ? allPages.length : undefined;
        },
        initialPageParam: 0,
        ...options,
    });
}

// =====================
// MUTATION HOOKS
// =====================

/**
 * Create product mutation
 */
export function useCreateProduct(
    options?: UseMutationOptions<
        Product,
        Error,
        { productData: CreateProductData; imageFile?: File }
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productData, imageFile }) =>
            productService.createProduct(productData, imageFile),

        onMutate: async ({ productData }) => {
            const toastId = `create-product-${Date.now()}`;
            toast.loading(`Creating product "${productData.title}"...`, { id: toastId });
            return { toastId };
        },

        onSuccess: (newProduct, variables, context) => {
            const { toastId } = context!;
            toast.success(`Product "${newProduct.title}" created successfully!`, { id: toastId });

            // Update all products lists that might include this product
            queryClient.setQueryData<Product[]>(
                productKeys.list({ shopAbbr: newProduct.shop_abbr }),
                (old) => old ? [newProduct, ...old] : [newProduct]
            );

            // Update general products list
            queryClient.setQueryData<Product[]>(
                productKeys.list({}),
                (old) => old ? [newProduct, ...old] : [newProduct]
            );

            // Add to individual cache
            queryClient.setQueryData(productKeys.detail(newProduct.id!.toString()), newProduct);

            // Invalidate related queries
            queryClient.invalidateQueries({
                queryKey: productKeys.nextSku(newProduct.shop_abbr)
            });
            queryClient.invalidateQueries({
                queryKey: productKeys.stats()
            });
        },

        onError: (error, variables, context) => {
            const { toastId } = context!;
            toast.error(`Failed to create product: ${error.message}`, { id: toastId });
            console.error('Create product error:', error);
        },

        ...options,
    });
}

/**
 * Update product mutation
 */
export function useUpdateProduct(
    options?: UseMutationOptions<
        Product,
        Error,
        { id: string; updates: UpdateProductData; imageFile?: File }
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates, imageFile }) =>
            productService.updateProduct(id, updates, imageFile),

        onMutate: async ({ id, updates }) => {
            const toastId = `update-${id}`;
            toast.loading('Updating product...', { id: toastId });

            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: productKeys.detail(id) });

            // Snapshot previous value for rollback
            const previousProduct = queryClient.getQueryData<Product>(productKeys.detail(id));

            // Optimistically update
            if (previousProduct && updates) {
                const optimisticProduct: Product = {
                    ...previousProduct,
                    ...updates,
                    updated_at: new Date().toISOString(),
                };
                queryClient.setQueryData(productKeys.detail(id), optimisticProduct);
            }

            return { previousProduct, toastId };
        },

        onSuccess: (updatedProduct, { id }, context) => {
            const { toastId } = context!;
            toast.success(`Product "${updatedProduct.title}" updated successfully!`, { id: toastId });

            // Update all relevant caches
            queryClient.setQueryData(productKeys.detail(id), updatedProduct);

            // Update in all product lists
            const updateProductInList = (old?: Product[]) =>
                old?.map(p => p.id === parseInt(id) ? updatedProduct : p) || [];

            queryClient.setQueryData<Product[]>(
                productKeys.list({ shopAbbr: updatedProduct.shop_abbr }),
                updateProductInList
            );

            queryClient.setQueryData<Product[]>(
                productKeys.list({}),
                updateProductInList
            );

            // Invalidate stats if shop changed
            queryClient.invalidateQueries({ queryKey: productKeys.stats() });
        },

        onError: (error, { id }, context) => {
            const { previousProduct, toastId } = context!;
            toast.error(`Failed to update product: ${error.message}`, { id: toastId });

            // Rollback optimistic update
            if (previousProduct) {
                queryClient.setQueryData(productKeys.detail(id), previousProduct);
            }

            console.error('Update product error:', error);
        },

        ...options,
    });
}

/**
 * Delete product mutation
 */
export function useDeleteProduct(
    options?: UseMutationOptions<void, Error, { id: string; title: string }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }) => productService.deleteProduct(id),

        onMutate: async ({ id, title }) => {
            const toastId = `delete-${id}`;
            toast.loading(`Deleting "${title}"...`, { id: toastId });

            // Cancel related queries
            await queryClient.cancelQueries({ queryKey: productKeys.detail(id) });

            // Snapshot for rollback
            const previousProduct = queryClient.getQueryData<Product>(productKeys.detail(id));
            const previousProductsList = queryClient.getQueryData<Product[]>(productKeys.list({}));

            // Optimistically remove from all lists
            const removeProductFromList = (old?: Product[]) =>
                old?.filter(p => p.id !== parseInt(id)) || [];

            queryClient.setQueryData<Product[]>(
                productKeys.list({}),
                removeProductFromList
            );

            // Remove from shop-specific list if we know the shop
            if (previousProduct) {
                queryClient.setQueryData<Product[]>(
                    productKeys.list({ shopAbbr: previousProduct.shop_abbr }),
                    removeProductFromList
                );
            }

            return { previousProduct, previousProductsList, toastId };
        },

        onSuccess: (_, { id, title }, context) => {
            const { toastId } = context!;
            toast.success(`"${title}" deleted successfully`, { id: toastId });

            // Remove from individual cache
            queryClient.removeQueries({ queryKey: productKeys.detail(id) });

            // Invalidate stats
            queryClient.invalidateQueries({ queryKey: productKeys.stats() });
        },

        onError: (error, { id }, context) => {
            const { previousProduct, previousProductsList, toastId } = context!;
            toast.error(`Failed to delete: ${error.message}`, { id: toastId });

            // Rollback optimistic updates
            if (previousProductsList) {
                queryClient.setQueryData(productKeys.list({}), previousProductsList);
            }
            if (previousProduct) {
                queryClient.setQueryData(productKeys.detail(id), previousProduct);
                queryClient.setQueryData<Product[]>(
                    productKeys.list({ shopAbbr: previousProduct.shop_abbr }),
                    (old) => old ? [...old, previousProduct] : [previousProduct]
                );
            }

            console.error('Delete product error:', error);
        },

        ...options,
    });
}

// =====================
// COMPOSITE HOOKS
// =====================

/**
 * Products dashboard hook - combines products and shop config
 */
export function useProductsDashboard(shopAbbr?: string) {
    const products = useProducts(shopAbbr);
    const shopConfig = useShopConfiguration();
    const stats = useProductStats(shopAbbr);

    return {
        // Data
        products: products.data || [],
        isShopConfigured: shopConfig.data || false,
        stats: stats.data,

        // Loading states
        isLoading: products.isLoading || shopConfig.isLoading,
        isLoadingStats: stats.isLoading,

        // Error states
        error: products.error || shopConfig.error || stats.error,
        hasError: !!(products.error || shopConfig.error || stats.error),

        // Actions
        refetch: () => {
            return Promise.all([
                products.refetch(),
                shopConfig.refetch(),
                stats.refetch(),
            ]);
        },

        // Status checks
        isEmpty: products.data?.length === 0,
        isSuccess: products.isSuccess && shopConfig.isSuccess,
    };
}

/**
 * Product form hook - handles create/edit operations
 */
export function useProductForm(id?: string) {
    const product = useProduct(id);
    const nextSku = useNextSKU();
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();

    return {
        // Data
        product: product.data,
        suggestedSku: nextSku.data,
        isEditing: !!id,

        // Loading states
        isLoading: product.isLoading,
        isLoadingSku: nextSku.isFetching,
        isSubmitting: createMutation.isPending || updateMutation.isPending,

        // Error states
        error: product.error || createMutation.error || updateMutation.error,
        hasError: !!(product.error || createMutation.error || updateMutation.error),

        // Actions
        generateSku: (shopAbbr?: string) => {
            // Update query key if needed
            nextSku.refetch();
        },

        createProduct: async (productData: CreateProductData, imageFile?: File) => {
            return createMutation.mutateAsync({ productData, imageFile });
        },

        updateProduct: async (updates: UpdateProductData, imageFile?: File) => {
            if (!id) {
                throw new Error('No product ID provided for update');
            }
            return updateMutation.mutateAsync({ id, updates, imageFile });
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
 * Product management hook - for admin/management operations
 */
export function useProductManagement(shopAbbr?: string) {
    const products = useProducts(shopAbbr);
    const stats = useProductStats(shopAbbr);
    const deleteMutation = useDeleteProduct();
    const queryClient = useQueryClient();

    return {
        // Data
        products: products.data || [],
        stats: stats.data,

        // States
        isLoading: products.isLoading || stats.isLoading,
        isDeleting: deleteMutation.isPending,
        error: products.error || stats.error || deleteMutation.error,

        // Actions
        deleteProduct: (id: string, title: string) =>
            deleteMutation.mutateAsync({ id, title }),

        refreshData: () => {
            return Promise.all([
                products.refetch(),
                stats.refetch(),
            ]);
        },

        // Bulk operations
        invalidateAll: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },

        // Status
        isEmpty: products.data?.length === 0,
        hasError: !!(products.error || stats.error),
    };
}