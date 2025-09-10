// services/saleService.ts - Optimized version
import { supabase } from './supabaseClient';
import type { Sale } from '../types/sale';

export interface SaleFilters {
    shopName?: string;
    generalStatus?: string;
    dateFrom?: string;
    dateTo?: string;
    overdueOnly?: boolean;
    selectedShops?: string[];
    productType?: 'All' | 'Rolled' | 'Stretched';
    sizesFilter?: string[];
    searchTerm?: string;
}

export interface CreateSaleData {
    shopName: string;
    orderId: string;
    orderDate: string;
    scheduledShipDate?: string;
    sku: string;
    size: string;
    quantity: number;
    type: 'Rolled' | 'Stretched';
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
    generalStatus?: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    customerStatus?: string;
    factoryStatus?: string;
    createdBy: string;
}

export interface UpdateSaleData extends Partial<CreateSaleData> {
    actualShipDate?: string;
    internalTrackingNumber?: string;
    shippingNote?: string;
    shippingUnit?: string;
    trackingNumber?: string;
    updatedBy: string;
}

class SaleService {
    private readonly table = 'sales';

    private buildQuery(filters?: SaleFilters) {
        let query = supabase.from(this.table).select('*');

        if (!filters) return query;

        // Shop filters
        if (filters.selectedShops?.length) {
            query = query.in('shop_name', filters.selectedShops);
        } else if (filters.shopName) {
            query = query.eq('shop_name', filters.shopName);
        }

        // Status and date filters
        if (filters.generalStatus && filters.generalStatus !== 'All') {
            query = query.eq('general_status', filters.generalStatus.toLowerCase());
        }
        if (filters.dateFrom) query = query.gte('order_date', filters.dateFrom);
        if (filters.dateTo) query = query.lte('order_date', filters.dateTo);

        // Search
        if (filters.searchTerm) {
            query = query.or(`order_id.ilike.%${filters.searchTerm}%,customer_name.ilike.%${filters.searchTerm}%,sku.ilike.%${filters.searchTerm}%`);
        }

        // Product filters
        if (filters.productType && filters.productType !== 'All') {
            query = query.eq('type', filters.productType);
        }
        if (filters.sizesFilter?.length) {
            query = query.in('size', filters.sizesFilter);
        }

        // Overdue filter
        if (filters.overdueOnly) {
            const today = new Date().toISOString().split('T')[0];
            query = query
                .lt('scheduled_ship_date', today)
                .not('general_status', 'in', '(delivered,cancelled)');
        }

        return query.order('created_at', { ascending: false });
    }

    async getAllSales(filters?: SaleFilters): Promise<Sale[]> {
        const { data, error } = await this.buildQuery(filters);
        if (error) throw new Error(error.message);
        return (data || []).map(this.transformFromDb);
    }

