export interface Sale {
    id: string;

    // Order Information
    shopName: string;
    orderId: string;
    orderDate: string;
    scheduledShipDate?: string;

    // Product Information
    sku: string;
    size: string;
    quantity: number;
    type: 'Rolled' | 'Stretched';

    // Customer Information
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    customerNotes?: string;

    // Financial Information
    subtotal: number; // USD
    discount: number; // USD
    tax: number; // USD
    total: number; // USD
    exchangeRate: number; // VND per USD
    totalVnd: number; // VND

    // Shipping Information
    actualShipDate?: string;
    internalTrackingNumber?: string;
    shippingNote?: string;
    shippingUnit?: string;
    trackingNumber?: string;
    shippingFee: number; // USD
    shippingExchangeRate: number; // VND per USD
    shippingFeeVnd: number; // VND

    // Status Information
    generalStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    customerStatus?: string;
    factoryStatus?: string;
    deliveryStatus?: string;

    // Metadata
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}