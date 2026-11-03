/*
  CATÁLOGO JUSANTE
  ----------------------------------------------------------------
  Estrutura pensada para migrar para o Shopify (handle, title, body_html,
  vendor, product_type, tags, variants, images).

  FOTOS: há duas formas de testar fotos:
   1) No site, ative o "Modo fotos" (botão no canto inferior) e arraste
      as fotos para cada peça. Ficam guardadas só no seu navegador.
   2) Coloque os ficheiros na pasta /fotos e escreva os caminhos em
      "imagens", ex.: imagens: ["fotos/anel-seixo-1.jpg", "fotos/anel-seixo-2.jpg"]
      (é assim que ficam visíveis no GitHub Pages para qualquer dispositivo).

  EDIÇÃO: "edicao" = total de exemplares; "disponiveis" = quantos restam.
*/
window.JUSANTE_PRODUTOS = [
  {
    handle: "anel-seixo",
    titulo: "Anel Seixo",
    colecao: "Seixos",
    tipo: "Anéis",
    preco: 145,
    material: "Prata 925 fundida em areia do rio",
    edicao: 5,
    disponiveis: 2,
    descricao:
      "Modelado a partir de um seixo recolhido na margem de Vila Nova de Cerveira. A superfície guarda as marcas da água — cada exemplar é fundido individualmente e nunca sai igual ao anterior.",
    detalhes: ["Prata 925", "Fundição em areia", "Acabamento acetinado à mão", "Tamanhos 10–18 por encomenda"],
    tamanhos: ["12", "14", "16"],
    imagens: []
  },
  {
    handle: "brincos-foz",
    titulo: "Brincos Foz",
    colecao: "Foz",
    tipo: "Brincos",
    preco: 128,
    material: "Prata 925 com banho de ouro 18k",
    edicao: 7,
    disponiveis: 4,
    descricao:
      "O desenho nasce do ponto onde o Minho encontra o Atlântico, entre Caminha e A Guarda: duas linhas que se abrem e nunca voltam a fechar.",
    detalhes: ["Prata 925", "Banho de ouro 18k (3 mícrons)", "Fecho de pressão", "Comprimento 3,2 cm"],
    tamanhos: [],
    imagens: []
  },
  {
    handle: "colar-corrente",
    titulo: "Colar Corrente",
    colecao: "Correntes",
    tipo: "Colares",
    preco: 210,
    material: "Prata 925 oxidada",
    edicao: 3,
    disponiveis: 1,
    descricao:
      "Elos forjados um a um, de tamanhos irregulares, como a água a ganhar velocidade depois das pesqueiras de Melgaço.",
    detalhes: ["Prata 925 oxidada", "Elos forjados à mão", "Comprimento 45 cm", "Fecho de mosquetão gravado"],
    tamanhos: [],
    imagens: []
  },
  {
    handle: "pulseira-margem",
    titulo: "Pulseira Margem",
    colecao: "Correntes",
    tipo: "Pulseiras",
    preco: 165,
    material: "Prata 925 e ouro 9k",
    edicao: 5,
    disponiveis: 3,
    descricao:
      "Duas margens, dois metais. Uma fita de prata martelada com um único ponto de ouro: a ponte entre Valença e Tui.",
    detalhes: ["Prata 925 martelada", "Aplicação em ouro 9k", "Abertura ajustável", "Largura 6 mm"],
    tamanhos: ["S", "M"],
    imagens: []
  },
  {
    handle: "anel-insua",
    titulo: "Anel Ínsua",
    colecao: "Foz",
    tipo: "Anéis",
    preco: 240,
    material: "Ouro 18k reciclado",
    edicao: 3,
    disponiveis: 2,
    descricao:
      "Inspirado nas ínsuas — as pequenas ilhas de areia e salgueiros que o rio desenha e apaga. Uma forma orgânica que se ajusta ao dedo.",
    detalhes: ["Ouro 18k reciclado", "Cera perdida", "Peça assinada e numerada", "Tamanhos por encomenda"],
    tamanhos: ["12", "14", "16"],
    imagens: []
  },
  {
    handle: "brincos-nevoeiro",
    titulo: "Brincos Nevoeiro",
    colecao: "Seixos",
    tipo: "Brincos",
    preco: 118,
    material: "Prata 925 e pérola de água doce",
    edicao: 7,
    disponiveis: 5,
    descricao:
      "Para as manhãs em que o rio desaparece debaixo do nevoeiro. Uma pérola barroca suspensa numa gota de prata fosca.",
    detalhes: ["Prata 925", "Pérola barroca de água doce", "Cada pérola é única", "Comprimento 2,8 cm"],
    tamanhos: [],
    imagens: []
  },
  {
    handle: "colar-meandro",
    titulo: "Colar Meandro",
    colecao: "Correntes",
    tipo: "Colares",
    preco: 185,
    material: "Prata 925 com banho de ouro 18k",
    edicao: 5,
    disponiveis: 0,
    descricao:
      "Um pendente desenhado sobre o mapa do rio entre Monção e Valença, cortado e polido à mão.",
    detalhes: ["Prata 925", "Banho de ouro 18k", "Corrente 42 + 3 cm", "Pendente 2,4 cm"],
    tamanhos: [],
    imagens: []
  },
  {
    handle: "argolas-mare",
    titulo: "Argolas Maré",
    colecao: "Foz",
    tipo: "Brincos",
    preco: 98,
    material: "Prata 925",
    edicao: 9,
    disponiveis: 6,
    descricao:
      "Argolas de espessura variável, como o nível da água na foz ao longo do dia. Leves, para usar sempre.",
    detalhes: ["Prata 925", "Polimento espelhado", "Diâmetro 2 cm", "Fecho de dobradiça"],
    tamanhos: [],
    imagens: []
  },
  /* ---------- ESPECIALIDADE: OPALA FAVO DE MEL DA ETIÓPIA ----------
     Cada pedra é única, por isso cada peça tem edicao: 1.
     "pedra" aparece na ficha da página de produto. */
  {
    handle: "anel-favo",
    titulo: "Anel Favo",
    colecao: "Opala",
    especialidade: "opala",
    tipo: "Anéis",
    preco: 690,
    material: "Ouro 18k reciclado e opala etíope",
    edicao: 1,
    disponiveis: 1,
    descricao:
      "Um cabochão oval com um padrão favo de mel nítido, em que cada alvéolo acende uma cor diferente conforme a luz. A garra em ouro foi modelada à volta desta pedra, e de nenhuma outra.",
    detalhes: ["Ouro 18k reciclado", "Engaste em garras modeladas à mão", "Tamanho ajustado por encomenda"],
    tamanhos: ["12", "14", "16"],
    pedra: { origem: "Welo (Wollo), Etiópia", padrao: "Favo de mel", peso: "2,1 ct", corte: "Cabochão oval", medidas: "10 × 8 mm", tratamento: "Natural, sem tratamento" },
    imagens: []
  },
  {
    handle: "pendente-colmeia",
    titulo: "Pendente Colmeia",
    colecao: "Opala",
    especialidade: "opala",
    tipo: "Colares",
    preco: 540,
    material: "Prata 925 com banho de ouro 18k e opala etíope",
    edicao: 1,
    disponiveis: 1,
    descricao:
      "Uma opala grande, de corpo cristalino, em que o favo de mel aparece sobretudo nos laranjas e verdes. A moldura lembra o leito do rio a passar à volta de uma pedra.",
    detalhes: ["Prata 925 com banho de ouro 18k", "Moldura em fio martelado", "Corrente 45 cm"],
    tamanhos: [],
    pedra: { origem: "Welo (Wollo), Etiópia", padrao: "Favo de mel com relâmpagos largos", peso: "3,4 ct", corte: "Cabochão em gota", medidas: "14 × 10 mm", tratamento: "Natural, sem tratamento" },
    imagens: []
  },
  {
    handle: "brincos-alveolo",
    titulo: "Brincos Alvéolo",
    colecao: "Opala",
    especialidade: "opala",
    tipo: "Brincos",
    preco: 460,
    material: "Ouro 9k e par de opalas etíopes",
    edicao: 1,
    disponiveis: 1,
    descricao:
      "Duas opalas escolhidas uma para a outra no mesmo lote, com o padrão favo de mel e o brilho tão parecidos quanto a natureza permite, mas nunca iguais.",
    detalhes: ["Ouro 9k", "Engaste em virola", "Fecho de pressão", "Comprimento 1,6 cm"],
    tamanhos: [],
    pedra: { origem: "Welo (Wollo), Etiópia", padrao: "Favo de mel", peso: "2 × 0,8 ct", corte: "Cabochão redondo", medidas: "6 mm", tratamento: "Natural, sem tratamento" },
    imagens: []
  },
  {
    handle: "anel-mel-do-rio",
    titulo: "Anel Mel do Rio",
    colecao: "Opala",
    especialidade: "opala",
    tipo: "Anéis",
    preco: 380,
    material: "Prata 925, ouro 9k e opala etíope",
    edicao: 1,
    disponiveis: 0,
    descricao:
      "Uma opala de tons de mel engastada numa fita de prata martelada, com um único ponto de ouro, como o sol baixo sobre o Minho.",
    detalhes: ["Prata 925 martelada", "Engaste em ouro 9k"],
    tamanhos: [],
    pedra: { origem: "Welo (Wollo), Etiópia", padrao: "Favo de mel", peso: "1,6 ct", corte: "Cabochão oval", medidas: "9 × 7 mm", tratamento: "Natural, sem tratamento" },
    imagens: []
  }
];

window.JUSANTE_COLECOES = [
  { nome: "Foz", texto: "Onde o rio se entrega ao mar. Linhas abertas, ouro e luz." },
  { nome: "Seixos", texto: "Formas polidas pelo tempo e pela água. Prata fundida em areia." },
  { nome: "Correntes", texto: "Elos, movimento e ritmo. Peças forjadas uma a uma." }
];
