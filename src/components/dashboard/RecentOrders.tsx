import React from 'react';
import type { Sale } from '../../types/sale.ts';

interface RecentOrdersProps {
    orders: Sale[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900 text-lg font-semibold">Recent Orders</h3>
                <p className="text-gray-500 text-sm">Latest transactions</p>
            </div>

            <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                {order.customerName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium">{order.orderId}</p>
                                <p className="text-gray-500 text-sm">{order.shopName}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-900 font-semibold">${order.total}</p>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.generalStatus)}`}>
                                {order.generalStatus}
                            </span>
                        </div>
                    </div>
                ))}
                <button className="w-full py-3 text-purple-600 hover:text-purple-700 text-sm font-medium hover:bg-purple-50 rounded-xl transition-colors">
                    View All Orders →
                </button>
            </div>
        </div>
    );
};