-- Cambiar el owner de las funciones RPC a postgres para que bypass RLS
-- y puedan insertar/actualizar en tablas con Row Level Security

ALTER FUNCTION IF EXISTS public.complete_stage_qr(UUID, INTEGER, TEXT) OWNER TO postgres;
ALTER FUNCTION IF EXISTS public.initialize_player_progress(UUID) OWNER TO postgres;
