import React from 'react';
import type { Sale } from '../../types/sale.ts';

interface RecentOrdersProps {
    orders: Sale[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Recent Orders</h3>
                <p className="text-slate-400 text-sm">Latest transactions</p>
            </div>

            <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                {order.customerName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-medium">{order.orderId}</p>
                                <p className="text-slate-400 text-sm">{order.shopName}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-semibold">${order.total}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.generalStatus)}`}>
                {order.generalStatus}
              </span>
                        </div>
                    </div>
                ))}
                <button className="w-full py-2 text-slate-400 hover:text-white text-sm">
                    View All Orders →
                </button>
            </div>
        </div>
    );
};
