-- Pruebas básicas de RLS y funciones del juego
-- Ejecutar en SQL Editor de Supabase con privilegios adecuados

-- Verificar que RLS está activo
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('game_stages', 'player_progress', 'stage_progress', 'found_fragments', 'found_qr_codes');

-- Verificar que existen las funciones
SELECT proname
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('initialize_player_progress', 'complete_stage_qr');
