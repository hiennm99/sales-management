import React, { useState } from 'react';
import type { Sale } from '../../types/Sale';

interface SaleFormProps {
    onSubmit: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
    initialData?: Sale;
}

export const AddSale: React.FC<SaleFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState(
        {
        shopName: initialData?.shopName || '',
        orderId: initialData?.orderId || '',
        orderDate: initialData?.orderDate || '',
        scheduledShipDate: initialData?.scheduledShipDate || '',
        sku: initialData?.sku || '',
        size: initialData?.size || 'S/M/L/XL',
        quantity: initialData?.quantity || 1,
        type: initialData?.type || 'Rolled' as 'Rolled' | 'Stretched',
        customerName: initialData?.customerName || '',
        customerPhone: initialData?.customerPhone || '',
        customerAddress: initialData?.customerAddress || '',
        customerNotes: initialData?.customerNotes || '',
        subtotal: initialData?.subtotal || 0,
        discount: initialData?.discount || 0,
        tax: initialData?.tax || 0,
        exchangeRate: initialData?.exchangeRate || 24500,
        shippingFee: initialData?.shippingFee || 0,
        shippingExchangeRate: initialData?.shippingExchangeRate || 24500,
        generalStatus: initialData?.generalStatus || 'pending' as Sale['generalStatus'],
        customerStatus: initialData?.customerStatus || '',
        factoryStatus: initialData?.factoryStatus || '',
        deliveryStatus: initialData?.deliveryStatus || '',
        createdBy: 'Admin',
        updatedBy: 'Admin'
    }
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const calculateTotals = () => {
        const total = formData.subtotal - formData.discount + formData.tax;
        const totalVnd = total * formData.exchangeRate;
        const shippingFeeVnd = formData.shippingFee * formData.shippingExchangeRate;

        return { total, totalVnd, shippingFeeVnd };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { total, totalVnd, shippingFeeVnd } = calculateTotals();

        onSubmit({
            ...formData,
            total,
            totalVnd,
            shippingFeeVnd
        });
    };

    const { total, totalVnd } = calculateTotals();

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-slate-800">Add New Sale</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Order Information */}
                <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                        📦 Order Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Shop Name *
                            </label>
                            <input
                                type="text"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter shop name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Order ID *
                            </label>
                            <input
                                type="text"
                                name="orderId"
                                value={formData.orderId}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Auto-generated"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Order Date *
                            </label>
                            <input
                                type="date"
                                name="orderDate"
                                value={formData.orderDate}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Ship Date
                            </label>
                            <input
                                type="date"
                                name="scheduledShipDate"
                                value={formData.scheduledShipDate}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                SKU *
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter SKU"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Size
                            </label>
                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="S/M/L/XL">S/M/L/XL</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="Rolled">Rolled</option>
                                <option value="Stretched">Stretched</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                        👤 Customer Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Customer Name *
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter customer name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0901234567"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Address *
                            </label>
                            <input
                                type="text"
                                name="customerAddress"
                                value={formData.customerAddress}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter full address"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Customer Notes
                            </label>
                            <textarea
                                name="customerNotes"
                                value={formData.customerNotes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Any special instructions..."
                            />
                        </div>
                    </div>
                </div>

                {/* Financial Details */}
                <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                        💰 Financial Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Subtotal (USD) *
                            </label>
                            <input
                                type="number"
                                name="subtotal"
                                value={formData.subtotal}
                                onChange={handleInputChange}
                                step="0.01"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Discount (USD)
                            </label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                                step="0.01"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Tax (USD)
                            </label>
                            <input
                                type="number"
                                name="tax"
                                value={formData.tax}
                                onChange={handleInputChange}
                                step="0.01"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Exchange Rate (VND)
                            </label>
                            <input
                                type="number"
                                name="exchangeRate"
                                value={formData.exchangeRate}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="24500"
                            />
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-200">
                        <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-800">
                Total: ${total.toFixed(2)} (₫{totalVnd.toLocaleString()})
              </span>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Save Draft
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create Sale
                    </button>
                </div>
            </form>
        </div>
    );
};