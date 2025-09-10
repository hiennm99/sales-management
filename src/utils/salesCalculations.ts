// utils/salesCalculations.ts
export function getStatusColor(status: string): string {
    switch (status) {
        case 'processing':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'shipped':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'delivered':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

export function getStatusDotColor(status: string): string {
    switch (status) {
        case 'processing':
            return 'bg-blue-500';
        case 'shipped':
            return 'bg-purple-500';
        case 'delivered':
            return 'bg-green-500';
        case 'cancelled':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
}