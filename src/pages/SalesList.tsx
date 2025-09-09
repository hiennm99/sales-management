import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSales } from '../contexts/SalesContext';
import { getStatusColor, getStatusDotColor } from '../utils/salesCalculations';
import {
    Eye,
    Edit,
    Trash2,
    Filter,
    Download,
    Plus,
} from 'lucide-react';

export function SalesList() {
    const { sales, deleteSale } = useSales();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredSales = sales.filter(sale => {
        const matchesSearch = sale.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.sku.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || sale.generalStatus === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            deleteSale(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Sales Management</h1>
                    <p className="text-slate-400">Manage and track all your sales orders</p>
                </div>
                <button
                    onClick={() => navigate('/sales/add')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Sale
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search orders, customers, products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                <div className="flex gap-2 mt-4">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                statusFilter === status
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-700">
                        <tr>
                            <th className="px-6 py-4 text-slate-300 font-medium">Order ID</th>
                            <th className="px-6 py-4 text-slate-300 font-medium">Shop & Customer</th>
                            <th className="px-6 py-4 text-slate-300 font-medium">Product Info</th>
                            <th className="px-6 py-4 text-slate-300 font-medium">Amount</th>
                            <th className="px-6 py-4 text-slate-300 font-medium">Status</th>
                            <th className="px-6 py-4 text-slate-300 font-medium">Date</th>
                            <th className="px-6 py-4 text-slate-300 font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                        {filteredSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${getStatusDotColor(sale.generalStatus)}`} />
                                        <span className="text-white font-medium">{sale.orderId}</span>
                                    </div>
                                    <div className="text-sm text-slate-400 mt-1">{sale.orderDate}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-white font-medium">{sale.shopName}</div>
                                    <div className="text-sm text-slate-400">{sale.customerName}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-white">{sale.sku}</div>
                                    <div className="text-sm text-slate-400">
                                        Size {sale.size} • Qty {sale.quantity} • {sale.type}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-white font-semibold">${sale.total.toFixed(2)}</div>
                                    <div className="text-sm text-slate-400">₫{sale.totalVnd.toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.generalStatus)}`}>
                                            {sale.generalStatus}
                                        </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-300">{new Date(sale.orderDate).toLocaleDateString()}</div>
                                    <div className="text-sm text-slate-400">
                                        {sale.generalStatus === 'delivered' ? 'Delivered' : 'Expected'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => navigate(`/sales/view/${sale.id}`)}
                                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-600 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/sales/edit/${sale.id}`)}
                                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sale.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-slate-700 px-6 py-4 flex items-center justify-between">
                    <div className="text-slate-400 text-sm">
                        Showing 1-{filteredSales.length} of {filteredSales.length} orders
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-slate-600 text-slate-300 rounded hover:bg-slate-500 transition-colors">
                            ←
                        </button>
                        <button className="px-3 py-1 bg-purple-600 text-white rounded">1</button>
                        <button className="px-3 py-1 bg-slate-600 text-slate-300 rounded hover:bg-slate-500 transition-colors">
                            →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}