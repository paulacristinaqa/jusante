/*
  ATLAS DA JUSANTE — diário de campo
  ----------------------------------------------------------------
  Um capítulo por coleção (pode acrescentar mais: cada capítulo é um
  bloco { ... }). As fotos das andanças vão para a pasta fotos/atlas/
  e são indicadas em "fotos", por exemplo:

    fotos: [
      { src: "fotos/atlas/caminha-poente-1.jpg", legenda: "Foz do Minho, Caminha · outubro de 2026" }
    ]

  Enquanto "fotos" estiver vazio, aparecem espaços para testar fotos
  no Modo fotos.

  Regra de rigor (Brand Bible 3.4): os capítulos são uma seleção
  editorial de lugares, não um inventário geográfico do rio.
  As cores da paleta são aproximadas; ajuste os códigos à vontade.
*/
window.JUSANTE_ATLAS = [
  {
    id: "poente",
    capitulo: "I",
    colecao: "Poente",
    lugar: "Estuário do Minho, onde o rio encontra o Atlântico",
    titulo: "O fim do dia na foz",
    texto: [
      "Ao fim da tarde, no estuário do Minho, o céu funde-se com o Atlântico. A luz baixa aquece a água em tons de terracota, ocre e laranja queimado, e as montanhas ficam reduzidas a silhuetas escuras contra o horizonte.",
      "É uma luz quente e um pouco melancólica, a última do dia. A coleção Poente nasce desse instante: o sol a tocar a linha do horizonte, a separar o céu da água."
    ],
    paleta: [
      ["Terracota", "#B5654A"],
      ["Ocre quente", "#C8913B"],
      ["Laranja queimado", "#C25B2E"],
      ["Silhueta das montanhas", "#47494C"],
      ["Dourado", "#C9A24B"]
    ],
    materia: "Superfícies foscas, como a luz que já não brilha, com pequenos pontos dourados.",
    fotos: []
  },
  {
    id: "corrente",
    capitulo: "II",
    colecao: "Corrente",
    lugar: "O curso do rio, entre as duas margens",
    titulo: "A força da água",
    texto: [
      "No meio do rio, a água nunca está parada. Corre, enrola-se à volta das pedras, abre linhas sinuosas na superfície e devolve o céu em reflexos prateados e azulados.",
      "A coleção Corrente procura essa fluidez: formas que parecem ter sido moldadas pela água, transparências e a sensação de algo que continua a mover-se."
    ],
    paleta: [
      ["Azul profundo", "#1F3E5A"],
      ["Azul-esverdeado", "#2F7A78"],
      ["Cinzento-pérola", "#C9CCCB"],
      ["Translúcido", "transparente"]
    ],
    materia: "Superfícies brilhantes, com o aspeto molhado e os reflexos da água.",
    fotos: []
  },
  {
    id: "margem",
    capitulo: "III",
    colecao: "Margem",
    lugar: "As margens do Minho e do Miño",
    titulo: "Terra húmida e granito",
    texto: [
      "Nas margens, a paisagem minhota e galega é densa e fresca: terra húmida, vegetação que desce até à água, o granito das pontes e dos cais, as pedras roladas pelo rio e a névoa da manhã.",
      "A coleção Margem é a do abrigo e da matéria: superfícies que pedem para ser tocadas, verdes profundos e a cor da pedra."
    ],
    paleta: [
      ["Verde esmeralda", "#2E6B4F"],
      ["Verde oliva", "#6B7445"],
      ["Cinza granito", "#8C8B86"],
      ["Branco névoa", "#EDEDE8"]
    ],
    materia: "Acabamento natural e texturizado, sem brilho, rústico e terroso.",
    fotos: []
  }
];
