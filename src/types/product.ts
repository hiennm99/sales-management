// types/product.ts
import type { Shop } from './shop'

export interface Product {
    id: number;
    shop_abbr: string; // References shops(abbr_3) - changed to string
    title: string;
    sku: string;
    etsy_url: string;
    image_url?: string;
    created_at?: string;
    created_by: string;
    updated_at?: string;
    updated_by: string;
    // Relation data
    shop?: Shop;
}

export interface CreateProductData {
    title: string;
    sku?: string;
    etsy_url: string;
    image_url?: string;
    shop_abbr?: string; // Optional, defaults to current shop
}

export interface UpdateProductData extends Partial<CreateProductData> {
    updated_by?: string;
}

export type ProductFormData = CreateProductData & {
    imageFile?: File;
};

export type ProductUpdateFormData = UpdateProductData & {
    imageFile?: File;
};

export type ProductType = 'Rolled' | 'Stretched';