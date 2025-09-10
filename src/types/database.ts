// types/database.ts - Supabase generated types
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            sales: {
                Row: {
                    id: string
                    shop_name: string
                    order_id: string
                    order_date: string
                    scheduled_ship_date: string | null
                    sku: string
                    size: string
                    quantity: number
                    type: 'Rolled' | 'Stretched'
                    customer_name: string
                    customer_address: string
                    customer_phone: string
                    customer_notes: string | null
                    subtotal: number
                    discount: number
                    tax: number
                    total: number
                    exchange_rate: number
                    total_vnd: number
                    actual_ship_date: string | null
                    internal_tracking_number: string | null
                    shipping_note: string | null
                    shipping_unit: string | null
                    tracking_number: string | null
                    shipping_fee: number
                    shipping_exchange_rate: number
                    shipping_fee_vnd: number
                    general_status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    customer_status: string | null
                    factory_status: string | null
                    delivery_status: string | null
                    created_at: string
                    updated_at: string
                    created_by: string
                    updated_by: string
                }
                Insert: {
                    id?: string
                    shop_name: string
                    order_id: string
                    order_date: string
                    scheduled_ship_date?: string | null
                    sku: string
                    size: string
                    quantity: number
                    type: 'Rolled' | 'Stretched'
                    customer_name: string
                    customer_address: string
                    customer_phone: string
                    customer_notes?: string | null
                    subtotal: number
                    discount?: number
                    tax?: number
                    total: number
                    exchange_rate?: number
                    total_vnd: number
                    actual_ship_date?: string | null
                    internal_tracking_number?: string | null
                    shipping_note?: string | null
                    shipping_unit?: string | null
                    tracking_number?: string | null
                    shipping_fee?: number
                    shipping_exchange_rate?: number
                    shipping_fee_vnd?: number
                    general_status?: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    customer_status?: string | null
                    factory_status?: string | null
                    delivery_status?: string | null
                    created_at?: string
                    updated_at?: string
                    created_by: string
                    updated_by: string
                }
                Update: {
                    id?: string
                    shop_name?: string
                    order_id?: string
                    order_date?: string
                    scheduled_ship_date?: string | null
                    sku?: string
                    size?: string
                    quantity?: number
                    type?: 'Rolled' | 'Stretched'
                    customer_name?: string
                    customer_address?: string
                    customer_phone?: string
                    customer_notes?: string | null
                    subtotal?: number
                    discount?: number
                    tax?: number
                    total?: number
                    exchange_rate?: number
                    total_vnd?: number
                    actual_ship_date?: string | null
                    internal_tracking_number?: string | null
                    shipping_note?: string | null
                    shipping_unit?: string | null
                    tracking_number?: string | null
                    shipping_fee?: number
                    shipping_exchange_rate?: number
                    shipping_fee_vnd?: number
                    general_status?: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    customer_status?: string | null
                    factory_status?: string | null
                    delivery_status?: string | null
                    created_at?: string
                    updated_at?: string
                    created_by?: string
                    updated_by?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    role: 'admin' | 'manager' | 'staff'
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    role?: 'admin' | 'manager' | 'staff'
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    role?: 'admin' | 'manager' | 'staff'
                    avatar_url?: string | null
                    created_