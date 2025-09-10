// Dashboard.tsx - Updated với light theme
import { useSales } from '../contexts/SalesContext.tsx';
import { useSalesStats } from '../hooks/useSalesStats';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentOrders } from '../components/dashboard/RecentOrders';
import { useNavigate } from 'react-router';
import {
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Plus,
    Download,
    BarChart3,
    Settings
} from 'lucide-react';

export function DashboardPage() {
    const { sales } = useSales();
    const stats = useSalesStats(sales);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Main Dashboard</h1>
                        <p className="text-gray-600">Welcome back! Here's what's happening with your business today</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Earnings"
                        value={`$${stats.totalRevenue.toFixed(1)}K`}
                        change="+2.45%"
                        changeType="positive"
                        icon={<BarChart3 className="w-5 h-5 text-purple-600" />}
                        bgColor="bg-purple-100"
                    />
                    <StatsCard
                        title="Spend this month"
                        value="$642.39"
                        change="+12.5%"
                        changeType="positive"
                        icon={<ShoppingCart className="w-5 h-5 text-purple-600" />}
                        bgColor="bg-purple-100"
                    />
                    <StatsCard
                        title="Sales"
                        value="$574.34"
                        change="-5.3%"
                        changeType="negative"
                        icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                        bgColor="bg-blue-100"
                    />
                    <StatsCard
                        title="Your Balance"
                        value="$1,000"
                        change="+8.1%"
                        changeType="positive"
                        icon={<DollarSign className="w-5 h-5 text-blue-600" />}
                        bgColor="bg-blue-100"
                    />
                    <StatsCard
                        title="New Tasks"
                        value="145"
                        change="+18.2%"
                        changeType="positive"
                        icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
                        bgColor="bg-blue-100"
                    />
                    <StatsCard
                        title="Total Projects"
                        value="$2433"
                        change="+24.8%"
                        changeType="positive"
                        icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                        bgColor="bg-blue-100"
                    />
                </div>

                {/* Charts and Recent Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-gray-900 text-lg font-semibold">This month</h3>
                                <p className="text-gray-500 text-sm">Revenue analytics overview</p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-3xl font-bold text-gray-900">$37.5K</div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">Total Spent</span>
                                <span className="text-green-600 font-medium">↗ +2.45%</span>
                            </div>
                        </div>

                        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <TrendingUp className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-gray-500">Revenue trending upward</p>
                                <p className="text-gray-900 text-2xl font-bold mt-2">+34.2%</p>
                            </div>
                        </div>
                    </div>

                    <RecentOrders orders={stats.recentSales} />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-gray-900 text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/sales/add')}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 font-medium shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            New Sale
                        </button>
                        <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button
                            onClick={() => navigate('/analytics')}
                            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Reports
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}