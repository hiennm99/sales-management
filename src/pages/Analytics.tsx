import { useSales } from '../contexts/SalesContext';
import { useSalesStats } from '../hooks/useSalesStats';
import { StatsCard } from '../components/dashboard/StatsCard';
import {
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Package,
    Users,
    Calendar
} from 'lucide-react';

export function Analytics() {
    const { sales } = useSales();
    const stats = useSalesStats(sales);

    const monthlyData = [
        { month: 'Jan', revenue: 12000, orders: 45 },
        { month: 'Feb', revenue: 15000, orders: 52 },
        { month: 'Mar', revenue: 18000, orders: 67 },
        { month: 'Apr', revenue: 22000, orders: 78 },
        { month: 'May', revenue: 25000, orders: 89 },
        { month: 'Jun', revenue: 28000, orders: 95 }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Sales Analytics</h1>
                    <p className="text-slate-400">Detailed insights into your sales performance</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                        Date Range
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`${stats.totalRevenue.toFixed(0)}`}
                    change="+23.4%"
                    changeType="positive"
                    icon={<DollarSign className="w-6 h-6" />}
                    bgColor="bg-gradient-to-r from-purple-600 to-blue-600"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders.toString()}
                    change="+12.5%"
                    changeType="positive"
                    icon={<ShoppingCart className="w-6 h-6" />}
                    bgColor="bg-gradient-to-r from-orange-500 to-red-500"
                />
                <StatsCard
                    title="Average Order"
                    value={`${(stats.totalRevenue / stats.totalOrders || 0).toFixed(0)}`}
                    change="+8.2%"
                    changeType="positive"
                    icon={<TrendingUp className="w-6 h-6" />}
                    bgColor="bg-gradient-to-r from-green-500 to-teal-500"
                />
                <StatsCard
                    title="Active Products"
                    value={stats.topProducts.length.toString()}
                    change="+5.1%"
                    changeType="positive"
                    icon={<Package className="w-6 h-6" />}
                    bgColor="bg-gradient-to-r from-pink-500 to-rose-500"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white text-lg font-semibold">Monthly Revenue</h3>
                        <select className="bg-slate-700 text-white rounded-lg px-3 py-1 text-sm">
                            <option>Last 6 months</option>
                            <option>Last 12 months</option>
                            <option>This year</option>
                        </select>
                    </div>

                    <div className="h-64 bg-slate-700 rounded-lg p-4">
                        <div className="h-full flex items-end justify-between gap-2">
                            {monthlyData.map((data) => (
                                <div key={data.month} className="flex flex-col items-center gap-2">
                                    <div
                                        className="bg-gradient-to-t from-purple-600 to-blue-500 rounded-t w-8 transition-all hover:opacity-80"
                                        style={{ height: `${(data.revenue / 30000) * 100}%`, minHeight: '20px' }}
                                    />
                                    <span className="text-xs text-slate-400">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-slate-400 text-sm">Total: ${monthlyData.reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}</p>
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white text-lg font-semibold">Monthly Orders</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-slate-400 text-sm">Orders</span>
                        </div>
                    </div>

                    <div className="h-64 bg-slate-700 rounded-lg p-4">
                        <div className="h-full flex items-end justify-between gap-2">
                            {monthlyData.map((data) => (
                                <div key={data.month} className="flex flex-col items-center gap-2">
                                    <div
                                        className="bg-gradient-to-t from-orange-600 to-red-500 rounded-t w-8 transition-all hover:opacity-80"
                                        style={{ height: `${(data.orders / 100) * 100}%`, minHeight: '15px' }}
                                    />
                                    <span className="text-xs text-slate-400">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-slate-400 text-sm">Total: {monthlyData.reduce((sum, data) => sum + data.orders, 0)} orders</p>
                    </div>
                </div>
            </div>

            {/* Status Distribution and Top Products */}
            <div className="grid grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-6">Order Status Distribution</h3>

                    <div className="space-y-4">
                        {Object.entries(stats.statusDistribution).map(([status, count]) => {
                            const percentage = ((count / stats.totalOrders) * 100).toFixed(1);
                            const colors = {
                                pending: 'bg-yellow-500',
                                processing: 'bg-orange-500',
                                shipped: 'bg-blue-500',
                                delivered: 'bg-green-500',
                                cancelled: 'bg-red-500'
                            };

                            return (
                                <div key={status} className="flex items-center gap-4">
                                    <div className="w-16 text-slate-300 text-sm capitalize">{status}</div>
                                    <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full ${colors[status as keyof typeof colors] || 'bg-slate-500'} transition-all`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className="w-12 text-right">
                                        <span className="text-white text-sm font-medium">{count}</span>
                                        <span className="text-slate-400 text-xs ml-1">({percentage}%)</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-6">Top Products by Revenue</h3>

                    <div className="space-y-4">
                        {stats.topProducts.slice(0, 5).map((product, index) => (
                            <div key={product.name} className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-medium">{product.name}</div>
                                    <div className="text-slate-400 text-sm">{product.count} units sold</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-semibold">${product.revenue.toFixed(0)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Performance */}
            <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-lg font-semibold">Performance Overview</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">7 days</button>
                        <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600">30 days</button>
                        <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600">90 days</button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-white text-xl font-bold">98.2%</div>
                        <div className="text-slate-400 text-sm">Success Rate</div>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-white text-xl font-bold">{Math.floor(stats.totalOrders * 0.7)}</div>
                        <div className="text-slate-400 text-sm">Unique Customers</div>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-white text-xl font-bold">{stats.topProducts.length}</div>
                        <div className="text-slate-400 text-sm">Active SKUs</div>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-white text-xl font-bold">2.1</div>
                        <div className="text-slate-400 text-sm">Avg Days to Ship</div>
                    </div>
                </div>
            </div>
        </div>
    );
}