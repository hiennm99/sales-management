// services/shopService.ts
import { supabase } from './supabaseClient';
import type { Shop } from '../types/shop';

export interface CreateShopData {
    name: string;
    abbr_3: string;
}

export interface UpdateShopData extends Partial<CreateShopData> {}

export class ShopService {
    private readonly table = 'shops';

    /**
     * Get all shops
     */
    async getShops(): Promise<Shop[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            throw new Error(`Failed to fetch shops: ${error.message}`);
        }

        return data || [];
    }

    /**
     * Get shop by ID
     */
    async getShopById(id: number): Promise<Shop> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error('Shop not found');
            }
            throw new Error(`Failed to fetch shop: ${error.message}`);
        }

        return data;
    }

    /**
     * Get shop by abbreviation
     */
    async getShopByAbbr(abbr: string): Promise<Shop> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('abbr_3', abbr.toUpperCase())
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error(`Shop with abbreviation '${abbr}' not found`);
            }
            throw new Error(`Failed to fetch shop: ${error.message}`);
        }

        return data;
    }

    /**
     * Get the first shop (for default selection)
     */
    async getCurrentShop(): Promise<Shop | null> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // No shops configured
            }
            throw new Error(`Failed to fetch current shop: ${error.message}`);
        }

        return data;
    }

    /**
     * Check if any shop exists
     */
    async hasShops(): Promise<boolean> {
        const { data, error } = await supabase
            .from(this.table)
            .select('id')
            .limit(1);

        if (error) {
            throw new Error(`Failed to check shops: ${error.message}`);
        }

        return (data?.length || 0) > 0;
    }

    /**
     * Validate shop abbreviation
     */
    private validateAbbreviation(abbr: string): void {
        if (!abbr || abbr.length !== 3) {
            throw new Error('Shop abbreviation must be exactly 3 characters');
        }

        if (!/^[A-Z]{3}$/.test(abbr)) {
            throw new Error('Shop abbreviation must contain only uppercase letters');
        }
    }

    /**
     * Validate shop name
     */
    private validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Shop name is required');
        }

        if (name.trim().length > 100) {
            throw new Error('Shop name must be less than 100 characters');
        }
    }

    /**
     * Check if abbreviation exists (excluding specific shop)
     */
    private async checkAbbrExists(abbr: string, excludeId?: number): Promise<boolean> {
        let query = supabase
            .from(this.table)
            .select('id')
            .eq('abbr_3', abbr.toUpperCase());

        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const { data, error } = await query.single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to check abbreviation: ${error.message}`);
        }

        return !!data;
    }

    /**
     * Check if name exists (excluding specific shop)
     */
    private async checkNameExists(name: string, excludeId?: number): Promise<boolean> {
        let query = supabase
            .from(this.table)
            .select('id')
            .ilike('name', name.trim());

        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const { data, error } = await query.single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to check shop name: ${error.message}`);
        }

        return !!data;
    }

    /**
     * Create a new shop
     */
    async createShop(shopData: CreateShopData): Promise<Shop> {
        const name = shopData.name.trim();
        const abbr = shopData.abbr_3.toUpperCase().trim();

        // Validate inputs
        this.validateName(name);
        this.validateAbbreviation(abbr);

        // Check for duplicates
        const [abbrExists, nameExists] = await Promise.all([
            this.checkAbbrExists(abbr),
            this.checkNameExists(name)
        ]);

        if (abbrExists) {
            throw new Error(`Shop abbreviation '${abbr}' already exists`);
        }

        if (nameExists) {
            throw new Error(`Shop name '${name}' already exists`);
        }

        const newShop = {
            name,
            abbr_3: abbr,
        };

        const { data, error } = await supabase
            .from(this.table)
            .insert(newShop)
            .select()
            .single();

        if (error) {
            // Handle unique constraint violations
            if (error.code === '23505') {
                if (error.message.includes('abbr_3')) {
                    throw new Error(`Shop abbreviation '${abbr}' already exists`);
                }
                if (error.message.includes('name')) {
                    throw new Error(`Shop name '${name}' already exists`);
                }
            }
            throw new Error(`Failed to create shop: ${error.message}`);
        }

        return data;
    }

    /**
     * Update shop
     */
    async updateShop(id: number, updates: UpdateShopData): Promise<Shop> {
        // Get current shop for validation
        const currentShop = await this.getShopById(id);

        const updateData: Partial<Shop> = {};

        // Validate and prepare name update
        if (updates.name !== undefined) {
            const name = updates.name.trim();
            this.validateName(name);

            if (name !== currentShop.name) {
                const nameExists = await this.checkNameExists(name, id);
                if (nameExists) {
                    throw new Error(`Shop name '${name}' already exists`);
                }
                updateData.name = name;
            }
        }

        // Validate and prepare abbreviation update
        if (updates.abbr_3 !== undefined) {
            const abbr = updates.abbr_3.toUpperCase().trim();
            this.validateAbbreviation(abbr);

            if (abbr !== currentShop.abbr_3) {
                const abbrExists = await this.checkAbbrExists(abbr, id);
                if (abbrExists) {
                    throw new Error(`Shop abbreviation '${abbr}' already exists`);
                }

                // Check if shop has products - changing abbreviation affects SKUs
                const { data: products } = await supabase
                    .from('products')
                    .select('id')
                    .eq('shop_abbr', currentShop.abbr_3)
                    .limit(1);

                if (products && products.length > 0) {
                    throw new Error('Cannot change abbreviation of shop with existing products');
                }

                updateData.abbr_3 = abbr;
            }
        }

        // If no changes, return current shop
        if (Object.keys(updateData).length === 0) {
            return currentShop;
        }

        const { data, error } = await supabase
            .from(this.table)
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            // Handle unique constraint violations
            if (error.code === '23505') {
                if (error.message.includes('abbr_3')) {
                    throw new Error(`Shop abbreviation already exists`);
                }
                if (error.message.includes('name')) {
                    throw new Error(`Shop name already exists`);
                }
            }
            throw new Error(`Failed to update shop: ${error.message}`);
        }

        return data;
    }

    /**
     * Delete shop
     */
    async deleteShop(id: number): Promise<void> {
        // Check if shop exists
        const shop = await this.getShopById(id);

        // Check if shop has products
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id')
            .eq('shop_abbr', shop.abbr_3)
            .limit(1);

        if (productsError) {
            throw new Error(`Failed to check products: ${productsError.message}`);
        }

        if (products && products.length > 0) {
            throw new Error(`Cannot delete shop '${shop.name}' as it has existing products`);
        }

        const { error } = await supabase
            .from(this.table)
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete shop: ${error.message}`);
        }
    }

    /**
     * Get shop statistics
     */
    async getShopStats(id?: number): Promise<{
        totalShops: number;
        totalProducts: number;
        productsByShop: Record<string, number>;
    }> {
        // Get all shops or specific shop
        const shops = id ? [await this.getShopById(id)] : await this.getShops();

        // Get product counts
        const { data: products, error } = await supabase
            .from('products')
            .select('shop_abbr');

        if (error) {
            throw new Error(`Failed to fetch product stats: ${error.message}`);
        }

        const productsByShop: Record<string, number> = {};

        // Initialize counts for all shops
        shops.forEach(shop => {
            productsByShop[shop.abbr_3] = 0;
        });

        // Count products by shop
        products?.forEach(product => {
            if (productsByShop.hasOwnProperty(product.shop_abbr)) {
                productsByShop[product.shop_abbr]++;
            }
        });

        return {
            totalShops: shops.length,
            totalProducts: products?.length || 0,
            productsByShop
        };
    }
}

export const shopService = new ShopService();