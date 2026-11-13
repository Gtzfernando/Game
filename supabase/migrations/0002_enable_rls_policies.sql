-- Activar Row Level Security en todas las tablas

ALTER TABLE public.game_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.found_fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.found_qr_codes ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para recrearlas de forma idempotente
DROP POLICY IF EXISTS game_stages_no_public_read ON public.game_stages;
DROP POLICY IF EXISTS player_progress_own_read ON public.player_progress;
DROP POLICY IF EXISTS stage_progress_own_read ON public.stage_progress;
DROP POLICY IF EXISTS found_fragments_own_read ON public.found_fragments;
DROP POLICY IF EXISTS found_qr_codes_own_read ON public.found_qr_codes;

-- game_stages: solo el servicio/server debe leer el catálogo completo.
-- Los usuarios autenticados no leen directamente esta tabla desde el cliente;
-- el servidor usa service_role o funciones SQL para acceder.
CREATE POLICY game_stages_no_public_read ON public.game_stages
    FOR SELECT USING (FALSE);

-- player_progress: cada usuario solo lee su propio registro
CREATE POLICY player_progress_own_read ON public.player_progress
    FOR SELECT USING (auth.uid() = user_id);

-- stage_progress: cada usuario solo lee sus propios registros
CREATE POLICY stage_progress_own_read ON public.stage_progress
    FOR SELECT USING (auth.uid() = user_id);

-- found_fragments: cada usuario solo lee sus propios registros
CREATE POLICY found_fragments_own_read ON public.found_fragments
    FOR SELECT USING (auth.uid() = user_id);

-- found_qr_codes: cada usuario solo lee sus propios registros
CREATE POLICY found_qr_codes_own_read ON public.found_qr_codes
    FOR SELECT USING (auth.uid() = user_id);
