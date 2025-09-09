import {useState} from 'react';
import {AlertTriangle, Download, Edit, Eye, Filter, Plus, Trash2,} from 'lucide-react';
import {mockSales} from "../data/mockSales.ts";
import {useNavigate} from "react-router";
import {getStatusColor, getStatusDotColor} from "../utils/salesCalculations.ts";


export function SalesList() {
    const navigate = useNavigate();
    const sales = mockSales;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Helper function to check if scheduled ship date is overdue
    const isOverdue = (scheduledShipDate: string | number | Date | undefined, status: string) => {
        if (!scheduledShipDate || status === 'delivered' || status === 'cancelled') {
            return false;
        }
        const today = new Date();
        const shipDate = new Date(scheduledShipDate);
        today.setHours(0, 0, 0, 0);
        shipDate.setHours(0, 0, 0, 0);
        return today > shipDate;
    };

    // Helper function to get days overdue
    const getDaysOverdue = (scheduledShipDate: string | number | Date | undefined) => {
        const today = new Date();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const shipDate = new Date(scheduledShipDate);
        const diffTime = today.getTime() - shipDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const filteredSales = sales.filter(sale => {
        const matchesSearch = sale.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.sku.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || sale.generalStatus === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            console.log('Delete sale:', id);
        }
    };

    const overdueCount = sales.filter(sale => isOverdue(sale.scheduledShipDate, sale.generalStatus)).length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Sales Management</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-slate-400">Manage and track all your sales orders</p>
                        {overdueCount > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full animate-pulse">
                                <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                                <span className="text-red-400 text-sm font-medium">
                                    {overdueCount} overdue order{overdueCount > 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => {navigate("/sales/add")}}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Sale
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 border border-slate-600/50 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search orders, customers, products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500/50 focus:outline-none border border-slate-600/50 placeholder-slate-400"
                        />
                    </div>
                    <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all shadow-lg flex items-center gap-2 font-medium">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg flex items-center gap-2 font-medium">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                <div className="flex gap-2">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                statusFilter === status
                                    ? 'bg-violet-600 text-white shadow-lg'
                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gradient-to-r from-slate-700 to-slate-600">
                        <tr>
                            <th className="px-6 py-4 text-slate-200 font-semibold text-sm uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-slate-200 font-semibold text-sm uppercase tracking-wider">Shop & Customer</th>
                            <th className="px-6 py-4 text-slate-200 font-semibold text-sm uppercase tracking-wider">Product Info</th>
                            <th className="px-6 py-4 text-slate-200 font-semibold text-sm uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-slate-200 font-semibold text-sm uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-slate-200 font-semibold text-sm uppercase tracking-wider">Ship Date</th>
                            <th className="px-6 py-4 text-slate-200 font-semibold text-sm uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                        {filteredSales.map((sale) => {
                            const overdue = isOverdue(sale.scheduledShipDate, sale.generalStatus);
                            const daysOverdue = overdue ? getDaysOverdue(sale.scheduledShipDate) : 0;

                            return (
                                <tr
                                    key={sale.id}
                                    className={`hover:bg-slate-700/30 transition-all duration-200 ${
                                        overdue ? 'bg-red-500/5 hover:bg-red-500/10' : ''
                                    }`}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${getStatusDotColor(sale.generalStatus)} ${overdue ? 'animate-pulse' : ''}`} />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-semibold text-lg">{sale.orderId}</span>
                                                    {overdue && (
                                                        <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
                                                    )}
                                                </div>
                                                <div className="text-sm text-slate-400 mt-1">
                                                    Order: {new Date(sale.orderDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-white font-medium text-lg">{sale.shopName}</div>
                                        <div className="text-slate-400 mt-1">{sale.customerName}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-white font-medium">{sale.sku}</div>
                                        <div className="text-sm text-slate-400 mt-1">
                                                <span className="inline-flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-md">
                                                    Size {sale.size} • Qty {sale.quantity} • {sale.type}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-white font-bold text-lg">${sale.total.toFixed(2)}</div>
                                        <div className="text-sm text-slate-400">₫{sale.totalVnd.toLocaleString('vi-VN')}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                            <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${getStatusColor(sale.generalStatus)}`}>
                                                {sale.generalStatus}
                                            </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`flex flex-col ${overdue ? 'animate-pulse' : ''}`}>
                                            <div className={`font-medium ${overdue ? 'text-red-400' : 'text-slate-200'}`}>
                                                {sale.scheduledShipDate ?
                                                    new Date(sale.scheduledShipDate).toLocaleDateString() :
                                                    'Not scheduled'
                                                }
                                            </div>
                                            {overdue && (
                                                <div className="text-xs text-red-400 font-semibold bg-red-500/20 px-2 py-1 rounded-md mt-1 animate-pulse">
                                                    {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue!
                                                </div>
                                            )}
                                            {!overdue && sale.scheduledShipDate && (
                                                <div className="text-xs text-slate-400 mt-1">
                                                    Scheduled
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => navigate(`/sales/view/${sale.id}`)}
                                                className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/sales/edit/${sale.id}`)}
                                                className="p-2.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sale.id)}
                                                className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {filteredSales.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-slate-400 text-xl mb-2">No sales found</div>
                        <div className="text-slate-500">Try adjusting your search or filters</div>
                    </div>
                )}

                {/* Pagination */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4 flex items-center justify-between">
                    <div className="text-slate-300 font-medium">
                        Showing 1-{filteredSales.length} of {filteredSales.length} orders
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-300 hover:text-white rounded-lg transition-all">
                            ←
                        </button>
                        <button className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium">1</button>
                        <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-300 hover:text-white rounded-lg transition-all">
                            →
                        </button>
                    </div>
                </div>
            </div>

            {/* Overdue Orders Alert Panel */}
            {overdueCount > 0 && (
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-6 animate-pulse shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-500/20 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-red-400 font-bold text-xl">Urgent: Overdue Orders</h3>
                            <p className="text-slate-300 mt-1">
                                {overdueCount} order{overdueCount > 1 ? 's are' : ' is'} past the scheduled ship date
                            </p>
                        </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-slate-200 text-sm">
                            These orders require immediate attention. Please review and update their shipping status or contact the customers about delays.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}