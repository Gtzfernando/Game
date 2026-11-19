-- Sincronizar contenido de game_stages con el código fuente
-- SIN modificar answer_hash para no romper las respuestas ya configuradas
UPDATE public.game_stages
SET riddle_text = CASE stage_number
    WHEN 1 THEN 'Los gustos de las personas son relativos pero necesarios para poder ver el alma desde la ventana del otro:'
    WHEN 2 THEN 'Dicen que el cuerpo humano tiene cinco sentidos, pero hay sensaciones que van más allá. Un estómago revuelto, un frío en la espalda y el sudor en las manos cuando se está cerca, ¿qué puede ser?'
    WHEN 3 THEN 'Dicen que los polos opuestos se atraen porque no caminan por la misma línea.'
    WHEN 4 THEN 'Apago la luz, enciendo el botón; cierro un candado con precisión. Es un sonido corto, rápido y seco, que en el silencio siempre deja eco. ¿Qué sonido soy?'
END,
    qr_payload = CASE stage_number
    WHEN 1 THEN 'TXT-1-53'
    WHEN 2 THEN 'TXT-2-60'
    WHEN 3 THEN 'TXT-3-45'
    WHEN 4 THEN 'TXT-4-45'
END,
    location_clue = CASE stage_number
    WHEN 1 THEN 'El primer QR lo encontrarás con la persona que te acompaña en esta aventura.'
    WHEN 2 THEN 'Vayan a un lugar nuevo a caminar y platicar; seguro allí es un buen destino.'
    WHEN 3 THEN 'Si te gusta lo dulce o lo salado no importa, mientras puedas ser tú y disfrutar de tu bebida favorita. Un lugar donde quizá sus gustos no sean los mismos, pero puedas elegir lo que les gusta.'
    WHEN 4 THEN 'Vayan a un lugar donde todo se halla juntado: los nervios, abrazos y emociones intensas bajo la luz de la luna.'
END,
    fragment_text = CASE stage_number
    WHEN 1 THEN 'Las crónicas del bosque antiguo dicen que cuando las hojas de los alcanforeros se agitan con fuerza, no es por el clima. Es el gran Totoro que respira profundamente mientras duerme. Si prestas atención en una tarde lluviosa, notarás que el viento emite un eco suave, un susurro que suena exactamente como WYT... un sonido místico que solo los de corazón puro pueden escuchar.'
    WHEN 2 THEN 'El Gatobús no viaja por las carreteras de los humanos; corre sobre los cables de luz y salta entre las colinas. En los mapas espirituales que Mei y Satsuki encontraron en el desván, se muestra que la ruta nocturna tiene un destino oculto en la cima de la montaña. Una estación secreta y envuelta en niebla llamada la parada AM, donde los espíritus descansan antes del amanecer.'
    WHEN 3 THEN 'Mucha gente conoce al gran Totoro gris, pero pocos recuerdan a sus pequeños acompañantes. El más diminuto de todos, ese ser blanco y casi transparente que corre entre los arbustos ocultándose de los humanos, es conocido en las leyendas del pueblo como el espíritu FY. Se dice que encontrarlo trae una vida entera de buena fortuna y compañía.'
    WHEN 4 THEN 'Al mudarse a la vieja casa, las niñas descubrieron unas pequeñas criaturas oscuras que vivían en los rincones. En los libros antiguos de mitología japonesa, a estos duendecillos del hollín se les otorgaba el término CARIAD, que define a las sombras que cuidan los hogares vacíos hasta que se llenan de risas. Cuando la casa se inunda de felicidad, ellos simplemente vuelan hacia el cielo dejando un rastro de magia.'
END,
    image_url = CASE stage_number
    WHEN 1 THEN '/media/bosque-lluvioso-luna-llena.png'
    WHEN 2 THEN '/media/autobus-gato-luna.png'
    WHEN 3 THEN '/media/bosque-magico-lluvia.png'
    WHEN 4 THEN '/media/casa-japonesa-sol.png'
END
WHERE stage_number IN (1, 2, 3, 4);

-- Actualizar image_url de fragmentos ya desbloqueados
UPDATE public.found_fragments ff
SET image_url = gs.image_url
FROM public.game_stages gs
WHERE ff.stage_id = gs.id AND ff.image_url IS NULL;
