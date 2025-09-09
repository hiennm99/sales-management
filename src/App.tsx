import { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { StatsCard } from './components/Dashboard/StatsCard';
import { RecentOrders } from './components/Dashboard/RecentOrders';
import { SaleForm } from './components/Forms/SaleForm';
import type { Sale } from './types/Sale';
import {mockSales} from "./data/mockSales.ts";
import {
    DollarSign,
    ShoppingCart,
    Clock,
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    Filter,
    Download,
    Plus,
    BarChart3,
    Settings
} from 'lucide-react';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [sales, setSales] = useState<Sale[]>(mockSales);

    const handleAddSale = (newSale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => {
        const sale: Sale = {
            ...newSale,
            id: `ORD-2024-${String(sales.length + 1).padStart(3, '0')}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setSales(prev => [...prev, sale]);
        setCurrentPage('sales-list');
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Good morning, Admin! ☀️</h1>
                    <p className="text-slate-400">Here's what's happening with your sales today</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value="$127.5K"
                    change="+23.4%"
                    changeType="positive"
                    icon={<DollarSign className="w-6 h-6" />}
                    bgColor="bg-gradient-to-r from-purple-600 to-blue-600"
                />
                <StatsCard
                    title="Total Orders"
                    value="2,847"
                    change="+12.5%"
                    changeType="positive"
                    icon={<ShoppingCart className="w-6 h-6" />}
                    bgColor="bg-gradient-to-r from-orange-500 to-red-500"
                />
                <StatsCard
                    title="Pending Orders"
                    value="156"
                    change="-5.3%"
                    changeType="negative"
                    icon={<Clock className="w-6 h-6" />}
                    bgColor="bg-gradient-to-r from-pink-500 to-rose-500"
                />
                <StatsCard
                    title="Growth Rate"
                    value="34.2%"
                    change="+8.1%"
                    changeType="positive"
                    icon={<TrendingUp className="w-6 h-6" />}
                    bgColor="bg-gradient-to-r from-green-500 to-teal-500"
                />
            </div>

            {/* Charts and Recent Orders */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Revenue Analytics</h3>
                    <p className="text-slate-400 text-sm mb-6">Last 30 days performance</p>
                    {/* Simple chart placeholder */}
                    <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-slate-400">Revenue trending upward</p>
                            <p className="text-white text-2xl font-bold mt-2">+34.2%</p>
                        </div>
                    </div>
                </div>

                <RecentOrders orders={sales} />
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => setCurrentPage('add-sale')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Sale
                    </button>
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Reports
                    </button>
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSalesList = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Sales Management</h1>
                    <p className="text-slate-400">Manage and track all your sales orders</p>
                </div>
                <button
                    onClick={() => setCurrentPage('add-sale')}
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

                {/* Status Filter Buttons */}
                <div className="flex gap-2 mt-4">
                    {['All', 'Pending', 'Shipped'].map((status) => (
                        <button
                            key={status}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                status === 'All'
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
                        {sales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${
                                            sale.generalStatus === 'delivered' ? 'bg-green-500' :
                                                sale.generalStatus === 'shipped' ? 'bg-blue-500' :
                                                    sale.generalStatus === 'processing' ? 'bg-orange-500' : 'bg-red-500'
                                        }`} />
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
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        sale.generalStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                            sale.generalStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                sale.generalStatus === 'processing' ? 'bg-orange-100 text-orange-800' :
                                    'bg-red-100 text-red-800'
                    }`}>
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
                                            onClick={() => {/* View details */}}
                                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {/* Edit sale */}}
                                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {/* Delete sale */}}
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
                        Showing 1-{sales.length} of {sales.length} orders
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-slate-600 text-slate-300 rounded hover:bg-slate-500 transition-colors">
                            ←
                        </button>
                        <button className="px-3 py-1 bg-purple-600 text-white rounded">1</button>
                        <button className="px-3 py-1 bg-slate-600 text-slate-300 rounded hover:bg-slate-500 transition-colors">2</button>
                        <button className="px-3 py-1 bg-slate-600 text-slate-300 rounded hover:bg-slate-500 transition-colors">3</button>
                        <button className="px-3 py-1 bg-slate-600 text-slate-300 rounded hover:bg-slate-500 transition-colors">
                            →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Sales Reports & Analytics</h1>
                </div>
                <div className="flex gap-3">
                    <select className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>This Year</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Revenue Trends */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                        💰 Revenue Trends
                    </h3>
                    <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center relative">
                        {/* Mock line chart */}
                        <div className="absolute inset-4">
                            <svg className="w-full h-full" viewBox="0 0 400 200">
                                <polyline
                                    fill="none"
                                    stroke="#8b5cf6"
                                    strokeWidth="3"
                                    points="0,160 50,140 100,100 150,80 200,60 250,40 300,20 350,10 400,5"
                                />
                                <circle cx="400" cy="5" r="4" fill="#8b5cf6" />
                            </svg>
                        </div>
                        <div className="absolute bottom-2 left-4 text-slate-400 text-xs">Week 1</div>
                        <div className="absolute bottom-2 right-4 text-slate-400 text-xs">Week 4</div>
                        <div className="absolute top-2 right-4 text-white text-sm">50K</div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                        👥 Top Products
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div>
                                    <div className="text-white font-medium">TSH-001 - Basic T-Shirt</div>
                                    <div className="text-slate-400 text-sm">245 orders • $12,250</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <div className="text-white font-medium">HOD-002 - Premium Hoodie</div>
                                    <div className="text-slate-400 text-sm">156 orders • $6,380</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <div>
                                    <div className="text-white font-medium">DRS-003 - Summer Dress</div>
                                    <div className="text-slate-400 text-sm">98 orders • $7,840</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div>
                                    <div className="text-white font-medium">PNT-004 - Casual Pants</div>
                                    <div className="text-slate-400 text-sm">67 orders • $5,360</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Order Status Distribution</h3>
                    <div className="flex items-center justify-center h-48">
                        {/* Mock pie chart */}
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="20"
                                    strokeDasharray="113 251"
                                    strokeDashoffset="0"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="20"
                                    strokeDasharray="63 251"
                                    strokeDashoffset="-113"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="20"
                                    strokeDasharray="38 251"
                                    strokeDashoffset="-176"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="20"
                                    strokeDasharray="25 251"
                                    strokeDashoffset="-214"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#6b7280"
                                    strokeWidth="20"
                                    strokeDasharray="12 251"
                                    strokeDashoffset="-239"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span className="text-slate-300">Delivered (45%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span className="text-slate-300">Shipped (25%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded"></div>
                            <span className="text-slate-300">Processing (15%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span className="text-slate-300">Pending (10%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-500 rounded"></div>
                            <span className="text-slate-300">Cancelled (5%)</span>
                        </div>
                    </div>
                </div>

                {/* Customer Analytics & Shipping Performance */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                        👥 Customer Analytics
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Total Customers:</span>
                            <span className="text-white font-semibold">1,847</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">New Customers (30d):</span>
                            <span className="text-white font-semibold">234</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Repeat Customers:</span>
                            <span className="text-white font-semibold">1,613</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Customer Satisfaction:</span>
                            <span className="text-yellow-400 font-semibold">4.7/5.0 ⭐</span>
                        </div>
                    </div>

                    <hr className="border-slate-700 my-6" />

                    <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                        🚚 Shipping Performance
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Avg. Processing Time:</span>
                            <span className="text-white font-semibold">2.3 days</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Avg. Shipping Time:</span>
                            <span className="text-white font-semibold">3.7 days</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">On-Time Delivery Rate:</span>
                            <span className="text-green-400 font-semibold">94.2%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return renderDashboard();
            case 'sales-list':
                return renderSalesList();
            case 'add-sale':
                return (
                    <div className="max-w-4xl">
                        <SaleForm
                            onSubmit={handleAddSale}
                            onCancel={() => setCurrentPage('sales-list')}
                        />
                    </div>
                );
            case 'analytics':
                return renderAnalytics();
            default:
                return renderDashboard();
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex">
            <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
            <main className="flex-1 p-8">
                {renderCurrentPage()}
            </main>
        </div>
    );
}

export default App;