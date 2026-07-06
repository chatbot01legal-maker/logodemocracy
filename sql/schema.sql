-- ═══════════════════════════════════════════════════════════════════════════
-- LOGODEMOCRACY — ESQUEMA DE BASE DE DATOS (PostgreSQL)
-- Laboratorio de Epistemología y Big Data Cognitivo
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Usuarios y Autenticación
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Perfiles Demográficos y de Preferencias
CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    nickname VARCHAR(100),
    country VARCHAR(100),
    language VARCHAR(10) DEFAULT 'es',
    interests JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Perfil Dinámico de Zona de Desarrollo Próximo (ZPD)
CREATE TABLE IF NOT EXISTS zpd_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    zpd_level NUMERIC(4,3) DEFAULT 0.500,
    abstraction_level VARCHAR(50) DEFAULT 'intermedio',
    preferred_format VARCHAR(50) DEFAULT 'mixto',
    preferred_examples VARCHAR(50) DEFAULT 'general',
    preferred_scaffolding VARCHAR(50) DEFAULT 'guia',
    systemic_thinking NUMERIC(4,3) DEFAULT 0.500,
    metacognition_score NUMERIC(4,3) DEFAULT 0.500,
    internal_variables JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Sesiones de Usuario
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 5. Evaluaciones del Módulo Sophia (Análisis Deliberativo)
CREATE TABLE IF NOT EXISTS sophia_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    original_text TEXT NOT NULL,
    ird_score INTEGER NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    fases_json JSONB NOT NULL,
    constructos_json JSONB NOT NULL,
    evidencias_json JSONB,
    infracciones_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Resultados y Variables de los 10 Microtests Pedagógicos
CREATE TABLE IF NOT EXISTS microtests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    test_id VARCHAR(50) NOT NULL,
    answers_json JSONB NOT NULL,
    inferred_variables JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Registro Interactivo con Rey Filósofo (Árbol de Andamiaje)
CREATE TABLE IF NOT EXISTS interaction_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    sophia_evaluation_id UUID REFERENCES sophia_evaluations(id) ON DELETE SET NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    last_choice VARCHAR(255),
    next_choice VARCHAR(255),
    path_taken JSONB DEFAULT '[]'::jsonb,
    duration_ms INTEGER,
    difficulty VARCHAR(50),
    topic VARCHAR(100),
    sophia_score_before INTEGER,
    sophia_score_after INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Eventos de Aprendizaje y Telemetría para Big Data Cognitivo
CREATE TABLE IF NOT EXISTS learning_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- ej: 'sophia_improved', 'scaffolding_selected', 'premise_challenged'
    payload_json JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Módulo Academia (Seguimiento de Lectura y Dominio de Conceptos)
CREATE TABLE IF NOT EXISTS academy_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_id VARCHAR(100) NOT NULL,
    time_invested_seconds INTEGER DEFAULT 0,
    mastered_concepts JSONB DEFAULT '[]'::jsonb,
    queries_made INTEGER DEFAULT 0,
    completion_percentage NUMERIC(5,2) DEFAULT 0.00,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, document_id)
);

-- 10. Registros Metacognitivos (Cierres de sesión con Rey Filósofo)
CREATE TABLE IF NOT EXISTS metacognitive_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    helped_by VARCHAR(100),
    felt_like VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── ÍNDICES PARA ANALÍTICA DE BIG DATA COGNITIVO ─────────────────────────
CREATE INDEX IF NOT EXISTS idx_learning_events_type ON learning_events(event_type);
CREATE INDEX IF NOT EXISTS idx_interaction_logs_user_topic ON interaction_logs(user_id, topic);
CREATE INDEX IF NOT EXISTS idx_sophia_evaluations_ird ON sophia_evaluations(ird_score);
CREATE INDEX IF NOT EXISTS idx_zpd_profiles_level ON zpd_profiles(zpd_level);
