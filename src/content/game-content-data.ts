export interface GameStageContent {
  stage_number: number;
  riddle_text: string;
  riddle_hint: string;
  answer_normalized: string;
  qr_payload: string;
  location_clue: string;
  fragment_text: string;
}

export const GAME_STAGES: GameStageContent[] = [
  {
    stage_number: 1,
    riddle_text:
      "Los gustos de las personas son relativos pero necesarios para poder ver el alma desde la ventana del otro:",
    riddle_hint: "¿Qué es conocido como las ventanas del alma?",
    answer_normalized: "OJOS",
    qr_payload: "TXT-1-53",
    location_clue:
      "El primer QR lo encontrarás con la persona que te acompaña en esta aventura.",
    fragment_text:
      "Las crónicas del bosque antiguo dicen que cuando las hojas de los alcanforeros se agitan con fuerza, no es por el clima. Es el gran Totoro que respira profundamente mientras duerme. Si prestas atención en una tarde lluviosa, notarás que el viento emite un eco suave, un susurro que suena exactamente como WYT... un sonido místico que solo los de corazón puro pueden escuchar.",
  },
  {
    stage_number: 2,
    riddle_text:
      "Dicen que el cuerpo humano tiene cinco sentidos, pero hay sensaciones que van más allá. Un estómago revuelto, un frío en la espalda y el sudor en las manos cuando se está cerca, ¿qué puede ser?",
    riddle_hint: "Solo NERVIOS puede ser.",
    answer_normalized: "NERVIOS",
    qr_payload: "TXT-2-60",
    location_clue:
      "Vayan a un lugar nuevo a caminar y platicar; seguro allí es un buen destino.",
    fragment_text:
      "El Gatobús no viaja por las carreteras de los humanos; corre sobre los cables de luz y salta entre las colinas. En los mapas espirituales que Mei y Satsuki encontraron en el desván, se muestra que la ruta nocturna tiene un destino oculto en la cima de la montaña. Una estación secreta y envuelta en niebla llamada la parada AM, donde los espíritus descansan antes del amanecer.",
  },
  {
    stage_number: 3,
    riddle_text:
      "Dicen que los polos opuestos se atraen porque no caminan por la misma línea.",
    riddle_hint: "Las personas pueden ser muy...",
    answer_normalized: "DIFERENTES",
    qr_payload: "TXT-3-45",
    location_clue:
      "Si te gusta lo dulce o lo salado no importa, mientras puedas ser tú y disfrutar de tu bebida favorita. Un lugar donde quizá sus gustos no sean los mismos, pero puedas elegir lo que les gusta.",
    fragment_text:
      "Mucha gente conoce al gran Totoro gris, pero pocos recuerdan a sus pequeños acompañantes. El más diminuto de todos, ese ser blanco y casi transparente que corre entre los arbustos ocultándose de los humanos, es conocido en las leyendas del pueblo como el espíritu FY. Se dice que encontrarlo trae una vida entera de buena fortuna y compañía.",
  },
  {
    stage_number: 4,
    riddle_text:
      "Apago la luz, enciendo el botón; cierro un candado con precisión. Es un sonido corto, rápido y seco, que en el silencio siempre deja eco. ¿Qué sonido soy?",
    riddle_hint: "Es lo que haces con un mouse todo el tiempo.",
    answer_normalized: "CLICK",
    qr_payload: "TXT-4-45",
    location_clue:
      "Vayan a un lugar donde todo se halla juntado: los nervios, abrazos y emociones intensas bajo la luz de la luna.",
    fragment_text:
      "Al mudarse a la vieja casa, las niñas descubrieron unas pequeñas criaturas oscuras que vivían en los rincones. En los libros antiguos de mitología japonesa, a estos duendecillos del hollín se les otorgaba el término CARIAD, que define a las sombras que cuidan los hogares vacíos hasta que se llenan de risas. Cuando la casa se inunda de felicidad, ellos simplemente vuelan hacia el cielo dejando un rastro de magia.",
  },
];