    async getSaleById(id: string): Promise<Sale> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') throw new Error('Sale not found');
            throw new Error(error.message);
        }

        return this.transformFromDb(data);
    }

    async createSale(saleData: CreateSaleData): Promise<Sale> {
        const data = {
            ...this.transformToDb(saleData),
            id: crypto.randomUUID(),
            general_status: saleData.generalStatus || 'new',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const { data: newSale, error } = await supabase
            .from(this.table)
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.transformFromDb(newSale);
    }

    async updateSale(id: string, updates: UpdateSaleData): Promise<Sale> {
        const data = {
            ...this.transformToDb(updates),
            updated_at: new Date().toISOString(),
        };

        const { data: updated, error } = await supabase
            .from(this.table)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.transformFromDb(updated);
    }

    async updateStatus(
        id: string,
        status: 'processing' | 'shipped' | 'delivered' | 'cancelled',
        updatedBy: string
    ): Promise<Sale> {
        const { data, error } = await supabase
            .from(this.table)
            .update({
                general_status: status,
                updated_by: updatedBy,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.transformFromDb(data);
    }

    async deleteSale(id: string): Promise<void> {
        const { error } = await supabase.from(this.table).delete().eq('id', id);
        if (error) throw new Error(error.message);
    }

    async getStats(dateFrom?: string, dateTo?: string) {
        let query = supabase.from(this.table).select('*');
        if (dateFrom) query = query.gte('order_date', dateFrom);
        if (dateTo) query = query.lte('order_date', dateTo);

        const { data, error } = await query;
        if (error) throw new Error(error.message);

        const sales = data || [];
        const today = new Date().toISOString().split('T')[0];

        return {
            totalSales: sales.length,
            totalRevenue: sales.reduce((sum, s) => sum + (s.total || 0), 0),
            totalRevenueVnd: sales.reduce((sum, s) => sum + (s.total_vnd || 0), 0),
            overdueCount: sales.filter(s =>
                s.scheduled_ship_date && s.scheduled_ship_date < today &&
                !['delivered', 'cancelled'].includes(s.general_status)
            ).length,
            statusBreakdown: sales.reduce((acc, s) => {
                const status = s.general_status || 'new';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
        };
    }

    async getShopNames(): Promise<string[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('shop_name')
            .not('shop_name', 'is', null);

        if (error) throw new Error(error.message);
        return [...new Set(data?.map(item => item.shop_name))].filter(Boolean).sort();
    }

    async getProductSizes(): Promise<string[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('size')
            .not('size', 'is', null);

        if (error) throw new Error(error.message);
        return [...new Set(data?.map(item => item.size))].filter(Boolean).sort();
    }

    async bulkUpdateStatus(
        ids: string[],
        status: 'processing' | 'shipped' | 'delivered' | 'cancelled',
        updatedBy: string
    ): Promise<Sale[]> {
        const { data, error } = await supabase
            .from(this.table)
            .update({
                general_status: status,
                updated_by: updatedBy,
                updated_at: new Date().toISOString(),
            })
            .in('id', ids)
            .select();

        if (error) throw new Error(error.message);
        return (data || []).map(this.transformFromDb);
    }

    private transformFromDb = (db: any): Sale => ({
        id: db.id,
        shopName: db.shop_name,
        orderId: db.order_id,
        orderDate: db.order_date,
        scheduledShipDate: db.scheduled_ship_date,
        sku: db.sku,
        size: db.size,
        quantity: db.quantity,
        type: db.type,
        customerName: db.customer_name,
        customerAddress: db.customer_address,
        customerPhone: db.customer_phone,
        customerNotes: db.customer_notes,
        subtotal: db.subtotal,
        discount: db.discount,
        tax: db.tax,
        total: db.total,
        exchangeRate: db.exchange_rate,
        totalVnd: db.total_vnd,
        actualShipDate: db.actual_ship_date,
        internalTrackingNumber: db.internal_tracking_number,
        shippingNote: db.shipping_note,
        shippingUnit: db.shipping_unit,
        trackingNumber: db.tracking_number,
        shippingFee: db.shipping_fee || 0,
        shippingExchangeRate: db.shipping_exchange_rate || 24000,
        shippingFeeVnd: db.shipping_fee_vnd || 0,
        generalStatus: db.general_status,
        customerStatus: db.customer_status,
        factoryStatus: db.factory_status,
        deliveryStatus: db.delivery_status,
        createdAt: db.created_at,
        updatedAt: db.updated_at,
        createdBy: db.created_by,
        updatedBy: db.updated_by,
    });

    private transformToDb = (app: any) => {
        const db: any = {};
        if (app.shopName !== undefined) db.shop_name = app.shopName;
        if (app.orderId !== undefined) db.order_id = app.orderId;
        if (app.orderDate !== undefined) db.order_date = app.orderDate;
        if (app.scheduledShipDate !== undefined) db.scheduled_ship_date = app.scheduledShipDate;
        if (app.sku !== undefined) db.sku = app.sku;
        if (app.size !== undefined) db.size = app.size;
        if (app.quantity !== undefined) db.quantity = app.quantity;
        if (app.type !== undefined) db.type = app.type;
        if (app.customerName !== undefined) db.customer_name = app.customerName;
        if (app.customerAddress !== undefined) db.customer_address = app.customerAddress;
        if (app.customerPhone !== undefined) db.customer_phone = app.customerPhone;
        if (app.customerNotes !== undefined) db.customer_notes = app.customerNotes;
        if (app.subtotal !== undefined) db.subtotal = app.subtotal;
        if (app.discount !== undefined) db.discount = app.discount;
        if (app.tax !== undefined) db.tax = app.tax;
        if (app.total !== undefined) db.total = app.total;
        if (app.exchangeRate !== undefined) db.exchange_rate = app.exchangeRate;
        if (app.totalVnd !== undefined) db.total_vnd = app.totalVnd;
        if (app.actualShipDate !== undefined) db.actual_ship_date = app.actualShipDate;
        if (app.internalTrackingNumber !== undefined) db.internal_tracking_number = app.internalTrackingNumber;
        if (app.shippingNote !== undefined) db.shipping_note = app.shippingNote;
        if (app.shippingUnit !== undefined) db.shipping_unit = app.shippingUnit;
        if (app.trackingNumber !== undefined) db.tracking_number = app.trackingNumber;
        if (app.generalStatus !== undefined) db.general_status = app.generalStatus;
        if (app.customerStatus !== undefined) db.customer_status = app.customerStatus;
        if (app.factoryStatus !== undefined) db.factory_status = app.factoryStatus;
        if (app.createdBy !== undefined) db.created_by = app.createdBy;
        if (app.updatedBy !== undefined) db.updated_by = app.updatedBy;
        return db;
    };
}

export const saleService = new SaleService();