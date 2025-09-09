import type { Sale } from '../types/Sale';

export function calculateSaleTotal(
    subtotal: number,
    discount: number = 0,
    tax: number = 0
): number {
    return subtotal - discount + tax;
}

export function calculateVndTotal(
    usdAmount: number,
    exchangeRate: number
): number {
    return usdAmount * exchangeRate;
}

export function formatCurrency(amount: number, currency: 'USD' | 'VND' = 'USD'): string {
    if (currency === 'VND') {
        return `₫${amount.toLocaleString()}`;
    }
    return `$${amount.toFixed(2)}`;
}

export function getStatusColor(status: Sale['generalStatus']): string {
    switch (status) {
        case 'delivered':
            return 'bg-green-100 text-green-800';
        case 'shipped':
            return 'bg-blue-100 text-blue-800';
        case 'processing':
            return 'bg-orange-100 text-orange-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export function getStatusDotColor(status: Sale['generalStatus']): string {
    switch (status) {
        case 'delivered':
            return 'bg-green-500';
        case 'shipped':
            return 'bg-blue-500';
        case 'processing':
            return 'bg-orange-500';
        case 'pending':
            return 'bg-yellow-500';
        case 'cancelled':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
}