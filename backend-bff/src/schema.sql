-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Table for Users & Targets
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    current_weight NUMERIC(5, 2) NOT NULL,
    target_weight NUMERIC(5, 2) NOT NULL,
    height NUMERIC(5, 2) NOT NULL,
    gender VARCHAR(10),
    goal VARCHAR(20) DEFAULT 'maintain', -- 'lose', 'gain', 'maintain'
    activity_level VARCHAR(30) DEFAULT 'moderately_active',
    calorie_target INT DEFAULT 2000,
    protein_target INT DEFAULT 150,
    carbs_target INT DEFAULT 200,
    fat_target INT DEFAULT 65,
    fiber_target INT DEFAULT 25,
    satfat_target INT DEFAULT 20,
    lift_weights BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Weight/Metrics Logging
CREATE TABLE IF NOT EXISTS weight_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    weight NUMERIC(5, 2) NOT NULL,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    body_fat NUMERIC(5, 2),
    waist NUMERIC(5, 2),
    hip NUMERIC(5, 2),
    arm NUMERIC(5, 2),
    upper_body NUMERIC(5, 2),
    leg NUMERIC(5, 2),
    progress_pic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_date_weight UNIQUE (user_id, log_date)
);

-- Table for Meal Logging
CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'breakfast', -- 'breakfast', 'lunch', 'dinner', 'snack'
    calories NUMERIC(6, 1) NOT NULL,
    protein NUMERIC(5, 1) NOT NULL,
    carbs NUMERIC(5, 1) NOT NULL,
    fat NUMERIC(5, 1) NOT NULL,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Vector Embeddings (RAG)
CREATE TABLE IF NOT EXISTS user_logs_embeddings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    log_text TEXT NOT NULL,
    embedding vector(1536), -- 1536-dimensional vectors (standard OpenAI text-embedding-3-small / ada-002)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migrations for existing databases (run before INSERT to ensure columns exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS lift_weights BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS fiber_target INT DEFAULT 25;
ALTER TABLE users ADD COLUMN IF NOT EXISTS satfat_target INT DEFAULT 20;
ALTER TABLE users ADD COLUMN IF NOT EXISTS activity_level VARCHAR(30) DEFAULT '1.3';

-- Migrations for weight_logs
ALTER TABLE weight_logs ADD COLUMN IF NOT EXISTS body_fat NUMERIC(5, 2);
ALTER TABLE weight_logs ADD COLUMN IF NOT EXISTS waist NUMERIC(5, 2);
ALTER TABLE weight_logs ADD COLUMN IF NOT EXISTS hip NUMERIC(5, 2);
ALTER TABLE weight_logs ADD COLUMN IF NOT EXISTS arm NUMERIC(5, 2);
ALTER TABLE weight_logs ADD COLUMN IF NOT EXISTS upper_body NUMERIC(5, 2);
ALTER TABLE weight_logs ADD COLUMN IF NOT EXISTS leg NUMERIC(5, 2);
ALTER TABLE weight_logs ADD COLUMN IF NOT EXISTS progress_pic TEXT;

-- Insert default test user (if not exists)
INSERT INTO users (id, name, email, current_weight, target_weight, height, gender, goal, calorie_target, protein_target, carbs_target, fat_target, fiber_target, satfat_target, lift_weights, activity_level)
VALUES ('usr_982341', 'Dragos Iacob', 'dragos@dietcoach.ro', 80.0, 75.0, 180.0, 'male', 'lose', 2200, 160, 220, 75, 25, 20, false, '1.3')
ON CONFLICT (id) DO NOTHING;
