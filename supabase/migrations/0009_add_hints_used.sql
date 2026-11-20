-- Agregar columna hints_used a stage_progress
ALTER TABLE public.stage_progress
ADD COLUMN IF NOT EXISTS hints_used INTEGER DEFAULT 0;

-- Inicializar valores existentes
UPDATE public.stage_progress
SET hints_used = 0
WHERE hints_used IS NULL;
