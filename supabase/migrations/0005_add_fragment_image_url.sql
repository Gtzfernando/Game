-- Agregar columna image_url a game_stages para vincular la ilustración de cada etapa
ALTER TABLE public.game_stages
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Asignar imágenes a cada etapa
UPDATE public.game_stages
SET image_url = CASE
    WHEN stage_number = 1 THEN '/media/bosque-lluvioso-luna-llena.png'
    WHEN stage_number = 2 THEN '/media/autobus-gato-luna.png'
    WHEN stage_number = 3 THEN '/media/bosque-magico-lluvia.png'
    WHEN stage_number = 4 THEN '/media/casa-japonesa-sol.png'
END
WHERE image_url IS NULL;

-- Agregar columna image_url a found_fragments para guardar la ilustración desbloqueada
ALTER TABLE public.found_fragments
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Actualizar registros existentes con la imagen correspondiente a su etapa
UPDATE public.found_fragments ff
SET image_url = gs.image_url
FROM public.game_stages gs
WHERE ff.stage_id = gs.id AND ff.image_url IS NULL;
