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

    const [activeTab, setActiveTab] = useState('order');
    const isReadOnly = mode === 'view';

    const parseNumberValue = (value: string | number): number => {
        if (typeof value === 'number') return value;
        if (!value) return 0;
        const cleanValue = value.toString().replace(/\s/g, '').replace(/,/g, '.');
        const parsed = parseFloat(cleanValue);
        return isNaN(parsed) ? 0 : parsed;
    };

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

    const tabs = [
        { id: 'order', label: 'Order Info', icon: '📦' },
        { id: 'customer', label: 'Customer', icon: '👤' },
        { id: 'financial', label: 'Financial', icon: '💰' },
        { id: 'shipping', label: 'Shipping', icon: '🚚' },
        ...(mode !== 'add' ? [{ id: 'status', label: 'Status', icon: '📋' }] : [])
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const FormField = ({ label, required = false, children, className = "" }) => (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-slate-300">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            {children}
        </div>
    );

    const Input = ({ className = "", ...props }) => (
        <input
            className={`w-full bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-4 py-2.5 
                       focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 
                       disabled:opacity-50 disabled:bg-slate-800/30 transition-all ${className}`}
            {...props}
        />
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const Select = ({ className = "", children, ...props }) => (
        <select
            className={`w-full bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-4 py-2.5 
                       focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 
                       disabled:opacity-50 disabled:bg-slate-800/30 transition-all ${className}`}
            {...props}
        >
            {children}
        </select>
    );

    const TextArea = ({ className = "", ...props }) => (
        <textarea
            className={`w-full bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-4 py-2.5 
                       focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 
                       disabled:opacity-50 disabled:bg-slate-800/30 transition-all resize-none ${className}`}
            {...props}
        />
    );

    return (
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
            {/* Header */}
            <div className="relative px-8 py-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {mode === 'add' ? 'Create New Sale' :
                                mode === 'edit' ? 'Edit Sale' : 'Sale Details'}
                        </h1>
                        {initialData && (
                            <p className="text-slate-400 mt-1">Order ID: {initialData.orderId}</p>
                        )}
                    </div>
                    {mode !== 'add' && (
                        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(formData.generalStatus)}`}>
                            {formData.generalStatus.toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-8 bg-slate-800/50 rounded-xl p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium flex-1 justify-center
                                       ${activeTab === tab.id
                                ? 'bg-violet-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }`}
                        >
                            <span className="text-base">{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'order' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                                📦 Order Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Shop Name" required>
                                    <Input
                                        name="shopName"
                                        value={formData.shopName}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Enter shop name"
                                        required={!isReadOnly}
                                    />
                                </FormField>
                                <FormField label="Order ID" required>
                                    <Input
                                        name="orderId"
                                        value={formData.orderId}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Auto-generated or manual"
                                        required={!isReadOnly}
                                    />
                                </FormField>
                                <FormField label="Order Date" required>
                                    <Input
                                        type="date"
                                        name="orderDate"
                                        value={formData.orderDate}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        required={!isReadOnly}
                                    />
                                </FormField>
                                <FormField label="Scheduled Ship Date">
                                    <Input
                                        type="date"
                                        name="scheduledShipDate"
                                        value={formData.scheduledShipDate}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                    />
                                </FormField>
                                <FormField label="SKU" required>
                                    <Input
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Product SKU"
                                        required={!isReadOnly}
                                    />
                                </FormField>
                                <FormField label="Size">
                                    <Select
                                        name="size"
                                        value={formData.size}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                    >
                                        <option value="S/M/L/XL">S/M/L/XL</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </Select>
                                </FormField>
                                <FormField label="Quantity" required>
                                    <Input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        min="1"
                                        required={!isReadOnly}
                                    />
                                </FormField>
                                <FormField label="Type" required>
                                    <Select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        required={!isReadOnly}
                                    >
                                        <option value="Rolled">Rolled</option>
                                        <option value="Stretched">Stretched</option>
                                    </Select>
                                </FormField>
                            </div>
                        </div>
                    )}

                    {activeTab === 'customer' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                                👤 Customer Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Customer Name" required>
                                    <Input
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Full name"
                                        required={!isReadOnly}
                                    />
                                </FormField>
                                <FormField label="Phone Number" required>
                                    <Input
                                        type="tel"
                                        name="customerPhone"
                                        value={formData.customerPhone}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="0901234567"
                                        required={!isReadOnly}
                                    />
                                </FormField>
                                <FormField label="Customer Address" required className="md:col-span-2">
                                    <Input
                                        name="customerAddress"
                                        value={formData.customerAddress}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Full delivery address"
                                        required={!isReadOnly}
                                    />
                                </FormField>
                                <FormField label="Customer Notes" className="md:col-span-2">
                                    <TextArea
                                        name="customerNotes"
                                        value={formData.customerNotes}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        rows={3}
                                        placeholder="Special instructions or notes..."
                                    />
                                </FormField>
                            </div>
                        </div>
                    )}

                    {activeTab === 'financial' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                                💰 Financial Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Subtotal (USD)" required>
                                    <Input
                                        type="number"
                                        name="subtotal"
                                        value={formData.subtotal}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        step="0.01"
                                        placeholder="0.00"
                                        required={!isReadOnly}
                                    />
                                </FormField>
                                <FormField label="Discount (USD)">
                                    <Input
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </FormField>
                                <FormField label="Tax (USD)">
                                    <Input
                                        type="number"
                                        name="tax"
                                        value={formData.tax}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </FormField>
                                <FormField label="Exchange Rate (VND/USD)">
                                    <Input
                                        type="number"
                                        name="exchangeRate"
                                        value={formData.exchangeRate}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="24,500"
                                    />
                                </FormField>
                                <FormField label="Total (USD)" className="md:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Input
                                                value={`$${formData.total.toFixed(2)}`}
                                                disabled
                                                className="bg-slate-700/50 text-green-400 font-semibold"
                                            />
                                            <p className="text-xs text-slate-400 mt-1">Auto-calculated</p>
                                        </div>
                                        <div>
                                            <Input
                                                name="totalVnd"
                                                value={formData.totalVnd}
                                                onChange={handleInputChange}
                                                disabled={isReadOnly}
                                                placeholder="VND amount"
                                            />
                                            <p className="text-xs text-slate-400 mt-1">₫{formatVnd(formData.totalVnd)}</p>
                                        </div>
                                    </div>
                                </FormField>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                                🚚 Shipping Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Actual Ship Date">
                                    <Input
                                        type="date"
                                        name="actualShipDate"
                                        value={formData.actualShipDate}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                    />
                                </FormField>
                                <FormField label="Internal Tracking">
                                    <Input
                                        name="internalTrackingNumber"
                                        value={formData.internalTrackingNumber}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="INT-123456"
                                    />
                                </FormField>
                                <FormField label="Shipping Unit">
                                    <Select
                                        name="shippingUnit"
                                        value={formData.shippingUnit}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
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
                                    </Select>
                                </FormField>
                                <FormField label="Tracking Number">
                                    <Input
                                        name="trackingNumber"
                                        value={formData.trackingNumber}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="TRK123456789"
                                    />
                                </FormField>
                                <FormField label="Shipping Fee (USD)">
                                    <Input
                                        type="number"
                                        name="shippingFee"
                                        value={formData.shippingFee}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </FormField>
                                <FormField label="Shipping Exchange Rate">
                                    <Input
                                        type="number"
                                        name="shippingExchangeRate"
                                        value={formData.shippingExchangeRate}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="24,500"
                                    />
                                </FormField>
                                <FormField label="Shipping Note" className="md:col-span-2">
                                    <TextArea
                                        name="shippingNote"
                                        value={formData.shippingNote}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        rows={2}
                                        placeholder="Shipping instructions..."
                                    />
                                </FormField>
                                <FormField label="Shipping Fee (VND)" className="md:col-span-2">
                                    <div className="max-w-md">
                                        <Input
                                            name="shippingFeeVnd"
                                            value={formData.shippingFeeVnd}
                                            onChange={handleInputChange}
                                            disabled={isReadOnly}
                                            placeholder="VND amount"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">₫{formatVnd(formData.shippingFeeVnd)}</p>
                                    </div>
                                </FormField>
                            </div>
                        </div>
                    )}

                    {activeTab === 'status' && (mode === 'edit' || mode === 'view') && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                                📋 Status Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="General Status">
                                    <Select
                                        name="generalStatus"
                                        value={formData.generalStatus}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </Select>
                                </FormField>
                                <FormField label="Customer Status">
                                    <Input
                                        name="customerStatus"
                                        value={formData.customerStatus}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Customer status"
                                    />
                                </FormField>
                                <FormField label="Factory Status">
                                    <Input
                                        name="factoryStatus"
                                        value={formData.factoryStatus}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Factory status"
                                    />
                                </FormField>
                                <FormField label="Delivery Status">
                                    <Input
                                        name="deliveryStatus"
                                        value={formData.deliveryStatus}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Delivery status"
                                    />
                                </FormField>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Panel */}
                <div className="mt-8 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-6 border border-slate-600/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal:</span>
                                <span className="text-white font-medium">${formData.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Discount:</span>
                                <span className="text-red-400 font-medium">-${formData.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Tax:</span>
                                <span className="text-white font-medium">${formData.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-600">
                                <span className="text-white font-semibold">Order Total:</span>
                                <span className="text-green-400 font-bold">${formData.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Shipping (USD):</span>
                                <span className="text-white font-medium">${formData.shippingFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Total VND:</span>
                                <span className="text-white font-medium">₫{formatVnd(formData.totalVnd)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-600">
                                <span className="text-white font-semibold">Grand Total:</span>
                                <div className="text-right">
                                    <div className="text-violet-400 font-bold">${(formData.total + formData.shippingFee).toFixed(2)}</div>
                                    <div className="text-sm text-slate-400">₫{formatVnd(formData.totalVnd + formData.shippingFeeVnd)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-700/50 mt-8">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-all"
                    >
                        {mode === 'view' ? 'Back' : 'Cancel'}
                    </button>

                    {!isReadOnly && (
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-lg hover:shadow-emerald-500/25"
                            >
                                Save Draft
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-violet-500/25 font-medium"
                            >
                                {mode === 'add' ? 'Create Sale' : 'Update Sale'}
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};