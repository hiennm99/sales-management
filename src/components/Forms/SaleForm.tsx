import React, { useState } from 'react';
import type { Sale } from '../../types/sale.ts';

interface SaleFormProps {
    mode: 'add' | 'edit' | 'view';
    onSubmit: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
    initialData?: Sale;
}

export const SaleForm: React.FC<SaleFormProps> = ({ mode, onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        shopName: initialData?.shopName || '',
        orderId: initialData?.orderId || '',
        orderDate: initialData?.orderDate || '',
        scheduledShipDate: initialData?.scheduledShipDate || '',
        sku: initialData?.sku || '',
        size: initialData?.size || 'S/M/L/XL',
        quantity: initialData?.quantity || 1,
        type: initialData?.type || 'Rolled' as 'Rolled' | 'Stretched',
        customerName: initialData?.customerName || '',
        customerAddress: initialData?.customerAddress || '',
        customerPhone: initialData?.customerPhone || '',
        customerNotes: initialData?.customerNotes || '',
        subtotal: initialData?.subtotal || 0,
        discount: initialData?.discount || 0,
        tax: initialData?.tax || 0,
        total: initialData?.total || 0,
        exchangeRate: initialData?.exchangeRate || 24500,
        totalVnd: initialData?.totalVnd || 0,
        actualShipDate: initialData?.actualShipDate || '',
        internalTrackingNumber: initialData?.internalTrackingNumber || '',
        shippingNote: initialData?.shippingNote || '',
        shippingUnit: initialData?.shippingUnit || '',
        trackingNumber: initialData?.trackingNumber || '',
        shippingFee: initialData?.shippingFee || 0,
        shippingExchangeRate: initialData?.shippingExchangeRate || 24500,
        shippingFeeVnd: initialData?.shippingFeeVnd || 0,
        generalStatus: initialData?.generalStatus || 'pending' as Sale['generalStatus'],
        customerStatus: initialData?.customerStatus || '',
        factoryStatus: initialData?.factoryStatus || '',
        deliveryStatus: initialData?.deliveryStatus || '',
        createdBy: 'Admin',
        updatedBy: 'Admin'
    });

    const isReadOnly = mode === 'view';

    // Helper function to parse number from string with comma/dot handling
    const parseNumberValue = (value: string | number): number => {
        if (typeof value === 'number') return value;
        if (!value) return 0;

        // Remove spaces and handle different decimal separators
        const cleanValue = value.toString().replace(/\s/g, '').replace(/,/g, '.');
        const parsed = parseFloat(cleanValue);
        return isNaN(parsed) ? 0 : parsed;
    };

    // Helper function to format VND with commas
    const formatVnd = (value: number): string => {
        return value.toLocaleString('vi-VN');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (isReadOnly) return;

        const { name, value, type } = e.target;

        if (type === 'number' || ['subtotal', 'discount', 'tax', 'total', 'totalVnd', 'exchangeRate', 'shippingFee', 'shippingExchangeRate', 'shippingFeeVnd'].includes(name)) {
            const numValue = parseNumberValue(value);
            setFormData(prev => ({
                ...prev,
                [name]: numValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Auto-calculate totals when relevant fields change
    React.useEffect(() => {
        if (!isReadOnly) {
            const calculatedTotal = formData.subtotal - formData.discount + formData.tax;
            const calculatedTotalVnd = calculatedTotal * formData.exchangeRate;
            const calculatedShippingVnd = formData.shippingFee * formData.shippingExchangeRate;

            setFormData(prev => ({
                ...prev,
                total: calculatedTotal,
                totalVnd: calculatedTotalVnd,
                shippingFeeVnd: calculatedShippingVnd
            }));
        }
    }, [formData.subtotal, formData.discount, formData.tax, formData.exchangeRate, formData.shippingFee, formData.shippingExchangeRate, isReadOnly]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;

        onSubmit(formData);
    };

    return (
        <div className="bg-slate-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white">
                    {mode === 'add' ? 'Add New Sale' :
                        mode === 'edit' ? 'Edit Sale' : 'Sale Details'}
                    {initialData && ` - ${initialData.orderId}`}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Order Information */}
                <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/20">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        📦 Order Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Shop Name *
                            </label>
                            <input
                                type="text"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="Enter shop name"
                                required={!isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Order ID *
                            </label>
                            <input
                                type="text"
                                name="orderId"
                                value={formData.orderId}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="Auto-generated"
                                required={!isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Order Date *
                            </label>
                            <input
                                type="date"
                                name="orderDate"
                                value={formData.orderDate}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                required={!isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Scheduled Ship Date
                            </label>
                            <input
                                type="date"
                                name="scheduledShipDate"
                                value={formData.scheduledShipDate}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                SKU *
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="Enter SKU"
                                required={!isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Size
                            </label>
                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                            >
                                <option value="S/M/L/XL">S/M/L/XL</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                min="1"
                                required={!isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                required={!isReadOnly}
                            >
                                <option value="Rolled">Rolled</option>
                                <option value="Stretched">Stretched</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        👤 Customer Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Customer Name *
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="Enter customer name"
                                required={!isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="0901234567"
                                required={!isReadOnly}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Customer Address *
                            </label>
                            <input
                                type="text"
                                name="customerAddress"
                                value={formData.customerAddress}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="Enter full address"
                                required={!isReadOnly}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Customer Notes
                            </label>
                            <textarea
                                name="customerNotes"
                                value={formData.customerNotes}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                rows={3}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="Any special instructions..."
                            />
                        </div>
                    </div>
                </div>

                {/* Financial Details */}
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/20">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        💰 Financial Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Subtotal (USD) *
                            </label>
                            <input
                                type="number"
                                name="subtotal"
                                value={formData.subtotal}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                step="0.01"
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="0.00"
                                required={!isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Discount (USD)
                            </label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                step="0.01"
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Tax (USD)
                            </label>
                            <input
                                type="number"
                                name="tax"
                                value={formData.tax}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                step="0.01"
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Exchange Rate (VND/USD)
                            </label>
                            <input
                                type="number"
                                name="exchangeRate"
                                value={formData.exchangeRate}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="24,500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Total (USD) - Auto Calculated
                            </label>
                            <input
                                type="text"
                                name="total"
                                value={formData.total.toFixed(2)}
                                disabled
                                className="w-full border border-slate-600 bg-slate-600 text-slate-300 rounded-lg px-3 py-2 opacity-75"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Total (VND) - Can Edit Manually
                            </label>
                            <input
                                type="text"
                                name="totalVnd"
                                value={formData.totalVnd.toString()}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="0"
                            />
                            <p className="text-xs text-slate-400 mt-1">Formatted: ₫{formatVnd(formData.totalVnd)}</p>
                        </div>
                    </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/20">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        🚚 Shipping Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Actual Ship Date
                            </label>
                            <input
                                type="date"
                                name="actualShipDate"
                                value={formData.actualShipDate}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Internal Tracking Number
                            </label>
                            <input
                                type="text"
                                name="internalTrackingNumber"
                                value={formData.internalTrackingNumber}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="INT-123456"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Shipping Unit
                            </label>
                            <select
                                name="shippingUnit"
                                value={formData.shippingUnit}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                            >
                                <option value="">Select shipping unit</option>
                                <option value="Viettel Post">Viettel Post</option>
                                <option value="Vietnam Post">Vietnam Post</option>
                                <option value="Giao Hang Nhanh">Giao Hang Nhanh</option>
                                <option value="Giao Hang Tiet Kiem">Giao Hang Tiet Kiem</option>
                                <option value="J&T Express">J&T Express</option>
                                <option value="DHL">DHL</option>
                                <option value="FedEx">FedEx</option>
                                <option value="UPS">UPS</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Tracking Number
                            </label>
                            <input
                                type="text"
                                name="trackingNumber"
                                value={formData.trackingNumber}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="TRK123456789"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Shipping Note
                            </label>
                            <textarea
                                name="shippingNote"
                                value={formData.shippingNote}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                rows={2}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="Shipping instructions or notes..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Shipping Fee (USD)
                            </label>
                            <input
                                type="number"
                                name="shippingFee"
                                value={formData.shippingFee}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                step="0.01"
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Shipping Exchange Rate (VND/USD)
                            </label>
                            <input
                                type="number"
                                name="shippingExchangeRate"
                                value={formData.shippingExchangeRate}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="24,500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Shipping Fee (VND) - Can Edit Manually
                            </label>
                            <input
                                type="text"
                                name="shippingFeeVnd"
                                value={formData.shippingFeeVnd.toString()}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                placeholder="0"
                            />
                            <p className="text-xs text-slate-400 mt-1">Formatted: ₫{formatVnd(formData.shippingFeeVnd)}</p>
                        </div>
                    </div>
                </div>

                {/* Status Information - Only show in edit/view mode */}
                {(mode === 'edit' || mode === 'view') && (
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                            📋 Status Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    General Status
                                </label>
                                <select
                                    name="generalStatus"
                                    value={formData.generalStatus}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Customer Status
                                </label>
                                <input
                                    type="text"
                                    name="customerStatus"
                                    value={formData.customerStatus}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                    placeholder="Customer status"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Factory Status
                                </label>
                                <input
                                    type="text"
                                    name="factoryStatus"
                                    value={formData.factoryStatus}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                    placeholder="Factory status"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Delivery Status
                                </label>
                                <input
                                    type="text"
                                    name="deliveryStatus"
                                    value={formData.deliveryStatus}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                    placeholder="Delivery status"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Section */}
                <div className="bg-slate-700 rounded-lg p-6 border-2 border-purple-500/30">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        📊 Order Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Subtotal:</span>
                                <span className="text-white font-medium">${formData.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Discount:</span>
                                <span className="text-red-400 font-medium">-${formData.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Tax:</span>
                                <span className="text-white font-medium">${formData.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-600 pt-2">
                                <span className="text-white font-semibold">Total (USD):</span>
                                <span className="text-green-400 font-bold text-lg">${formData.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white font-semibold">Total (VND):</span>
                                <span className="text-green-400 font-bold text-lg">₫{formatVnd(formData.totalVnd)}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Shipping Fee (USD):</span>
                                <span className="text-white font-medium">${formData.shippingFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Shipping Fee (VND):</span>
                                <span className="text-white font-medium">₫{formatVnd(formData.shippingFeeVnd)}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-600 pt-2">
                                <span className="text-white font-semibold">Grand Total (USD):</span>
                                <span className="text-purple-400 font-bold text-lg">${(formData.total + formData.shippingFee).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white font-semibold">Grand Total (VND):</span>
                                <span className="text-purple-400 font-bold text-lg">₫{formatVnd(formData.totalVnd + formData.shippingFeeVnd)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        {mode === 'view' ? 'Back' : 'Cancel'}
                    </button>
                    {!isReadOnly && (
                        <>
                            <button
                                type="button"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Save Draft
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                {mode === 'add' ? 'Create Sale' : 'Update Sale'}
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};