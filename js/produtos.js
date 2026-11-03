/*
  CATÁLOGO JUSANTE
  ----------------------------------------------------------------
  Estrutura pensada para migrar para o Shopify (handle, title, body_html,
  product_type, tags, images).

  COLEÇÕES PERMANENTES (Brand Bible, 5.2): Poente, Corrente, Margem.
  ESPECIALIDADE: Opala favo de mel (réplicas em cerâmica plástica).

  PEÇAS ÚNICAS: cada peça é esculpida à mão livre e nunca sai igual.
  Cada entrada é UMA peça, com as fotos dessa peça exata.
  "vendida": false = à venda; true = vendida (fica visível como arquivo).
  "tamanho": tamanho desta peça (anéis/pulseiras), ou "" se não se aplica.
  Para uma peça nova da mesma coleção, copie uma entrada e mude o "handle".

  DESCRIÇÕES (Brand Bible, 9.3): forma + matéria + território + sensação.
  Evitar "lindo", "super delicado", "exclusivo" sem prova.

  FOTOS: há duas formas de testar fotos:
   1) No site, ative o "Modo fotos" (botão no canto inferior) e arraste
      as fotos para cada peça. Ficam guardadas só no seu navegador.
   2) Coloque os ficheiros na pasta /fotos e escreva os caminhos em
      "imagens", ex.: imagens: ["fotos/brincos-luz-baixa-1.jpg"]
      (é assim que ficam visíveis no GitHub Pages para qualquer dispositivo).

  MATERIAIS: cerâmica plástica esculpida à mão + aço inoxidável / aço
  cirúrgico (brincos em aço cirúrgico).
  Nomes, preços e medidas abaixo são EXEMPLOS: substitua pelos reais.
*/
window.JUSANTE_PRODUTOS = [
  /* ---------- POENTE ---------- */
  {
    handle: "brincos-luz-baixa",
    titulo: "Brincos Luz Baixa",
    colecao: "Poente",
    tipo: "Brincos",
    preco: 68,
    material: "Cerâmica plástica e aço cirúrgico dourado",
    vendida: false,
    descricao:
      "Duas formas orgânicas em diálogo, separadas pela fenda central. Inspirados na luz de fim de tarde sobre as pedras da margem, combinam cerâmica plástica em âmbar e terra rosada com aço cirúrgico dourado. Um lado é maior do que o outro: diferem, mas pertencem um ao outro.",
    detalhes: ["Esculpidos à mão livre", "Duas partes assimétricas", "Aço cirúrgico dourado", "Comprimento 3,5 cm"],
    tamanho: "",
    imagens: []
  },
  {
    handle: "anel-pedra-quente",
    titulo: "Anel Pedra Quente",
    colecao: "Poente",
    tipo: "Anéis",
    preco: 72,
    material: "Cerâmica plástica e aço inoxidável",
    vendida: false,
    descricao:
      "Um volume arredondado aberto por uma fenda, que deixa ver uma segunda textura, mais rugosa, em terracota. Inspirado nas pedras que guardam o calor do sol depois do poente.",
    detalhes: ["Esculpido à mão livre", "Fenda que revela uma segunda textura", "Base em aço inoxidável"],
    tamanho: "14",
    imagens: []
  },
  {
    handle: "pendente-fim-de-tarde",
    titulo: "Pendente Fim de Tarde",
    colecao: "Poente",
    tipo: "Colares",
    preco: 84,
    material: "Cerâmica plástica e aço inoxidável dourado",
    vendida: true,
    descricao:
      "Pingente bipartido: duas meias-luas de tamanhos diferentes, separadas por um intervalo onde passa a luz. Em tons de âmbar e rosado seco.",
    detalhes: ["Esculpido à mão livre", "Pingente em duas partes", "Corrente 45 cm em aço inoxidável dourado"],
    tamanho: "",
    imagens: []
  },

  /* ---------- CORRENTE ---------- */
  {
    handle: "brincos-remanso",
    titulo: "Brincos Remanso",
    colecao: "Corrente",
    tipo: "Brincos",
    preco: 64,
    material: "Cerâmica plástica e aço cirúrgico",
    vendida: false,
    descricao:
      "Um brinco liso, como a água parada no remanso; o outro com sulcos finos, como a correnteza ao centro do rio. Em verde de rio e azul acinzentado, com aço cirúrgico.",
    detalhes: ["Esculpidos à mão livre", "Par assimétrico: calmaria e correnteza", "Aço cirúrgico", "Comprimento 3 cm"],
    tamanho: "",
    imagens: []
  },
  {
    handle: "colar-correnteza",
    titulo: "Colar Correnteza",
    colecao: "Corrente",
    tipo: "Colares",
    preco: 92,
    material: "Cerâmica plástica, pérola de água doce e aço inoxidável",
    vendida: false,
    descricao:
      "Uma forma alongada e curva, cortada por uma linha negativa, com uma pérola de água doce suspensa no intervalo. Inspirado no movimento da água a contornar uma pedra.",
    detalhes: ["Esculpido à mão livre", "Pérola barroca de água doce", "Corrente 42 + 3 cm em aço inoxidável"],
    tamanho: "",
    imagens: []
  },
  {
    handle: "argolas-reflexo",
    titulo: "Argolas Reflexo",
    colecao: "Corrente",
    tipo: "Brincos",
    preco: 58,
    material: "Cerâmica plástica translúcida e aço cirúrgico",
    vendida: false,
    descricao:
      "Argolas em aço com uma pequena forma em cerâmica plástica translúcida, em azul muito suave. Cada lado tem uma forma diferente, como dois reflexos da mesma margem.",
    detalhes: ["Esculpidas à mão livre", "Cerâmica plástica translúcida", "Argola em aço cirúrgico, 2 cm"],
    tamanho: "",
    imagens: []
  },

  /* ---------- MARGEM ---------- */
  {
    handle: "anel-granito",
    titulo: "Anel Granito",
    colecao: "Margem",
    tipo: "Anéis",
    preco: 70,
    material: "Cerâmica plástica e aço inoxidável",
    vendida: false,
    descricao:
      "Duas massas encostadas, uma lisa e outra granulada, separadas por uma fenda estreita. Inspirado no granito molhado das margens, em cinza mineral e branco quente.",
    detalhes: ["Esculpido à mão livre", "Duas texturas: lisa e granulada", "Base em aço inoxidável"],
    tamanho: "15",
    imagens: []
  },
  {
    handle: "pulseira-abrigo",
    titulo: "Pulseira Abrigo",
    colecao: "Margem",
    tipo: "Pulseiras",
    preco: 88,
    material: "Cerâmica plástica e aço inoxidável",
    vendida: false,
    descricao:
      "Metade lisa, metade texturizada: a calmaria da margem e a correnteza ao lado. Em areia e verde sálvia, com fecho em aço inoxidável.",
    detalhes: ["Esculpida à mão livre", "Metade lisa / metade texturizada", "Fecho em aço inoxidável"],
    tamanho: "M",
    imagens: []
  },
  {
    handle: "brincos-musgo",
    titulo: "Brincos Musgo",
    colecao: "Margem",
    tipo: "Brincos",
    preco: 62,
    material: "Cerâmica plástica e aço cirúrgico",
    vendida: false,
    descricao:
      "Duas pequenas formas de contorno irregular, com uma granulação feita ponto a ponto, em verde baixo e sombra húmida. Uma é mais escura do que a outra, como os dois lados de uma pedra à beira do rio.",
    detalhes: ["Esculpidos à mão livre", "Textura granulada feita à mão", "Aço cirúrgico", "Comprimento 2,2 cm"],
    tamanho: "",
    imagens: []
  },

  /* ---------- ESPECIALIDADE: OPALA FAVO DE MEL DA ETIÓPIA ----------
     IMPORTANTE: estas peças NÃO têm opala natural. São feitas à mão em
     cerâmica plástica: são réplicas visuais da opala favo de mel.
     "efeito" aparece na ficha da página de produto. */
  {
    handle: "anel-favo",
    titulo: "Anel Favo",
    colecao: "Opala",
    especialidade: "opala",
    tipo: "Anéis",
    preco: 690,
    material: "Aço inoxidável e réplica de opala em cerâmica plástica",
    vendida: false,
    descricao:
      "Um anel com fenda, que deixa ver uma réplica de opala em cerâmica plástica, modelada à mão para recriar o favo de mel da opala etíope: pequenos alvéolos de cor que mudam conforme a luz.",
    detalhes: ["Aço inoxidável", "Fenda que revela a réplica de opala"],
    tamanho: "13",
    efeito: { padrao: "Favo de mel", tons: "Verde, laranja e azul", forma: "Cabochão oval", medidas: "10 × 8 mm" },
    imagens: []
  },
  {
    handle: "pendente-colmeia",
    titulo: "Pendente Colmeia",
    colecao: "Opala",
    especialidade: "opala",
    tipo: "Colares",
    preco: 540,
    material: "Aço inoxidável dourado e réplica de opala em cerâmica plástica",
    vendida: false,
    descricao:
      "Uma gota grande em cerâmica plástica, de fundo translúcido, em que o efeito favo de mel aparece sobretudo nos laranjas e verdes. A moldura lembra o leito do rio a passar à volta de uma pedra.",
    detalhes: ["Aço inoxidável dourado", "Moldura em fio", "Corrente 45 cm"],
    tamanho: "",
    efeito: { padrao: "Favo de mel com reflexos largos", tons: "Laranja e verde", forma: "Cabochão em gota", medidas: "14 × 10 mm" },
    imagens: []
  },
  {
    handle: "brincos-alveolo",
    titulo: "Brincos Alvéolo",
    colecao: "Opala",
    especialidade: "opala",
    tipo: "Brincos",
    preco: 460,
    material: "Aço cirúrgico e réplica de opala em cerâmica plástica",
    vendida: false,
    descricao:
      "Dois cabochões em cerâmica plástica, modelados lado a lado a partir da mesma mistura de cores, para que o efeito favo de mel seja parecido nos dois, mas nunca igual.",
    detalhes: ["Aço cirúrgico", "Base em virola", "Fecho de pressão", "Comprimento 1,6 cm"],
    tamanho: "",
    efeito: { padrao: "Favo de mel", tons: "Azul e verde", forma: "Cabochão redondo", medidas: "6 mm" },
    imagens: []
  },
  {
    handle: "anel-mel-do-rio",
    titulo: "Anel Mel do Rio",
    colecao: "Opala",
    especialidade: "opala",
    tipo: "Anéis",
    preco: 380,
    material: "Aço inoxidável e réplica de opala em cerâmica plástica",
    vendida: true,
    descricao:
      "Um cabochão em cerâmica plástica, em tons de mel, sobre uma fita de aço com um único ponto dourado, como o sol baixo sobre o Minho.",
    detalhes: ["Aço inoxidável", "Fita com detalhe dourado"],
    tamanho: "",
    efeito: { padrao: "Favo de mel", tons: "Mel e âmbar", forma: "Cabochão oval", medidas: "9 × 7 mm" },
    imagens: []
  }
];

