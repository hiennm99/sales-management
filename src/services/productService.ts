// services/productService.ts
import { supabase } from './supabaseClient';
import { shopService } from './shopService';
import type { Product, CreateProductData, UpdateProductData } from '../types/product';
import type { Shop } from '../types/shop';

export class ProductService {
    private readonly table = 'products';
    private readonly bucket = 'product-images';

    /**
     * Get current user ID
     */
    private async getCurrentUserId(): Promise<string> {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id || 'anonymous';
    }

    /**
     * Generate next SKU for a shop
     * Format: <shop_abbr_3><padded_serial> (max 8 chars)
     * Example: ABC00001, ABC00123
     */
    async generateNextSKU(shopAbbr?: string): Promise<string> {
        try {
            let shop: Shop;

            if (shopAbbr) {
                shop = await shopService.getShopByAbbr(shopAbbr);
            } else {
                const currentShop = await shopService.getCurrentShop();
                if (!currentShop) {
                    throw new Error('No shop available for SKU generation');
                }
                shop = currentShop;
            }

            // Get highest existing SKU number for this shop
            const { data, error } = await supabase
                .from(this.table)
                .select('sku')
                .eq('shop_abbr', shop.abbr_3)
                .order('sku', { ascending: false });

            if (error) {
                throw new Error(`Failed to fetch existing SKUs: ${error.message}`);
            }

            let nextNumber = 1;

            if (data && data.length > 0) {
                // Extract numbers from existing SKUs and find the highest
                const existingNumbers = data
                    .map(item => item.sku.substring(3)) // Remove shop abbreviation
                    .map(numStr => parseInt(numStr, 10))
                    .filter(num => !isNaN(num));

                if (existingNumbers.length > 0) {
                    nextNumber = Math.max(...existingNumbers) + 1;
                }
            }

            // Calculate available digits for the number part
            const availableDigits = 8 - shop.abbr_3.length;
            const maxNumber = Math.pow(10, availableDigits) - 1;

            if (nextNumber > maxNumber) {
                throw new Error(`SKU limit reached for shop ${shop.abbr_3}`);
            }

            // Generate SKU with proper padding
            const sku = `${shop.abbr_3}${nextNumber.toString().padStart(availableDigits, '0')}`;
            return sku;
        } catch (error) {
            console.error('SKU generation error:', error);
            // Fallback SKU using timestamp
            const timestamp = Date.now().toString().slice(-5);
            return `SKU${timestamp}`;
        }
    }

