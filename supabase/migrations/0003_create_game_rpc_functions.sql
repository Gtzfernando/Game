-- Funciones RPC transaccionales del juego

-- Inicializa el progreso de un jugador de forma idempotente.
-- Crea player_progress y los 4 registros de stage_progress si no existen.
CREATE OR REPLACE FUNCTION public.initialize_player_progress(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stage_record RECORD;
BEGIN
    -- Insertar progreso general si no existe
    INSERT INTO public.player_progress (user_id, current_stage, game_completed)
    VALUES (p_user_id, 1, FALSE)
    ON CONFLICT (user_id) DO NOTHING;

    -- Insertar progreso por etapa para todas las etapas activas
    FOR stage_record IN
        SELECT id FROM public.game_stages WHERE is_active = TRUE ORDER BY stage_number ASC
    LOOP
        INSERT INTO public.stage_progress (user_id, stage_id, answer_solved, qr_scanned)
        VALUES (p_user_id, stage_record.id, FALSE, FALSE)
        ON CONFLICT (user_id, stage_id) DO NOTHING;
    END LOOP;
END;
$$;

-- Completa una etapa tras validar el QR correcto.
-- Inserta found_qr_codes, found_fragments, actualiza stage_progress,
-- avanza current_stage y, si es la etapa 4, marca game_completed.
CREATE OR REPLACE FUNCTION public.complete_stage_qr(
    p_user_id UUID,
    p_stage_number INTEGER,
    p_qr_payload TEXT
)
RETURNS TABLE(next_stage INTEGER, is_final BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_stage_id UUID;
    v_fragment_text TEXT;
    v_next_stage_number INTEGER;
    v_is_final_stage BOOLEAN;
BEGIN
    -- Obtener datos de la etapa
    SELECT gs.id, gs.fragment_text
    INTO v_stage_id, v_fragment_text
    FROM public.game_stages gs
    WHERE gs.stage_number = p_stage_number AND gs.qr_payload = p_qr_payload AND gs.is_active = TRUE;

    IF v_stage_id IS NULL THEN
        RAISE EXCEPTION 'Etapa o QR no válido';
    END IF;

    -- Insertar QR encontrado (idempotente)
    INSERT INTO public.found_qr_codes (user_id, stage_id, qr_payload)
    VALUES (p_user_id, v_stage_id, p_qr_payload)
    ON CONFLICT (user_id, qr_payload) DO NOTHING;

    -- Insertar fragmento revelado (idempotente)
    INSERT INTO public.found_fragments (user_id, stage_id, fragment_snapshot)
    VALUES (p_user_id, v_stage_id, v_fragment_text)
    ON CONFLICT (user_id, stage_id) DO NOTHING;

    -- Actualizar progreso de etapa
    UPDATE public.stage_progress
    SET qr_scanned = TRUE,
        completed_at = COALESCE(completed_at, NOW()),
        updated_at = NOW()
    WHERE user_id = p_user_id AND stage_id = v_stage_id;

    -- Calcular siguiente etapa
    v_next_stage_number := p_stage_number + 1;
    v_is_final_stage := p_stage_number >= 4;

    -- Actualizar progreso general
    UPDATE public.player_progress
    SET current_stage = LEAST(v_next_stage_number, 4),
        game_completed = v_is_final_stage,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN QUERY SELECT LEAST(v_next_stage_number, 4), v_is_final_stage;
END;
$$;
