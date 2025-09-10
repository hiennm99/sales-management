// types/sale.ts - Simplified and organized
export type SaleStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
import type {ProductType} from "./product.ts";

export interface Sale {
    // Core identifiers
    id: string;
    shopName: string;
    orderId: string;

    // Dates
    orderDate: string;
    scheduledShipDate?: string;
    actualShipDate?: string;

    // Product details
    sku: string;
    size: string;
    quantity: number;
    type: ProductType;

    // Customer info
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    customerNotes?: string;

    // Pricing (USD)
    subtotal: number;
    discount: number;
    tax: number;
    total: number;

    // VND conversion
    exchangeRate: number;
    totalVnd: number;

    // Shipping
    trackingNumber?: string;
    internalTrackingNumber?: string;
    shippingUnit?: string;
    shippingNote?: string;
    shippingFee: number;
    shippingExchangeRate: number;
    shippingFeeVnd: number;

    // Status tracking
    generalStatus: SaleStatus;
    customerStatus?: string;
    factoryStatus?: string;
    deliveryStatus?: string;

    // Metadata
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

// Filter interface for queries
export interface SaleFilters {
    shopName?: string;
    generalStatus?: string;
    dateFrom?: string;
    dateTo?: string;
    overdueOnly?: boolean;
    selectedShops?: string[];
    productType?: 'All' | ProductType;
    sizesFilter?: string[];
    searchTerm?: string;
}

// Create sale payload
export interface CreateSaleData {
    shopName: string;
    orderId: string;
    orderDate: string;
    scheduledShipDate?: string;
    sku: string;
    size: string;
    quantity: number;
    type: ProductType;
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    customerNotes?: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    exchangeRate: number;
    totalVnd: number;
    generalStatus?: SaleStatus;
    customerStatus?: string;
    factoryStatus?: string;
    createdBy: string;
}

// Update sale payload
export interface UpdateSaleData extends Partial<CreateSaleData> {
    actualShipDate?: string;
    internalTrackingNumber?: string;
    shippingNote?: string;
    shippingUnit?: string;
    trackingNumber?: string;
    updatedBy: string;
}

// Sales statistics
export interface SalesStats {
    totalSales: number;
    totalRevenue: number;
    totalRevenueVnd: number;
    overdueCount: number;
    statusBreakdown: Record<string, number>;
}