    /**
     * Check if SKU exists
     */
    async checkSKUExists(sku: string, excludeId?: number): Promise<boolean> {
        let query = supabase
            .from(this.table)
            .select('id')
            .eq('sku', sku);

        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const { data, error } = await query.single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to check SKU: ${error.message}`);
        }

        return !!data;
    }

    /**
     * Validate SKU format
     */
    private validateSKU(sku: string, shopAbbr: string): void {
        if (!sku || sku.length > 8) {
            throw new Error('SKU must be 1-8 characters long');
        }

        if (!sku.startsWith(shopAbbr)) {
            throw new Error(`SKU must start with shop abbreviation: ${shopAbbr}`);
        }

        // Check if remaining characters are digits
        const numberPart = sku.substring(shopAbbr.length);
        if (numberPart && !/^\d+$/.test(numberPart)) {
            throw new Error('SKU number part must contain only digits');
        }
    }

    /**
     * Generate image path for storage: /shops/<shop_abbr>/images/<sku>.jpg
     */
    private getImagePath(shopAbbr: string, sku: string): string {
        return `shops/${shopAbbr}/images/${sku}.jpg`;
    }

    /**
     * Upload product image
     */
    async uploadImage(file: File, sku: string, shopAbbr: string): Promise<string> {
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Image must be less than 5MB');
        }

        const imagePath = this.getImagePath(shopAbbr, sku);

        const { error } = await supabase.storage
            .from(this.bucket)
            .upload(imagePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            throw new Error(`Image upload failed: ${error.message}`);
        }

        const { data } = supabase.storage
            .from(this.bucket)
            .getPublicUrl(imagePath);

        return data.publicUrl;
    }

    /**
     * Delete product image
     */
    async deleteImage(imageUrl: string): Promise<void> {
        try {
            const url = new URL(imageUrl);
            const pathParts = url.pathname.split('/');
            const bucketIndex = pathParts.findIndex(part => part === this.bucket);

            if (bucketIndex === -1) return;

            const filePath = pathParts.slice(bucketIndex + 1).join('/');
            const { error } = await supabase.storage
                .from(this.bucket)
                .remove([filePath]);

            if (error) {
                console.warn('Failed to delete image:', error);
            }
        } catch (error) {
            console.warn('Failed to delete image:', error);
        }
    }

    /**
     * Check if shop is configured (backward compatibility)
     */
    async isShopConfigured(): Promise<boolean> {
        return await shopService.hasShops();
    }

    /**
     * Get all products
     */
    async getAllProducts(shopAbbr?: string): Promise<Product[]> {
        let query = supabase
            .from(this.table)
            .select(`
                *,
                shop:shops!shop_abbr(id, name, abbr_3)
            `)
            .order('created_at', { ascending: false });

        if (shopAbbr) {
            query = query.eq('shop_abbr', shopAbbr);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(`Failed to fetch products: ${error.message}`);
        }

        return data || [];
    }

    /**
     * Get products by shop ID
     */
    async getProductsByShopId(shopId: number): Promise<Product[]> {
        const shop = await shopService.getShopById(shopId);
        return this.getAllProducts(shop.abbr_3);
    }

    /**
     * Get product by ID
     */
    async getProductById(id: string): Promise<Product> {
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            throw new Error('Invalid product ID');
        }

        const { data, error } = await supabase
            .from(this.table)
            .select(`
                *,
                shop:shops!shop_abbr(id, name, abbr_3)
            `)
            .eq('id', productId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error('Product not found');
            }
            throw new Error(`Failed to fetch product: ${error.message}`);
        }

        return data;
    }

    /**
     * Create new product
     */
    async createProduct(
        productData: CreateProductData,
        imageFile?: File
    ): Promise<Product> {
        const currentUserId = await this.getCurrentUserId();

        // Determine shop
        let shopAbbr: string;
        if (productData.shop_abbr) {
            // Validate shop exists
            await shopService.getShopByAbbr(productData.shop_abbr);
            shopAbbr = productData.shop_abbr;
        } else {
            const currentShop = await shopService.getCurrentShop();
            if (!currentShop) {
                throw new Error('No shop available. Please create a shop first.');
            }
            shopAbbr = currentShop.abbr_3;
        }

        // Generate or validate SKU
        let finalSKU = productData.sku?.trim();
        if (!finalSKU) {
            finalSKU = await this.generateNextSKU(shopAbbr);
        } else {
            this.validateSKU(finalSKU, shopAbbr);

            // Check for duplicates
            const exists = await this.checkSKUExists(finalSKU);
            if (exists) {
                throw new Error('SKU already exists');
            }
        }

        // Validate Etsy URL
        const etsyUrl = productData.etsy_url.trim();
        if (etsyUrl && !etsyUrl.includes('etsy.com')) {
            console.warn('URL does not appear to be an Etsy URL');
        }

        // Upload image if provided
        let image_url = productData.image_url;
        if (imageFile) {
            try {
                image_url = await this.uploadImage(imageFile, finalSKU, shopAbbr);
            } catch (error) {
                throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        const newProduct = {
            shop_abbr: shopAbbr,
            title: productData.title.trim(),
            sku: finalSKU,
            etsy_url: etsyUrl,
            image_url,
            created_by: currentUserId,
            updated_by: currentUserId,
        };

        const { data, error } = await supabase
            .from(this.table)
            .insert(newProduct)
            .select(`
                *,
                shop:shops!shop_abbr(id, name, abbr_3)
            `)
            .single();

        if (error) {
            // Clean up uploaded image if product creation fails
            if (image_url && imageFile) {
                await this.deleteImage(image_url);
            }
            throw new Error(`Failed to create product: ${error.message}`);
        }

        return data;
    }

    /**
     * Update product
     */
    async updateProduct(
        id: string,
        updates: UpdateProductData,
        imageFile?: File
    ): Promise<Product> {
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            throw new Error('Invalid product ID');
        }

        const currentUserId = await this.getCurrentUserId();

        // Get current product
        const currentProduct = await this.getProductById(id);
        let shopAbbr = currentProduct.shop_abbr;

        // Handle shop change
        if (updates.shop_abbr && updates.shop_abbr !== currentProduct.shop_abbr) {
            // Validate new shop exists
            await shopService.getShopByAbbr(updates.shop_abbr);
            shopAbbr = updates.shop_abbr;
        }

        // Validate SKU if changed
        if (updates.sku && updates.sku !== currentProduct.sku) {
            const newSKU = updates.sku.trim();
            this.validateSKU(newSKU, shopAbbr);

            const exists = await this.checkSKUExists(newSKU, productId);
            if (exists) {
                throw new Error('SKU already exists');
            }
        }

        const updateData: Partial<Product> = {
            updated_by: updates.updated_by || currentUserId,
        };

        // Update fields
        if (updates.title !== undefined) updateData.title = updates.title.trim();
        if (updates.sku !== undefined) updateData.sku = updates.sku.trim();
        if (updates.etsy_url !== undefined) updateData.etsy_url = updates.etsy_url.trim();
        if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
        if (updates.shop_abbr !== undefined) updateData.shop_abbr = updates.shop_abbr;

        // Handle image upload
        if (imageFile) {
            const skuToUse = updateData.sku || currentProduct.sku;

            // Delete old image if exists and SKU or shop changed
            if (currentProduct.image_url &&
                (updateData.sku || updateData.shop_abbr)) {
                await this.deleteImage(currentProduct.image_url);
            }

            try {
                updateData.image_url = await this.uploadImage(
                    imageFile,
                    skuToUse,
                    shopAbbr
                );
            } catch (error) {
                throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        const { data, error } = await supabase
            .from(this.table)
            .update(updateData)
            .eq('id', productId)
            .select(`
                *,
                shop:shops!shop_abbr(id, name, abbr_3)
            `)
            .single();

        if (error) {
            // Clean up uploaded image if update fails
            if (updateData.image_url && imageFile &&
                updateData.image_url !== currentProduct.image_url) {
                await this.deleteImage(updateData.image_url);
            }
            throw new Error(`Failed to update product: ${error.message}`);
        }

        return data;
    }

    /**
     * Delete product
     */
    async deleteProduct(id: string): Promise<void> {
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            throw new Error('Invalid product ID');
        }

        const product = await this.getProductById(id);

        const { error } = await supabase
            .from(this.table)
            .delete()
            .eq('id', productId);

        if (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }

        // Delete associated image
        if (product.image_url) {
            await this.deleteImage(product.image_url);
        }
    }

    /**
     * Get product statistics
     */
    async getProductStats(shopAbbr?: string): Promise<{
        total: number;
        withImages: number;
        byShop: Record<string, number>;
    }> {
        let query = supabase
            .from(this.table)
            .select(`
                id,
                image_url,
                shop:shops!shop_abbr(abbr_3)
            `);

        if (shopAbbr) {
            query = query.eq('shop_abbr', shopAbbr);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(`Failed to fetch product stats: ${error.message}`);
        }

        const products = data || [];
        const stats = {
            total: products.length,
            withImages: products.filter(p => p.image_url).length,
            byShop: {} as Record<string, number>
        };

        products.forEach(product => {
            if (product.shop?.abbr_3) {
                stats.byShop[product.shop.abbr_3] =
                    (stats.byShop[product.shop.abbr_3] || 0) + 1;
            }
        });

        return stats;
    }
}

export const productService = new ProductService();