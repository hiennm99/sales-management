// types/shop.ts
export interface Shop {
    id: number;
    name: string;
    abbr_3: string; // 3-character abbreviation
    created_at?: string;
    updated_at?: string;
}

export interface CreateShopData {
    name: string;
    abbr_3: string;
}

export interface UpdateShopData extends Partial<CreateShopData> {}

// Re-export for consistency
export type { Product, CreateProductData, UpdateProductData, ProductFormData, ProductUpdateFormData, ProductType } from './product';