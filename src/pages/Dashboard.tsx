import { useSales } from '../contexts/SalesContext';
import { useSalesStats } from '../hooks/useSalesStats';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { RecentOrders } from '../components/Dashboard/RecentOrders';
import { useNavigate } from 'react-router';
import {
    DollarSign,
    ShoppingCart,
    Clock,
    TrendingUp,
    Plus,
    Download,
    BarChart3,
    Settings
} from 'lucide-react';

export function Dashboard() {
    const { sales } = useSales();
    const stats = useSalesStats(sales);
    const navigate = useNavigate();

    return (
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
                    value={`$${stats.totalRevenue.toFixed(1)}K`}
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
                    title="Pending Orders"
                    value={stats.pendingOrders.toString()}
                    change="-5.3%"
                    changeType="negative"
                    icon={<Clock className="w-6 h-6" />}
                    bgColor="bg-gradient-to-r from-pink-500 to-rose-500"
                />
                <StatsCard
                    title="Delivery Rate"
                    value={`${stats.deliveryRate.toFixed(1)}%`}
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

                <RecentOrders orders={stats.recentSales} />
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/sales/add')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Sale
                    </button>
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={() => navigate('/analytics')}
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
                    >
                        <BarChart3 className="w-4 h-4" />
                        Reports
                    </button>
                    <button
                        onClick={() => navigate('/settings')}
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </div>
            </div>
        </div>
    );
}