// SalesListPage.tsx - Optimized with better logic and performance
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
    ListChecks, Edit, Eye, Plus, Trash2, Clock, LoaderCircle,
    TimerOff, XOctagon, PackageCheck, Truck, Building,
    RefreshCw, Download, AlertTriangle
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { SaleFilter } from '../components/filters/SaleFilter';
import { useSalesDashboard, useDeleteSale, useSalesRealtime } from '../hooks/useSales';
import { getStatusColor, getStatusDotColor } from '../utils/salesCalculations';
import type { FilterState } from '../components/filters/SaleFilter';

export function SalesListPage() {
    const navigate = useNavigate();

    // Enable real-time updates
    useSalesRealtime();

    // Filter state with better defaults
    const [filters, setFilters] = useState<FilterState>({
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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    // Dashboard data with optimized hook
    const {
        sales,
        stats,
        shops,
        sizes,
        isLoading,
        error,
        refetch
    } = useSalesDashboard(filters);

    const deleteMutation = useDeleteSale();

    // Utility functions - memoized for performance
    const isOverdue = useCallback((scheduledShipDate?: string, status?: string) => {
        if (!scheduledShipDate || status === 'delivered' || status === 'cancelled') {
            return false;
        }
        const today = new Date();
        const shipDate = new Date(scheduledShipDate);
        today.setHours(0, 0, 0, 0);
        shipDate.setHours(0, 0, 0, 0);
        return today > shipDate;
    }, []);

    const getDaysOverdue = useCallback((scheduledShipDate?: string) => {
        if (!scheduledShipDate) return 0;
        const today = new Date();
        const shipDate = new Date(scheduledShipDate);
        const diffTime = today.getTime() - shipDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, []);

    // Advanced client-side filtering - optimized with useMemo
    const filteredSales = useMemo(() => {
        let filtered = sales;

        // Apply additional filters not handled by backend
        if (filters.amountRange.min || filters.amountRange.max) {
            filtered = filtered.filter(sale => {
                const amount = sale.total;
                const min = filters.amountRange.min ? parseFloat(filters.amountRange.min) : -Infinity;
                const max = filters.amountRange.max ? parseFloat(filters.amountRange.max) : Infinity;
                return amount >= min && amount <= max;
            });
        }

        if (filters.shippingStatus !== 'All') {
            filtered = filtered.filter(sale => {
                switch (filters.shippingStatus) {
                    case 'Not Shipped':
                        return !sale.actualShipDate && sale.generalStatus !== 'cancelled';
                    case 'Shipped':
                        return sale.actualShipDate && sale.generalStatus !== 'delivered';
                    case 'Delivered':
                        return sale.generalStatus === 'delivered';
                    default:
                        return true;
                }
            });
        }

        // Factory and customer status filters
        if (filters.factoryStatus) {
            filtered = filtered.filter(sale =>
                sale.factoryStatus?.toLowerCase().includes(filters.factoryStatus.toLowerCase())
            );
        }

        if (filters.customerStatus) {
            filtered = filtered.filter(sale =>
                sale.customerStatus?.toLowerCase().includes(filters.customerStatus.toLowerCase())
            );
        }

        return filtered;
    }, [sales, filters]);

    // Pagination logic
    const paginatedSales = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSales.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSales, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

    // Stats from filtered data - optimized
    const filteredStats = useMemo(() => {
        const overdueSales = filteredSales.filter(sale =>
            isOverdue(sale.scheduledShipDate, sale.generalStatus)
        );

        return {
            total: filteredSales.length,
            overdue: overdueSales.length,
            processing: filteredSales.filter(sale => sale.generalStatus === 'processing').length,
            shipped: filteredSales.filter(sale => sale.generalStatus === 'shipped').length,
            delivered: filteredSales.filter(sale => sale.generalStatus === 'delivered').length,
            cancelled: filteredSales.filter(sale => sale.generalStatus === 'cancelled').length,
            totalRevenue: filteredSales.reduce((sum, sale) => sum + sale.total, 0),
            avgOrderValue: filteredSales.length > 0
                ? filteredSales.reduce((sum, sale) => sum + sale.total, 0) / filteredSales.length
                : 0
        };
    }, [filteredSales, isOverdue]);

    // Event handlers
    const handleDelete = useCallback(async (id: string, orderId: string) => {
        if (window.confirm(`Are you sure you want to delete sale #${orderId}? This action cannot be undone.`)) {
            try {
                await deleteMutation.mutateAsync(id);
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    }, [deleteMutation]);

    const handleExport = useCallback(() => {
        const csvData = filteredSales.map(sale => ({
            'Order ID': sale.orderId,
            'Shop Name': sale.shopName,
            'Customer Name': sale.customerName,
            'Customer Phone': sale.customerPhone,
            'SKU': sale.sku,
            'Size': sale.size,
            'Quantity': sale.quantity,
            'Type': sale.type,
            'Total USD': sale.total,
            'Total VND': sale.totalVnd,
            'Status': sale.generalStatus,
            'Order Date': sale.orderDate,
            'Scheduled Ship': sale.scheduledShipDate || '',
            'Actual Ship': sale.actualShipDate || '',
            'Tracking': sale.trackingNumber || '',
            'Factory Status': sale.factoryStatus || '',
            'Customer Status': sale.customerStatus || ''
        }));

        const headers = Object.keys(csvData[0] || {});
        const csvContent = [
            headers.join(','),
            ...csvData.map(row =>
                headers.map(header => {
                    const value = row[header as keyof typeof row]?.toString() || '';
                    return value.includes(',') ? `"${value}"` : value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sales-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [filteredSales]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Reset pagination when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoaderCircle className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
                    <div className="text-xl font-semibold text-gray-900 mb-2">Loading Sales Data</div>
                    <div className="text-gray-600">Please wait while we fetch your sales...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <div className="text-xl font-semibold text-red-600 mb-2">Unable to Load Sales</div>
                    <div className="text-gray-600 mb-6">
                        {error.message || 'An unexpected error occurred while loading your sales data.'}
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => refetch()}
                            className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
                            {filteredStats.overdue > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 border border-amber-300 rounded-full animate-pulse">
                                    <Clock className="w-4 h-4 text-amber-600" />
                                    <span className="text-amber-700 text-sm font-semibold">
                                        {filteredStats.overdue} Overdue
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-gray-600">
                                Showing {filteredSales.length} of {sales.length} orders
                            </p>
                            {stats && (
                                <div className="text-sm text-gray-500">
                                    Total Revenue: ${filteredStats.totalRevenue.toFixed(2)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => refetch()}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Refresh Data"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={filteredSales.length === 0}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Export to CSV"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>

                        <button
                            onClick={() => navigate('/sales/add')}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Add Sale
                        </button>
                    </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatsCard
                        title="Total Orders"
                        value={filteredStats.total.toLocaleString()}
                        icon={<ListChecks className="w-6 h-6 text-gray-600" />}
                        bgColor="bg-gray-100"
                        change={stats ? `+${((filteredStats.total / sales.length) * 100).toFixed(1)}%` : undefined}
                    />
                    <StatsCard
                        title="Overdue"
                        value={filteredStats.overdue.toString()}
                        icon={<TimerOff className="w-6 h-6 text-amber-600" />}
                        bgColor="bg-amber-100"
                        urgent={filteredStats.overdue > 0}
                    />
                    <StatsCard
                        title="Processing"
                        value={filteredStats.processing.toString()}
                        icon={<LoaderCircle className="w-6 h-6 text-blue-600" />}
                        bgColor="bg-blue-100"
                    />
                    <StatsCard
                        title="Shipped"
                        value={filteredStats.shipped.toString()}
                        icon={<Truck className="w-6 h-6 text-purple-600" />}
                        bgColor="bg-purple-100"
                    />
                    <StatsCard
                        title="Delivered"
                        value={filteredStats.delivered.toString()}
                        icon={<PackageCheck className="w-6 h-6 text-green-600" />}
                        bgColor="bg-green-100"
                    />
                    <StatsCard
                        title="Cancelled"
                        value={filteredStats.cancelled.toString()}
                        icon={<XOctagon className="w-6 h-6 text-red-600" />}
                        bgColor="bg-red-100"
                    />
                </div>

                {/* Filter Component */}
                <SaleFilter
                    filters={filters}
                    onFiltersChange={setFilters}
                    onExport={handleExport}
                    totalCount={sales.length}
                    filteredCount={filteredSales.length}
                    statusCounts={{
                        pending: filteredStats.processing,
                        processing: filteredStats.processing,
                        shipped: filteredStats.shipped,
                        delivered: filteredStats.delivered,
                        cancelled: filteredStats.cancelled
                    }}
                    availableShops={shops}
                    availableSizes={sizes}
                />

                {/* Sales Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Order Details
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Shop & Customer
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Product Info
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Shipping
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {paginatedSales.map((sale) => {
                                const overdue = isOverdue(sale.scheduledShipDate, sale.generalStatus);
                                const daysOverdue = overdue ? getDaysOverdue(sale.scheduledShipDate) : 0;
                                const isDeleting = deleteMutation.isPending && deleteMutation.variables === sale.id;

                                return (
                                    <tr
                                        key={sale.id}
                                        className={`hover:bg-gray-50 transition-all duration-200 ${
                                            overdue ? 'bg-amber-50 border-l-4 border-amber-400' : ''
                                        } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        {/* Order Details */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    overdue ? 'bg-amber-500 animate-pulse' : getStatusDotColor(sale.generalStatus)
                                                }`} />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900">{sale.orderId}</span>
                                                        {overdue && (
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                                                                    OVERDUE
                                                                </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(sale.orderDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Shop & Customer */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Building className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-900">{sale.shopName}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">{sale.customerName}</div>
                                                <div className="text-xs text-gray-500">{sale.customerPhone}</div>
                                            </div>
                                        </td>

                                        {/* Product Info */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="font-medium text-gray-900">{sale.sku}</div>
                                                <div className="text-sm text-gray-600">
                                                    {sale.size} • Qty: {sale.quantity}
                                                </div>
                                                <div className="text-xs text-gray-500">{sale.type}</div>
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="font-bold text-gray-900">${sale.total.toFixed(2)}</div>
                                                <div className="text-xs text-gray-500">
                                                    {sale.totalVnd.toLocaleString()} ₫
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sale.generalStatus)}`}>
                                                    {sale.generalStatus.toUpperCase()}
                                                </span>
                                        </td>

                                        {/* Shipping */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {sale.scheduledShipDate && (
                                                    <div className="text-sm text-gray-600">
                                                        Scheduled: {new Date(sale.scheduledShipDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                                {sale.actualShipDate && (
                                                    <div className="text-sm text-green-600">
                                                        Shipped: {new Date(sale.actualShipDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                                {sale.trackingNumber && (
                                                    <div className="text-xs font-mono text-gray-900">{sale.trackingNumber}</div>
                                                )}
                                                {overdue && (
                                                    <div className="text-xs text-amber-600 font-semibold">
                                                        {daysOverdue} days overdue
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => navigate(`/sales/view/${sale.id}`)}
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/sales/edit/${sale.id}`)}
                                                    className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="Edit Sale"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sale.id, sale.orderId)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="Delete Sale"
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? (
                                                        <LoaderCircle className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredSales.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-xl mb-2">
                                {sales.length === 0 ? 'No sales yet' : 'No sales match your filters'}
                            </div>
                            <div className="text-gray-400 mb-4">
                                {sales.length === 0
                                    ? 'Get started by creating your first sale'
                                    : 'Try adjusting your search criteria or filters'
                                }
                            </div>
                            {sales.length === 0 && (
                                <button
                                    onClick={() => navigate('/sales/add')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create First Sale
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination Footer */}
                    {filteredSales.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-700">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSales.length)} of {filteredSales.length} entries
                                </div>
                                {filteredSales.length !== sales.length && (
                                    <div className="text-sm text-gray-500">
                                        (filtered from {sales.length} total)
                                    </div>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                            const pageNum = currentPage <= 3 ? i + 1 :
                                                currentPage >= totalPages - 2 ? totalPages - 4 + i :
                                                    currentPage - 2 + i;

                                            if (pageNum < 1 || pageNum > totalPages) return null;

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-3 py-1 text-sm rounded transition-colors ${
                                                        pageNum === currentPage
                                                            ? 'bg-violet-600 text-white'
                                                            : 'border border-gray-300 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}