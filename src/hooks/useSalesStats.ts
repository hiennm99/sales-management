import { useMemo } from 'react';
import type { Sale } from '../types/Sale';

export function useSalesStats(sales: Sale[]) {
    return useMemo(() => {
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalOrders = sales.length;
        const pendingOrders = sales.filter(sale => sale.generalStatus === 'pending').length;
        const deliveredOrders = sales.filter(sale => sale.generalStatus === 'delivered').length;

        const deliveryRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

        // Group by status for distribution
        const statusDistribution = sales.reduce((acc, sale) => {
            acc[sale.generalStatus] = (acc[sale.generalStatus] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Top products
        const productStats = sales.reduce((acc, sale) => {
            if (!acc[sale.sku]) {
                acc[sale.sku] = { count: 0, revenue: 0, name: sale.sku };
            }
            acc[sale.sku].count += sale.quantity;
            acc[sale.sku].revenue += sale.total;
            return acc;
        }, {} as Record<string, { count: number; revenue: number; name: string }>);

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return {
            totalRevenue,
            totalOrders,
            pendingOrders,
            deliveryRate,
            statusDistribution,
            topProducts,
            recentSales: sales.slice(-5).reverse()
        };
    }, [sales]);
}
