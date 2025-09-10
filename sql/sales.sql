-- Create the sales table in Supabase
CREATE TABLE IF NOT EXISTS public.sales (
    -- Primary key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Order Information
    shop_name VARCHAR(255) NOT NULL,
    order_id VARCHAR(100) NOT NULL,
    order_date DATE NOT NULL,
    scheduled_ship_date DATE,

    -- Product Information
    sku VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    type VARCHAR(20) NOT NULL CHECK (type IN ('Rolled', 'Stretched')),

    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_notes TEXT,

    -- Financial Information (USD)
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    discount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    tax DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),

    -- Exchange Rate and VND amounts
    exchange_rate DECIMAL(10,2) NOT NULL CHECK (exchange_rate > 0),
    total_vnd DECIMAL(15,2) NOT NULL CHECK (total_vnd >= 0),

    -- Shipping Information
    actual_ship_date DATE,
    internal_tracking_number VARCHAR(100),
    shipping_note TEXT,
    shipping_unit VARCHAR(100),
    tracking_number VARCHAR(100),

    -- Shipping Financial Information
    shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
    shipping_exchange_rate DECIMAL(10,2) NOT NULL CHECK (shipping_exchange_rate > 0),
    shipping_fee_vnd DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (shipping_fee_vnd >= 0),

    -- Status Information
    general_status VARCHAR(20) NOT NULL DEFAULT 'processing'
    CHECK (general_status IN ('processing', 'shipped', 'delivered', 'cancelled')),
    customer_status VARCHAR(100),
    factory_status VARCHAR(100),
    delivery_status VARCHAR(100),

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100) NOT NULL,
    updated_by VARCHAR(100) NOT NULL
    );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sales_shop_name ON public.sales(shop_name);
CREATE INDEX IF NOT EXISTS idx_sales_order_id ON public.sales(order_id);
CREATE INDEX IF NOT EXISTS idx_sales_order_date ON public.sales(order_date);
CREATE INDEX IF NOT EXISTS idx_sales_scheduled_ship_date ON public.sales(scheduled_ship_date);
CREATE INDEX IF NOT EXISTS idx_sales_general_status ON public.sales(general_status);
CREATE INDEX IF NOT EXISTS idx_sales_customer_name ON public.sales(customer_name);
CREATE INDEX IF NOT EXISTS idx_sales_sku ON public.sales(sku);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_updated_at ON public.sales(updated_at);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_sales_status_date ON public.sales(general_status, order_date);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS update_sales_updated_at ON public.sales;
CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON public.sales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) - you can customize these policies based on your auth requirements
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your authentication setup)
-- Allow all operations for authenticated users (you may want to restrict this further)
CREATE POLICY "Allow all operations for authenticated users" ON public.sales
    FOR ALL USING (auth.role() = 'authenticated');

-- Or if you want to allow public access (not recommended for production)
-- CREATE POLICY "Allow public access" ON public.sales FOR ALL USING (true);

-- Create a view for easy querying with proper column names (matching TypeScript interface)
CREATE OR REPLACE VIEW public.sales_view AS
SELECT
    id,
    shop_name as "shopName",
    order_id as "orderId",
    order_date as "orderDate",
    scheduled_ship_date as "scheduledShipDate",
    sku,
    size,
    quantity,
    type,
    customer_name as "customerName",
    customer_address as "customerAddress",
    customer_phone as "customerPhone",
    customer_notes as "customerNotes",
    subtotal,
    discount,
    tax,
    total,
    exchange_rate as "exchangeRate",
    total_vnd as "totalVnd",
    actual_ship_date as "actualShipDate",
    internal_tracking_number as "internalTrackingNumber",
    shipping_note as "shippingNote",
    shipping_unit as "shippingUnit",
    tracking_number as "trackingNumber",
    shipping_fee as "shippingFee",
    shipping_exchange_rate as "shippingExchangeRate",
    shipping_fee_vnd as "shippingFeeVnd",
    general_status as "generalStatus",
    customer_status as "customerStatus",
    factory_status as "factoryStatus",
    delivery_status as "deliveryStatus",
    created_at as "createdAt",
    updated_at as "updatedAt",
    created_by as "createdBy",
    updated_by as "updatedBy"
FROM public.sales;

-- Grant permissions on the view
GRANT ALL ON public.sales_view TO authenticated;

-- Insert some sample data for testing (optional)
INSERT INTO public.sales (
    shop_name, order_id, order_date, scheduled_ship_date,
    sku, size, quantity, type,
    customer_name, customer_address, customer_phone,
    subtotal, discount, tax, total, exchange_rate, total_vnd,
    shipping_fee, shipping_exchange_rate, shipping_fee_vnd,
    general_status, created_by, updated_by
) VALUES
      (
          'Shop ABC', 'ORD-2024-001', '2024-01-15', '2024-01-20',
          'CANVAS-001', 'M', 2, 'Rolled',
          'John Doe', '123 Main St, Ho Chi Minh City', '+84901234567',
          100.00, 10.00, 8.00, 98.00, 24000, 2352000,
          15.00, 24000, 360000,
          'processing', 'admin', 'admin'
      ),
      (
          'Shop XYZ', 'ORD-2024-002', '2024-01-16', '2024-01-18',
          'CANVAS-002', 'L', 1, 'Stretched',
          'Jane Smith', '456 Nguyen Hue, District 1', '+84912345678',
          150.00, 0.00, 12.00, 162.00, 24000, 3888000,
          20.00, 24000, 480000,
          'shipped', 'admin', 'admin'
      );

-- Add comments to document the table
COMMENT ON TABLE public.sales IS 'Sales orders tracking table with complete order, customer, product, and shipping information';
COMMENT ON COLUMN public.sales.shop_name IS 'Name of the shop where the order was placed';
COMMENT ON COLUMN public.sales.order_id IS 'Unique identifier for the order';
COMMENT ON COLUMN public.sales.exchange_rate IS 'USD to VND exchange rate at time of order';
COMMENT ON COLUMN public.sales.general_status IS 'Main status of the order: processing, shipped, delivered, cancelled';
COMMENT ON COLUMN public.sales.customer_status IS 'Customer-facing status description';
COMMENT ON COLUMN public.sales.factory_status IS 'Production status from factory';
COMMENT ON COLUMN public.sales.delivery_status IS 'Delivery-specific status';