/* Coleções permanentes iniciais (Brand Bible, 5.2) */
window.JUSANTE_COLECOES = [
  { nome: "Poente", texto: "Luz baixa e pedras quentes. Âmbar, rosado, terracota e dourado suave." },
  { nome: "Corrente", texto: "Fluxo e transparência. Verde de rio, azul acinzentado, pérola e linhas alongadas." },
  { nome: "Margem", texto: "Abrigo, terra e musgo. Areia, raiz, granito e superfícies táteis." }
];

/*
  IMAGENS DE REFERÊNCIA (enquanto não há fotos próprias)
  Mostradas quando não há foto de teste nem foto em "fotos/".
  A licença CC BY obriga a manter o crédito visível.
*/
window.JUSANTE_REFERENCIAS = {
  "opala:destaque": {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Precious_opal_(Delanta_District,_South_Wello,_Ethiopia)_3_(29719697721).jpg?width=1600",
    legenda: "Opala natural de Welo (Etiópia), a pedra que inspira esta coleção. As peças Jusante não contêm opala: levam réplicas em cerâmica plástica",
    autor: "James St. John",
    licenca: "CC BY 2.0",
    licencaUrl: "https://creativecommons.org/licenses/by/2.0/",
    fonte: "https://commons.wikimedia.org/wiki/File:Precious_opal_(Delanta_District,_South_Wello,_Ethiopia)_3_(29719697721).jpg"
  }
};
