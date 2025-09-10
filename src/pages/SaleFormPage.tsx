// SaleFormPage.tsx - Optimized with better logic flow
import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSaleForm, useSalesRealtime } from '../hooks/useSales';
import { SaleForm } from '../components/forms/SaleForm';
import { LoaderCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import type { CreateSaleData, UpdateSaleData } from '../types/sale';

export const SaleFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Enable real-time updates
    useSalesRealtime();

    // Determine mode from URL path
    const mode = React.useMemo(() => {
        const path = window.location.pathname;
        if (path.includes('/add')) return 'add';
        if (path.includes('/edit')) return 'edit';
        return 'view';
    }, []);

    // Use optimized composite hook
    const {
        sale,
        isLoading,
        isSubmitting,
        error,
        createSale,
        updateSale,
        isSuccess
    } = useSaleForm(id);

    // Navigation handlers
    const handleBack = () => navigate('/sales');

    const handleSubmit = async (formData: CreateSaleData | UpdateSaleData) => {
        try {
            if (mode === 'add') {
                await createSale(formData as CreateSaleData);
            } else if (mode === 'edit') {
                await updateSale(formData as UpdateSaleData);
            }
            // Navigation handled by mutation success callback
        } catch (err) {
            // Error handling is done in the mutation hooks
            console.error('Form submission failed:', err);
        }
    };

    // Redirect on successful creation/update
    React.useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => navigate('/sales'), 1500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

    // Loading state for edit/view modes
    if (isLoading && mode !== 'add') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <LoaderCircle className="w-10 h-10 text-violet-600 animate-spin" />
                    <div className="text-center">
                        <div className="text-lg font-medium text-gray-900">Loading sale data</div>
                        <div className="text-sm text-gray-500">Please wait...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && mode !== 'add') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-red-600 mb-2">
                        {error.message.includes('not found') ? 'Sale Not Found' : 'Error Loading Sale'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error.message.includes('not found')
                            ? "The sale you're looking for doesn't exist or has been removed."
                            : error.message
                        }
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sales
                        </button>
                        {!error.message.includes('not found') && (
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Page content
    const pageTitle = {
        add: 'Add New Sale',
        edit: 'Edit Sale',
        view: 'Sale Details'
    }[mode];

    const pageDescription = {
        add: 'Create a new sales order',
        edit: 'Update sale information',
        view: 'View sale details'
    }[mode];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header with status indicators */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Sales</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {pageTitle}
                                {sale && mode !== 'add' && (
                                    <span className="text-lg text-gray-500 ml-3">#{sale.orderId}</span>
                                )}
                            </h1>
                            <p className="text-gray-600">{pageDescription}</p>
                        </div>

                        {/* Sale ID badge for edit/view modes */}
                        {sale && mode !== 'add' && (
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                    ID: {sale.id.slice(-8)}
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                    sale.generalStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                        sale.generalStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                            sale.generalStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                                sale.generalStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {sale.generalStatus.toUpperCase()}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status indicators */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        {isSubmitting && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                                <LoaderCircle className="w-4 h-4 text-blue-600 animate-spin" />
                                <span className="text-blue-700 text-sm font-medium">
                                    {mode === 'add' ? 'Creating sale...' : 'Updating sale...'}
                                </span>
                            </div>
                        )}

                        {isSuccess && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                                <div className="w-4 h-4 bg-green-500 rounded-full" />
                                <span className="text-green-700 text-sm font-medium">
                                    {mode === 'add' ? 'Sale created successfully!' : 'Sale updated successfully!'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <SaleForm
                        mode={mode}
                        initialData={sale}
                        onSubmit={handleSubmit}
                        onCancel={handleBack}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
};