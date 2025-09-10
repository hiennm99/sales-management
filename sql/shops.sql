CREATE TABLE shops (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       abbr_3 VARCHAR(3) NOT NULL unique,
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
