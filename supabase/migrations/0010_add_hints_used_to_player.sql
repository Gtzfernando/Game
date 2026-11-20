-- Agregar columna hints_used a player_progress para control global de pistas
ALTER TABLE public.player_progress
ADD COLUMN IF NOT EXISTS hints_used INTEGER DEFAULT 0;

-- Inicializar valores existentes
UPDATE public.player_progress
SET hints_used = 0
WHERE hints_used IS NULL;
