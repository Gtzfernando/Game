-- Seed inicial de etapas.
-- Los answer_hash deben actualizarse ejecutando el script seed-game-content.ts
-- con la variable GAME_CONTENT_HASH_SECRET configurada.
-- Hasta entonces, los hashes de este archivo son marcadores.

INSERT INTO public.game_stages (
    stage_number,
    riddle_text,
    answer_hash,
    qr_payload,
    location_clue,
    fragment_text
) VALUES (
    1,
    'Los gustos de las personas son relativos pero necesarios para poder ver el alma desde la ventana del otro:',
    'PLACEHOLDER_HASH',
    'TXT-1-53',
    'El primer QR lo encontrarás con la persona que te acompaña en esta aventura.',
    'Las crónicas del bosque antiguo dicen que cuando las hojas de los alcanforeros se agitan con fuerza, no es por el clima. Es el gran Totoro que respira profundamente mientras duerme. Si prestas atención en una tarde lluviosa, notarás que el viento emite un eco suave, un susurro que suena exactamente como WYT... un sonido místico que solo los de corazón puro pueden escuchar.'
), (
    2,
    'Dicen que el cuerpo humano tiene cinco sentidos, pero hay sensaciones que van más allá. Un estómago revuelto, un frío en la espalda y el sudor en las manos cuando se está cerca, ¿qué puede ser?',
    'PLACEHOLDER_HASH',
    'TXT-2-60',
    'Vayan a un lugar nuevo a caminar y platicar; seguro allí es un buen destino.',
    'El Gatobús no viaja por las carreteras de los humanos; corre sobre los cables de luz y salta entre las colinas. En los mapas espirituales que Mei y Satsuki encontraron en el desván, se muestra que la ruta nocturna tiene un destino oculto en la cima de la montaña. Una estación secreta y envuelta en niebla llamada la parada AM, donde los espíritus descansan antes del amanecer.'
), (
    3,
    'Dicen que los polos opuestos se atraen porque no caminan por la misma línea.',
    'PLACEHOLDER_HASH',
    'TXT-3-45',
    'Si te gusta lo dulce o lo salado no importa, mientras puedas ser tú y disfrutar de tu bebida favorita. Un lugar donde quizá sus gustos no sean los mismos, pero puedas elegir lo que les gusta.',
    'Mucha gente conoce al gran Totoro gris, pero pocos recuerdan a sus pequeños acompañantes. El más diminuto de todos, ese ser blanco y casi transparente que corre entre los arbustos ocultándose de los humanos, es conocido en las leyendas del pueblo como el espíritu FY. Se dice que encontrarlo trae una vida entera de buena fortuna y compañía.'
), (
    4,
    'Apago la luz, enciendo el botón; cierro un candado con precisión. Es un sonido corto, rápido y seco, que en el silencio siempre deja eco. ¿Qué sonido soy?',
    'PLACEHOLDER_HASH',
    'TXT-4-45',
    'Vayan a un lugar donde todo se halla juntado: los nervios, abrazos y emociones intensas bajo la luz de la luna.',
    'Al mudarse a la vieja casa, las niñas descubrieron unas pequeñas criaturas oscuras que vivían en los rincones. En los libros antiguos de mitología japonesa, a estos duendecillos del hollín se les otorgaba el término CARIAD, que define a las sombras que cuidan los hogares vacíos hasta que se llenan de risas. Cuando la casa se inunda de felicidad, ellos simplemente vuelan hacia el cielo dejando un rastro de magia.'
)
ON CONFLICT (stage_number) DO UPDATE SET
    riddle_text = EXCLUDED.riddle_text,
    qr_payload = EXCLUDED.qr_payload,
    location_clue = EXCLUDED.location_clue,
    fragment_text = EXCLUDED.fragment_text;
