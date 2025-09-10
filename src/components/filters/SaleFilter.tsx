// SaleFilter.tsx - Enhanced with more filter options
import React, { useState } from 'react';
import { Filter, Download, X, Calendar, DollarSign, Package, ChevronDown, Clock, Building } from 'lucide-react';

export interface FilterState {
    searchTerm: string;
    statusFilter: string;
    dateRange: { from: string; to: string };
    amountRange: { min: string; max: string };
    selectedShops: string[];
    overdueOnly: boolean;
    skuFilter: string;
    productType: string; // 'All' | 'Rolled' | 'Stretched'
    sizesFilter: string[];
    shippingStatus: string; // 'All' | 'Not Shipped' | 'Shipped' | 'Delivered'
    factoryStatus: string; // Filter by factory status
    customerStatus: string; // Filter by customer status
}

interface SaleFilterProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    onExport?: () => void;
    totalCount?: number;
    filteredCount?: number;
    statusCounts?: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    availableShops?: string[];
    availableSizes?: string[];
}

export const SaleFilter: React.FC<SaleFilterProps> = ({
                                                          filters,
                                                          onFiltersChange,
                                                          onExport,
                                                          totalCount = 0,
                                                          filteredCount = 0,
                                                          statusCounts = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
                                                          availableShops = [],
                                                          availableSizes = []
                                                      }) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const statusOptions = [
        { value: 'All', label: 'All', count: totalCount },
        { value: 'Processing', label: 'Processing', count: statusCounts.processing, color: 'bg-blue-500' },
        { value: 'Shipped', label: 'Shipped', count: statusCounts.shipped, color: 'bg-purple-500' },
        { value: 'Delivered', label: 'Delivered', count: statusCounts.delivered, color: 'bg-green-500' },
        { value: 'Cancelled', label: 'Cancelled', count: statusCounts.cancelled, color: 'bg-red-500' }
    ];

    const productTypeOptions = [
        { value: 'All', label: 'All Types' },
        { value: 'Rolled', label: 'Rolled' },
        { value: 'Stretched', label: 'Stretched' }
    ];

    const shippingStatusOptions = [
        { value: 'All', label: 'All' },
        { value: 'Not Shipped', label: 'Not Shipped' },
        { value: 'Shipped', label: 'Shipped' },
        { value: 'Delivered', label: 'Delivered' }
    ];

    const updateFilters = (updates: Partial<FilterState>) => {
        onFiltersChange({ ...filters, ...updates });
    };

    const handleClearFilters = () => {
        onFiltersChange({
            searchTerm: '',
            statusFilter: 'All',
            dateRange: { from: '', to: '' },
            amountRange: { min: '', max: '' },
            selectedShops: [],
            overdueOnly: false,
            skuFilter: '',
            productType: 'All',
            sizesFilter: [],
            shippingStatus: 'All',
            factoryStatus: '',
            customerStatus: ''
        });
        setShowAdvancedFilters(false);
    };

    const hasActiveFilters = filters.searchTerm || filters.statusFilter !== 'All' ||
        filters.dateRange.from || filters.dateRange.to ||
        filters.amountRange.min || filters.amountRange.max ||
        filters.selectedShops.length > 0 || filters.overdueOnly ||
        filters.skuFilter || filters.productType !== 'All' ||
        filters.sizesFilter.length > 0 || filters.shippingStatus !== 'All' ||
        filters.factoryStatus || filters.customerStatus;

    const toggleShop = (shop: string) => {
        const newShops = filters.selectedShops.includes(shop)
            ? filters.selectedShops.filter(s => s !== shop)
            : [...filters.selectedShops, shop];
        updateFilters({ selectedShops: newShops });
    };

    const toggleSize = (size: string) => {
        const newSizes = filters.sizesFilter.includes(size)
            ? filters.sizesFilter.filter(s => s !== size)
            : [...filters.sizesFilter, size];
        updateFilters({ sizesFilter: newSizes });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Main Filter Bar */}
            <div className="p-6 pb-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search orders, customers, SKU, tracking..."
                            value={filters.searchTerm}
                            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                            className="w-full bg-gray-50 text-gray-900 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-violet-500 focus:outline-none border border-gray-200 placeholder-gray-500 text-sm"
                        />
                        <Package className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        {filters.searchTerm && (
                            <button
                                onClick={() => updateFilters({ searchTerm: '' })}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => updateFilters({ overdueOnly: !filters.overdueOnly })}
                        className={`px-4 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 font-medium text-sm ${
                            filters.overdueOnly
                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        Overdue Only
                    </button>

                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`px-4 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 font-medium text-sm ${
                            showAdvancedFilters || hasActiveFilters
                                ? 'bg-violet-600 text-white hover:bg-violet-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        Advanced
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                        onClick={onExport}
                        className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm flex items-center gap-2 font-medium text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                {/* Status Filter Pills */}
                <div className="flex gap-2 flex-wrap">
                    {statusOptions.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => updateFilters({ statusFilter: status.value })}
                            className={`px-3 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                                filters.statusFilter === status.value
                                    ? 'bg-violet-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {status.value !== 'All' && (
                                <div className={`w-2 h-2 rounded-full ${status.color}`} />
                            )}
                            {status.label}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                filters.statusFilter === status.value
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {status.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="border-t border-gray-200 bg-gray-50/50">
                    <div className="p-6 space-y-6">
                        {/* Row 1: Date Range & Amount Range */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                    <Calendar className="w-4 h-4 mr-2 text-violet-600" />
                                    Order Date Range
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">From</label>
                                        <input
                                            type="date"
                                            value={filters.dateRange.from}
                                            onChange={(e) => updateFilters({
                                                dateRange: { ...filters.dateRange, from: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">To</label>
                                        <input
                                            type="date"
                                            value={filters.dateRange.to}
                                            onChange={(e) => updateFilters({
                                                dateRange: { ...filters.dateRange, to: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                    <DollarSign className="w-4 h-4 mr-2 text-violet-600" />
                                    Amount Range (USD)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Min</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={filters.amountRange.min}
                                            onChange={(e) => updateFilters({
                                                amountRange: { ...filters.amountRange, min: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Max</label>
                                        <input
                                            type="number"
                                            placeholder="999.99"
                                            value={filters.amountRange.max}
                                            onChange={(e) => updateFilters({
                                                amountRange: { ...filters.amountRange, max: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Product Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                    SKU Filter
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter SKU..."
                                    value={filters.skuFilter}
                                    onChange={(e) => updateFilters({ skuFilter: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                />
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                    Product Type
                                </label>
                                <select
                                    value={filters.productType}
                                    onChange={(e) => updateFilters({ productType: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                >
                                    {productTypeOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                    Shipping Status
                                </label>
                                <select
                                    value={filters.shippingStatus}
                                    onChange={(e) => updateFilters({ shippingStatus: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                >
                                    {shippingStatusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 3: Shop & Size Selection */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                    <Building className="w-4 h-4 mr-2 text-violet-600" />
                                    Shops ({filters.selectedShops.length} selected)
                                </label>
                                <div className="max-h-32 overflow-y-auto space-y-2">
                                    {availableShops.map(shop => (
                                        <label key={shop} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={filters.selectedShops.includes(shop)}
                                                onChange={() => toggleShop(shop)}
                                                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                            />
                                            <span className="text-gray-700">{shop}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                    Sizes ({filters.sizesFilter.length} selected)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                                filters.sizesFilter.includes(size)
                                                    ? 'bg-violet-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Status Filters */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                    Factory Status
                                </label>
                                <input
                                    type="text"
                                    placeholder="Filter by factory status..."
                                    value={filters.factoryStatus}
                                    onChange={(e) => updateFilters({ factoryStatus: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                />
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                    Customer Status
                                </label>
                                <input
                                    type="text"
                                    placeholder="Filter by customer status..."
                                    value={filters.customerStatus}
                                    onChange={(e) => updateFilters({ customerStatus: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                {hasActiveFilters ? `${filteredCount} of ${totalCount} orders match filters` : `${totalCount} total orders`}
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};