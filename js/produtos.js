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

  MATERIAIS: aço inoxidável e aço cirúrgico (brincos em aço cirúrgico).
  PEÇAS ÚNICAS: cada peça é esculpida à mão livre e nunca sai igual.
  Cada entrada é UMA peça, com as fotos dessa peça exata.
  "vendida": false = à venda; true = vendida (fica visível como arquivo).
  "tamanho": tamanho desta peça (anéis/pulseiras), ou "" se não se aplica.
  Para uma peça nova da mesma coleção, copie uma entrada e mude o "handle".
*/
window.JUSANTE_PRODUTOS = [
  {
    handle: "anel-seixo",
    titulo: "Anel Seixo",
    colecao: "Seixos",
    tipo: "Anéis",
    preco: 145,
    material: "Aço inoxidável",
    vendida: false,
    descricao:
      "Desenhado a partir de um seixo recolhido na margem de Vila Nova de Cerveira. A forma arredondada e a superfície acetinada lembram a pedra polida pela água.",
    detalhes: ["Aço inoxidável", "Acabamento acetinado à mão", "Não escurece com o uso"],
    tamanho: "14",
    imagens: []
  },
  {
    handle: "brincos-foz",
    titulo: "Brincos Foz",
    colecao: "Foz",
    tipo: "Brincos",
    preco: 128,
    material: "Aço cirúrgico dourado",
    vendida: false,
    descricao:
      "O desenho nasce do ponto onde o Minho encontra o Atlântico, entre Caminha e A Guarda: duas linhas que se abrem e nunca voltam a fechar.",
    detalhes: ["Aço cirúrgico", "Acabamento dourado", "Fecho de pressão", "Comprimento 3,2 cm"],
    tamanho: "",
    imagens: []
  },
  {
    handle: "colar-corrente",
    titulo: "Colar Corrente",
    colecao: "Correntes",
    tipo: "Colares",
    preco: 210,
    material: "Aço inoxidável",
    vendida: false,
    descricao:
      "Elos de tamanhos irregulares, escolhidos e montados um a um, como a água a ganhar velocidade depois das pesqueiras de Melgaço.",
    detalhes: ["Aço inoxidável", "Elos montados à mão", "Comprimento 45 cm", "Fecho de mosquetão"],
    tamanho: "",
    imagens: []
  },
  {
    handle: "pulseira-margem",
    titulo: "Pulseira Margem",
    colecao: "Correntes",
    tipo: "Pulseiras",
    preco: 165,
    material: "Aço inoxidável prateado e dourado",
    vendida: false,
    descricao:
      "Duas margens, dois tons. Uma fita de aço prateado com um único ponto dourado: a ponte entre Valença e Tui.",
    detalhes: ["Aço inoxidável", "Dois tons: prateado e dourado", "Abertura ajustável", "Largura 6 mm"],
    tamanho: "M",
    imagens: []
  },
  {
    handle: "anel-insua",
    titulo: "Anel Ínsua",
    colecao: "Foz",
    tipo: "Anéis",
    preco: 240,
    material: "Aço inoxidável dourado",
    vendida: false,
    descricao:
      "Inspirado nas ínsuas, as pequenas ilhas de areia e salgueiros que o rio desenha e apaga. Uma forma orgânica e aberta, que se ajusta ao dedo.",
    detalhes: ["Aço inoxidável", "Acabamento dourado", "Peça assinada"],
    tamanho: "15",
    imagens: []
  },
  {
    handle: "brincos-nevoeiro",
    titulo: "Brincos Nevoeiro",
    colecao: "Seixos",
    tipo: "Brincos",
    preco: 118,
    material: "Aço cirúrgico e pérola de água doce",
    vendida: false,
    descricao:
      "Para as manhãs em que o rio desaparece debaixo do nevoeiro. Uma pérola barroca suspensa numa gota de aço fosco.",
    detalhes: ["Aço cirúrgico", "Pérola barroca de água doce", "Cada pérola é única", "Comprimento 2,8 cm"],
    tamanho: "",
    imagens: []
  },
  {
    handle: "colar-meandro",
    titulo: "Colar Meandro",
    colecao: "Correntes",
    tipo: "Colares",
    preco: 185,
    material: "Aço inoxidável dourado",
    vendida: true,
    descricao:
      "Um pendente desenhado sobre o mapa do rio entre Monção e Valença, recortado e acabado à mão.",
    detalhes: ["Aço inoxidável", "Acabamento dourado", "Corrente 42 + 3 cm", "Pendente 2,4 cm"],
    tamanho: "",
    imagens: []
  },
  {
    handle: "argolas-mare",
    titulo: "Argolas Maré",
    colecao: "Foz",
    tipo: "Brincos",
    preco: 98,
    material: "Aço cirúrgico",
    vendida: false,
    descricao:
      "Argolas de espessura variável, como o nível da água na foz ao longo do dia. Leves, para usar sempre.",
    detalhes: ["Aço cirúrgico", "Polimento espelhado", "Diâmetro 2 cm", "Fecho de dobradiça"],
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
      "Um cabochão oval em cerâmica plástica, modelado à mão para recriar o favo de mel da opala etíope: pequenos alvéolos de cor que mudam conforme a luz. A base em aço foi escolhida à medida deste cabochão.",
    detalhes: ["Aço inoxidável", "Base com garras"],
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

window.JUSANTE_COLECOES = [
  { nome: "Foz", texto: "Onde o rio se entrega ao mar. Linhas abertas e luz." },
  { nome: "Seixos", texto: "Formas polidas pelo tempo e pela água. Texturas suaves e orgânicas." },
  { nome: "Correntes", texto: "Elos, movimento e ritmo. Peças montadas uma a uma." }
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
