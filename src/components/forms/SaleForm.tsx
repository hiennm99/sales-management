// SaleForm.tsx - Fixed version
import React, { useState, useEffect } from 'react';
import { LoaderCircle, DollarSign, User, Package } from 'lucide-react';
import type { Sale } from '../../types/sale';


interface SaleFormProps {
    mode: 'add' | 'edit' | 'view';
    onSubmit: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
    initialData?: Sale;
    isSubmitting?: boolean;
}

export const SaleForm: React.FC<SaleFormProps> = ({
                                                      mode,
                                                      onSubmit,
                                                      onCancel,
                                                      initialData,
                                                      isSubmitting = false
                                                  }) => {
    const [formData, setFormData] = useState({
        shopName: '',
        orderId: '',
        orderDate: '',
        scheduledShipDate: '',
        sku: '',
        size: '',
        quantity: 1,
        type: '',
        customerName: '',
        customerAddress: '',
        customerPhone: '',
        customerNotes: '',
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        exchangeRate: 24000,
        totalVnd: 0,
        actualShipDate: '',
        internalTrackingNumber: '',
        shippingNote: '',
        shippingUnit: '',
        trackingNumber: '',
        shippingFee: 0,
        shippingExchangeRate: 24000,
        shippingFeeVnd: 0,
        generalStatus: 'new',
        customerStatus: '',
        factoryStatus: '',
        deliveryStatus: '',
        createdBy: 'current-user',
        updatedBy: 'current-user'
    });

    // Initialize form data
    useEffect(() => {
        if (initialData) {
            setFormData({
                shopName: initialData.shopName || '',
                orderId: initialData.orderId || '',
                orderDate: initialData.orderDate || '',
                scheduledShipDate: initialData.scheduledShipDate || '',
                sku: initialData.sku || '',
                size: initialData.size || '',
                quantity: initialData.quantity || 1,
                type: initialData.type || 'Rolled',
                customerName: initialData.customerName || '',
                customerAddress: initialData.customerAddress || '',
                customerPhone: initialData.customerPhone || '',
                customerNotes: initialData.customerNotes || '',
                subtotal: initialData.subtotal || 0,
                discount: initialData.discount || 0,
                tax: initialData.tax || 0,
                total: initialData.total || 0,
                exchangeRate: initialData.exchangeRate || 24000,
                totalVnd: initialData.totalVnd || 0,
                actualShipDate: initialData.actualShipDate || '',
                internalTrackingNumber: initialData.internalTrackingNumber || '',
                shippingNote: initialData.shippingNote || '',
                shippingUnit: initialData.shippingUnit || '',
                trackingNumber: initialData.trackingNumber || '',
                shippingFee: initialData.shippingFee || 0,
                shippingExchangeRate: initialData.shippingExchangeRate || 24000,
                shippingFeeVnd: initialData.shippingFeeVnd || 0,
                generalStatus: initialData.generalStatus || 'processing',
                customerStatus: initialData.customerStatus || '',
                factoryStatus: initialData.factoryStatus || '',
                deliveryStatus: initialData.deliveryStatus || '',
                createdBy: initialData.createdBy || 'current-user',
                updatedBy: 'current-user'
            });
        }
    }, [initialData]);

    // Calculate totals when relevant fields change
    useEffect(() => {
        const total = formData.subtotal - formData.discount + formData.tax + formData.shippingFee;
        const totalVnd = total * formData.exchangeRate;
        const shippingFeeVnd = formData.shippingFee * formData.shippingExchangeRate;

        setFormData(prev => ({
            ...prev,
            total,
            totalVnd,
            shippingFeeVnd
        }));
    }, [formData.subtotal, formData.discount, formData.tax, formData.shippingFee, formData.exchangeRate, formData.shippingExchangeRate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onSubmit(formData);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const isReadOnly = mode === 'view';

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {mode === 'add' ? 'Create New Sale' :
                                    mode === 'edit' ? 'Edit Sale' : 'Sale Details'}
                            </h1>
                            {initialData && (
                                <p className="text-gray-600 mt-1">Order ID: {initialData.orderId}</p>
                            )}

                            {/* Submission status indicator */}
                            {isSubmitting && (
                                <div className="flex items-center gap-2 mt-2">
                                    <LoaderCircle className="w-4 h-4 text-violet-600 animate-spin" />
                                    <span className="text-violet-600 text-sm font-medium">
                                        {mode === 'add' ? 'Creating sale...' : 'Updating sale...'}
                                    </span>
                                </div>
                            )}
                        </div>
                        {mode !== 'add' && (
                            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(formData.generalStatus)}`}>
                                {formData.generalStatus.toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {/* Order Information */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-600" />
                            Order Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Shop Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.shopName}
                                    onChange={(e) => handleInputChange('shopName', e.target.value)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order ID *
                                </label>
                                <input
                                    type="text"
                                    value={formData.orderId}
                                    onChange={(e) => handleInputChange('orderId', e.target.value)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.orderDate.split('T')[0]}
                                    onChange={(e) => handleInputChange('orderDate', e.target.value)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-600" />
                            Product Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SKU *
                                </label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => handleInputChange('sku', e.target.value)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Size *
                                </label>
                                <input
                                    type="text"
                                    value={formData.size}
                                    onChange={(e) => handleInputChange('size', e.target.value)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => handleInputChange('type', e.target.value as 'Rolled' | 'Stretched')}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                >
                                    <option value="Rolled">Rolled</option>
                                    <option value="Stretched">Stretched</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-600" />
                            Customer Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Phone *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.customerPhone}
                                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Address *
                                </label>
                                <textarea
                                    value={formData.customerAddress}
                                    onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                                    disabled={isReadOnly}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-gray-600" />
                            Financial Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subtotal (USD) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.subtotal}
                                    onChange={(e) => handleInputChange('subtotal', parseFloat(e.target.value) || 0)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount (USD)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.discount}
                                    onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tax (USD)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.tax}
                                    onChange={(e) => handleInputChange('tax', parseFloat(e.target.value) || 0)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Exchange Rate (VND/USD)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.exchangeRate}
                                    onChange={(e) => handleInputChange('exchangeRate', parseFloat(e.target.value) || 24000)}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Total (USD):</span>
                                <span className="text-lg font-bold text-gray-900">${formData.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm font-medium text-gray-700">Total (VND):</span>
                                <span className="text-lg font-bold text-gray-900">{formData.totalVnd.toLocaleString()} ₫</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {mode === 'view' ? 'Back' : 'Cancel'}
                        </button>

                        {!isReadOnly && (
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save Draft
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting && <LoaderCircle className="w-4 h-4 animate-spin" />}
                                    {mode === 'add' ?
                                        (isSubmitting ? 'Creating...' : 'Create Sale') :
                                        (isSubmitting ? 'Updating...' : 'Update Sale')
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};