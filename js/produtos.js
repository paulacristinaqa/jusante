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
  }
];

window.JUSANTE_COLECOES = [
  { nome: "Foz", texto: "Onde o rio se entrega ao mar. Linhas abertas, ouro e luz." },
  { nome: "Seixos", texto: "Formas polidas pelo tempo e pela água. Prata fundida em areia." },
  { nome: "Correntes", texto: "Elos, movimento e ritmo. Peças forjadas uma a uma." }
];
