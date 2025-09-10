
-- Bảng products (con)
CREATE TABLE products (
                          id SERIAL PRIMARY KEY,
                          shop_abbr INTEGER NOT NULL REFERENCES shops(abbr_3) ON DELETE CASCADE,
                          title VARCHAR(255) NOT NULL,
                          sku VARCHAR(100) UNIQUE NOT NULL,
                          etsy_url TEXT NOT NULL,
                          image_url TEXT,
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                          created_by VARCHAR(100) UNIQUE NOT NULL,
                          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                          updated_by VARCHAR(100) UNIQUE NOT NULL
);

