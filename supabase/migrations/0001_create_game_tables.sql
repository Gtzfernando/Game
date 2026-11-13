-- Tablas del juego de acertijos

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Catálogo de etapas
CREATE TABLE IF NOT EXISTS public.game_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_number INTEGER UNIQUE NOT NULL,
    riddle_text TEXT NOT NULL,
    answer_hash TEXT NOT NULL,
    qr_payload TEXT UNIQUE NOT NULL,
    location_clue TEXT NOT NULL,
    fragment_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progreso general del jugador
CREATE TABLE IF NOT EXISTS public.player_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_stage INTEGER DEFAULT 1,
    game_completed BOOLEAN DEFAULT FALSE,
    tutorial_completed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progreso individual por etapa
CREATE TABLE IF NOT EXISTS public.stage_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES public.game_stages(id) ON DELETE CASCADE,
    answer_solved BOOLEAN DEFAULT FALSE,
    qr_scanned BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, stage_id)
);

-- Fragmentos revelados
CREATE TABLE IF NOT EXISTS public.found_fragments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES public.game_stages(id) ON DELETE CASCADE,
    fragment_snapshot TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, stage_id)
);

-- Códigos QR encontrados
CREATE TABLE IF NOT EXISTS public.found_qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES public.game_stages(id) ON DELETE CASCADE,
    qr_payload TEXT NOT NULL,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, stage_id),
    UNIQUE (user_id, qr_payload)
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_stage_progress_user ON public.stage_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_stage_progress_stage ON public.stage_progress(stage_id);
CREATE INDEX IF NOT EXISTS idx_found_fragments_user ON public.found_fragments(user_id);
CREATE INDEX IF NOT EXISTS idx_found_qr_codes_user ON public.found_qr_codes(user_id);
