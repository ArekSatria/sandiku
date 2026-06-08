-- Skema database SANDIKU untuk dokumentasi dan rujukan manual.
-- Implementasi lokal memakai SQLite. Untuk produksi, struktur ini dapat
-- dimigrasikan ke PostgreSQL dengan penyesuaian tipe data serial/timestamp.

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);

CREATE TABLE IF NOT EXISTS analysis_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password_length INTEGER NOT NULL,
    score INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_breached BOOLEAN NOT NULL DEFAULT 0,
    breach_count INTEGER NOT NULL DEFAULT 0,
    hibp_status VARCHAR(20) NOT NULL DEFAULT 'checked',
    detected_patterns TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_analysis_logs_category ON analysis_logs (category);
CREATE INDEX IF NOT EXISTS ix_analysis_logs_is_breached ON analysis_logs (is_breached);
CREATE INDEX IF NOT EXISTS ix_analysis_logs_hibp_status ON analysis_logs (hibp_status);
CREATE INDEX IF NOT EXISTS ix_analysis_logs_created_at ON analysis_logs (created_at);