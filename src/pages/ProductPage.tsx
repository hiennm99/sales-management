// ProductPage.tsx - Optimized with React Query hooks
import React, { useState, useRef, useCallback } from 'react';
import {
    Package, Plus, Edit2, Trash2, ExternalLink, AlertCircle,
    Loader2, RefreshCw, X, Upload, ArrowLeft
} from 'lucide-react';
import {
    useProductsDashboard,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
    useNextSKU
} from '../hooks/useProducts';
import type { Product, CreateProductData } from '../types/product';

interface ProductFormData {
    title: string;
    sku: string;
    etsy_url: string;
}

export function ProductPage() {
    // Modal and form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formError, setFormError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ProductFormData>({
        title: '',
        sku: '',
        etsy_url: '',
    });

    // React Query hooks
    const {
        products,
        isShopConfigured,
        isLoading: isLoadingDashboard,
        error: dashboardError,
        refetch
    } = useProductsDashboard();

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();
    const nextSku = useNextSKU();

    // Computed states
    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isGeneratingSku = nextSku.isFetching;

    // Form handlers
    const resetForm = useCallback(() => {
        setFormData({ title: '', sku: '', etsy_url: '' });
        setImagePreview('');
        setEditingProduct(null);
        setFormError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formError) setFormError(''); // Clear error on input change
    }, [formError]);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setFormError('Only image files are supported (JPG, PNG, WebP)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setFormError('File size must not exceed 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
            setFormError('');
        };
        reader.readAsDataURL(file);
    }, []);

    const generateSku = useCallback(async () => {
        try {
            const { data: suggestedSku } = await nextSku.refetch();
            if (suggestedSku) {
                setFormData(prev => ({ ...prev, sku: suggestedSku }));
                setFormError('');
            }
        } catch (error) {
            setFormError('Failed to generate SKU');
        }
    }, [nextSku]);

    const validateForm = useCallback((): boolean => {
        if (!formData.title.trim()) {
            setFormError('Please enter product title');
            return false;
        }
        if (!formData.etsy_url.trim()) {
            setFormError('Please enter product URL');
            return false;
        }

        try {
            new URL(formData.etsy_url);
        } catch {
            setFormError('Invalid URL format');
            return false;
        }

        return true;
    }, [formData]);

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) return;

        const file = fileInputRef.current?.files?.[0];
        const productData: CreateProductData = {
            title: formData.title.trim(),
            sku: formData.sku.trim(),
            etsy_url: formData.etsy_url.trim(),
        };

        try {
            if (editingProduct) {
                await updateMutation.mutateAsync({
                    id: editingProduct.id!,
                    updates: { ...productData, updatedBy: 'current-user' },
                    imageFile: file
                });
            } else {
                await createMutation.mutateAsync({
                    productData,
                    imageFile: file
                });
            }

            // Close modal on success
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            // Error handled by mutation hooks
        }
    }, [validateForm, formData, editingProduct, updateMutation, createMutation, resetForm]);

    // Modal handlers
    const openCreateModal = useCallback(() => {
        resetForm();
        setIsModalOpen(true);
        // Auto-generate SKU for new products
        generateSku();
    }, [resetForm, generateSku]);

    const openEditModal = useCallback((product: Product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title || '',
            sku: product.sku || '',
            etsy_url: product.etsy_url || '',
        });
        setImagePreview(product.image_url || '');
        setIsModalOpen(true);
        setFormError('');
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        resetForm();
    }, [resetForm]);

    // Delete handler
    const handleDelete = useCallback(async (product: Product) => {
        if (window.confirm(`Are you sure you want to delete "${product.title}"? This action cannot be undone.`)) {
            await deleteMutation.mutateAsync({
                id: product.id!,
                title: product.title
            });
        }
    }, [deleteMutation]);

    const formatDate = useCallback((dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }, []);

    // Loading state
    if (isLoadingDashboard) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-violet-600 mb-4" />
                    <div className="text-lg font-semibold text-gray-900 mb-2">Loading Products</div>
                    <div className="text-gray-600">Please wait...</div>
                </div>
            </div>
        );
    }

    // Shop not configured
    if (!isShopConfigured) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
                    <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Shop Not Configured</h2>
                    <p className="text-gray-600 mb-6">
                        Please configure your shop settings before managing products.
                    </p>
                    <a
                        href="/settings"
                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go to Settings
                    </a>
                </div>
            </div>
        );
    }

    // Error state
    if (dashboardError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Products</h2>
                    <p className="text-gray-600 mb-6">{dashboardError.message}</p>
                    <button
                        onClick={() => refetch()}
                        className="flex items-center gap-2 mx-auto px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Package className="text-violet-600" />
                                Product Management
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage your products and images • {products.length} products
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => refetch()}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Refresh Products"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                            <button
                                onClick={openCreateModal}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                        <p className="text-gray-500 mb-6">Get started by adding your first product</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add First Product
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const isDeleting = deleteMutation.isPending && deleteMutation.variables?.id === product.id;

                            return (
                                <div
                                    key={product.id}
                                    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                                        isDeleting ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                >
                                    {/* Product Image */}
                                    <div className="aspect-square relative overflow-hidden">
                                        <img
                                            src={product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                                            }}
                                        />

                                        {/* Action buttons overlay */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-lg shadow-sm transition-all hover:scale-110"
                                                title="Edit Product"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product)}
                                                className="bg-white/90 backdrop-blur-sm hover:bg-white text-red-600 p-2 rounded-lg shadow-sm transition-all hover:scale-110"
                                                title="Delete Product"
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4 space-y-3">
                                        <h3
                                            className="font-semibold text-gray-900 text-lg truncate"
                                            title={product.title}
                                        >
                                            {product.title}
                                        </h3>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Package className="w-4 h-4 flex-shrink-0" />
                                                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                          {product.sku}
                        </span>
                                            </div>

                                            <a
                                                href={product.etsy_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-violet-600 hover:text-violet-700 text-sm transition-colors group"
                                            >
                                                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate group-hover:underline">View Product</span>
                                            </a>
                                        </div>

                                        {/* Metadata */}
                                        <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                                            <div>Created: {formatDate(product.created_at)}</div>
                                            <div>By: {product.created_by}</div>
                                        </div>

                                        {/* Action buttons for mobile */}
                                        <div className="flex gap-2 pt-2 md:hidden">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product)}
                                                disabled={isDeleting}
                                                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm transition-colors disabled:opacity-50"
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Product Form Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="p-6 space-y-6">
                                {/* Modal Header */}
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                        disabled={isSubmitting}
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Error Display */}
                                {formError && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                        <p className="text-red-800 text-sm">{formError}</p>
                                    </div>
                                )}

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    {/* Product Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                            placeholder="Enter product title"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* SKU */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SKU
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="sku"
                                                value={formData.sku}
                                                onChange={handleInputChange}
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono text-sm transition-colors"
                                                placeholder="Auto-generated if empty"
                                                disabled={isSubmitting}
                                            />
                                            <button
                                                type="button"
                                                onClick={generateSku}
                                                disabled={isGeneratingSku || isSubmitting}
                                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                title="Generate new SKU"
                                            >
                                                {isGeneratingSku ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <RefreshCw className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            5-digit format (e.g., 00001)
                                        </p>
                                    </div>

                                    {/* Product URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product URL *
                                        </label>
                                        <input
                                            type="url"
                                            name="etsy_url"
                                            value={formData.etsy_url}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                            placeholder="https://example.com/product"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Image
                                        </label>
                                        <div className="space-y-3">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                className="hidden"
                                                disabled={isSubmitting}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isSubmitting}
                                                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-violet-400 hover:bg-violet-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">
                                                    Click to select image or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    JPG, PNG, WebP - Max 5MB
                                                </p>
                                            </button>

                                            {/* Image Preview */}
                                            {imagePreview && (
                                                <div className="relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImagePreview('');
                                                            if (fileInputRef.current) {
                                                                fileInputRef.current.value = '';
                                                            }
                                                        }}
                                                        disabled={isSubmitting}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors disabled:opacity-50"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                {editingProduct ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            editingProduct ? 'Update Product' : 'Create Product'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}