/* ==========  JUSANTE — loja de pré-visualização  ========== */
(() => {
  const P = window.JUSANTE_PRODUTOS;
  const C = window.JUSANTE_COLECOES;
  const REF = window.JUSANTE_REFERENCIAS || {};
  const app = document.getElementById("app");
  const SIMBOLO = "assets/simbolo.svg";
  const MAX_FOTOS = 6;
  const eur = (n) => n.toLocaleString("pt-PT", { minimumFractionDigits: 0 }) + " €";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const porHandle = (h) => P.find((p) => p.handle === h);

  /* ---------------- armazenamento seguro ---------------- */
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  /* ---------------- IndexedDB para fotos ---------------- */
  let db = null;
  const cache = {}; // chave -> [{id, url, w, h, nome}]
  function abrirDB() {
    return new Promise((res) => {
      try {
        const r = indexedDB.open("jusante-fotos", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("fotos", { keyPath: "id" });
        r.onsuccess = () => { db = r.result; res(); };
        r.onerror = () => res();
      } catch { res(); }
    });
  }
  function tx(modo) { return db.transaction("fotos", modo).objectStore("fotos"); }
  function carregarTodas() {
    return new Promise((res) => {
      if (!db) return res();
      const r = tx("readonly").getAll();
      r.onsuccess = () => {
        r.result.sort((a, b) => a.ordem - b.ordem).forEach((f) => {
          (cache[f.chave] ||= []).push({ id: f.id, url: URL.createObjectURL(f.blob), w: f.w, h: f.h, nome: f.nome });
        });
        res();
      };
      r.onerror = () => res();
    });
  }
  function medir(file) {
    return new Promise((res) => {
      const url = URL.createObjectURL(file);
      const im = new Image();
      im.onload = () => res({ url, w: im.naturalWidth, h: im.naturalHeight });
      im.onerror = () => res(null);
      im.src = url;
    });
  }
  async function adicionarFotos(chave, files, substituirIdx = null) {
    const lista = (cache[chave] ||= []);
    let n = 0;
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const m = await medir(file);
      if (!m) continue;
      const reg = { id: chave + ":" + Date.now() + ":" + Math.random().toString(36).slice(2, 7), chave, blob: file, w: m.w, h: m.h, nome: file.name, ordem: Date.now() + n };
      if (db) tx("readwrite").put(reg);
      const item = { id: reg.id, url: m.url, w: m.w, h: m.h, nome: file.name };
      if (substituirIdx !== null && lista[substituirIdx]) {
        removerRegisto(lista[substituirIdx].id);
        lista[substituirIdx] = item; substituirIdx = null;
      } else if (lista.length < MAX_FOTOS) lista.push(item);
      n++;
    }
    if (n) toast(n === 1 ? "Foto adicionada" : n + " fotos adicionadas");
    render();
  }
  function removerRegisto(id) { if (db) tx("readwrite").delete(id); }
  function removerFoto(chave, idx) {
    const l = cache[chave]; if (!l || !l[idx]) return;
    removerRegisto(l[idx].id); URL.revokeObjectURL(l[idx].url); l.splice(idx, 1);
    toast("Foto removida"); render();
  }
  function limparTudo() {
    if (db) tx("readwrite").clear();
    Object.keys(cache).forEach((k) => delete cache[k]);
    toast("Todas as fotos de teste foram apagadas"); render();
  }

  /* fotos de uma chave: primeiro as de teste, depois as do ficheiro produtos.js */
  function fotosDe(chave) {
    if (cache[chave]?.length) return cache[chave];
    const p = porHandle(chave);
    if (p?.imagens?.length) return p.imagens.map((url) => ({ url, w: 0, h: 0, ficheiro: true }));
    return REF[chave] ? [{ url: REF[chave].url, w: 0, h: 0, ref: true }] : [];
  }

  /* ---------------- configurações do modo fotos ---------------- */
  const cfg = Object.assign({ modo: false, fundo: "creme", formato: "1/1", ajuste: "cover" }, ls.get("jusante-cfg", {}));
  function aplicarCfg() {
    document.body.classList.toggle("modo-fotos", cfg.modo);
    document.body.dataset.fundo = cfg.fundo;
    document.documentElement.style.setProperty("--formato", cfg.formato);
    document.documentElement.style.setProperty("--ajuste", cfg.ajuste);
    document.querySelectorAll("[data-opcao]").forEach((s) => (s.value = cfg[s.dataset.opcao]));
    ls.set("jusante-cfg", cfg);
  }

  /* ---------------- componente: slot de foto ---------------- */
  function avisoFoto(f, formatoProprio) {
    if (!f || !f.w) return "";
    if (formatoProprio === "auto") return Math.min(f.w, f.h) < 1600 ? "Baixa resolução" : "";
    const [a, b] = (formatoProprio || cfg.formato).split("/").map(Number);
    const alvo = a / b, real = f.w / f.h;
    const av = [];
    if (Math.min(f.w, f.h) < 1200) av.push("Baixa resolução");
    if (Math.abs(real - alvo) / alvo > 0.04) av.push("Proporção diferente");
    return av.join(" · ");
  }
  function slot(chave, { idx = 0, rotulo = "", hover = true, formato = null, modo = "adicionar" } = {}) {
    const fotos = fotosDe(chave);
    const f = fotos[idx];
    const f2 = hover && fotos[idx + 1];
    const vazia = `<div class="foto-vazia"><img src="${SIMBOLO}" alt=""><span>${esc(rotulo || "Foto em breve")}</span></div>`;
    const imgs = f && f.ref
      ? `${vazia}<img src="${f.url}" alt="${esc(REF[chave].legenda)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`
      : f
      ? `<img src="${f.url}" alt="${esc(rotulo)}" loading="lazy">${f2 ? `<img src="${f2.url}" alt="" loading="lazy">` : ""}`
      : vazia;
    const aviso = avisoFoto(f, formato);
    const temTeste = cache[chave]?.length;
    const chip = f && temTeste
      ? `<span class="chip"><span class="chip-btn" data-acao-foto="escolher">${modo === "substituir" ? "Trocar" : "+ Foto"}</span> ${fotos.length}/${MAX_FOTOS} <span class="chip-btn" data-acao-foto="remover">Remover</span></span>`
      : `<span class="chip">Arraste ou clique para adicionar</span>`;
    return `<div class="foto-slot" data-slot="${esc(chave)}" data-idx="${idx}" data-modo="${modo}" ${formato ? `style="aspect-ratio:${formato}"` : ""}>
      ${imgs}
      <div class="foto-alvo">${chip}<input type="file" accept="image/*" ${modo === "substituir" ? "" : "multiple"}></div>
      <span class="foto-aviso ${aviso ? "mostrar" : ""}">${aviso}</span>
      ${f && f.w ? `<span class="foto-info">${f.w}×${f.h}</span>` : ""}
    </div>`;
  }

  /* crédito obrigatório das imagens de referência (só quando estão a ser usadas) */
  function credito(chave) {
    const r = REF[chave];
    if (!r || cache[chave]?.length) return "";
    return `<p class="credito">${esc(r.legenda)}. Foto: <a href="${r.fonte}" target="_blank" rel="noopener">${esc(r.autor)}</a>, <a href="${r.licencaUrl}" target="_blank" rel="noopener">${esc(r.licenca)}</a>, via Wikimedia Commons.</p>`;
  }

  /* ---------------- componentes ---------------- */
  const ondas = `<svg class="ondas" viewBox="0 0 1200 38" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="1"><path d="M0 14 Q 50 2 100 14 T 200 14 T 300 14 T 400 14 T 500 14 T 600 14 T 700 14 T 800 14 T 900 14 T 1000 14 T 1100 14 T 1200 14"/><path d="M0 24 Q 50 12 100 24 T 200 24 T 300 24 T 400 24 T 500 24 T 600 24 T 700 24 T 800 24 T 900 24 T 1000 24 T 1100 24 T 1200 24" opacity=".5"/></svg>`;

  function pontos(p) {
    return `<span class="pontos" aria-hidden="true">${Array.from({ length: p.edicao }, (_, i) => `<i class="${i < p.disponiveis ? "cheio" : ""}"></i>`).join("")}</span>`;
  }
  function tiragemTxt(p) {
    if (p.edicao === 1) return p.disponiveis ? "Peça única" : "Peça única · vendida";
    if (!p.disponiveis) return `Edição de ${p.edicao} · esgotada`;
    return `Edição de ${p.edicao} · ${p.disponiveis === 1 ? "última peça" : "restam " + p.disponiveis}`;
  }
  function cartao(p) {
    const selo = !p.disponiveis ? `<span class="selo esgotado">${p.edicao === 1 ? "Vendida" : "Esgotada"}</span>` : p.edicao === 1 ? `<span class="selo selo-opala">Peça única</span>` : p.disponiveis === 1 ? `<span class="selo">Última peça</span>` : "";
    return `<article class="cartao surgir">
      <a class="cartao-foto" href="#/p/${p.handle}">${selo}${slot(p.handle, { rotulo: p.titulo })}</a>
      <div>
        <div class="cartao-info"><h3><a href="#/p/${p.handle}">${esc(p.titulo)}</a></h3><span class="preco">${eur(p.preco)}</span></div>
        <div class="mat">${esc(p.material)}</div>${p.efeito ? `<div class="mat-pedra">Réplica em cerâmica plástica · ${esc(p.efeito.padrao.toLowerCase())}</div>` : ""}
      </div>
      <div class="tiragem">${pontos(p)} ${tiragemTxt(p)}</div>
    </article>`;
  }

  /* ---------------- páginas ---------------- */
  function paginaInicio() {
    const destaque = P.filter((p) => p.disponiveis && !p.especialidade).slice(0, 4);
    return `
    <section class="hero">
      <div class="hero-texto">
        <span class="rotulo">Jóias de autor · Alto Minho</span>
        <h1>Peças que seguem <em>a corrente</em><br>e nunca se repetem.</h1>
        <p>Cada jóia Jusante nasce de uma margem, de um seixo, de uma manhã de nevoeiro no Rio Minho. Desenhada e feita à mão, em tiragens de três a nove exemplares — numerados, assinados, irrepetíveis.</p>
        <div class="hero-acoes"><a class="btn" href="#/loja">Ver as peças</a><a class="btn" href="#/atelier" style="border-color:transparent">O atelier →</a></div>
      </div>
      <div class="hero-imagem">${slot("hero", { rotulo: "Imagem principal", hover: false, formato: "auto" })}
        <span class="hero-numero">n.º 01 — Coleção Foz</span></div>
      <img class="hero-ornamento" src="${SIMBOLO}" alt="">
    </section>

    <section class="manifesto surgir">
      <img class="divisor" src="${SIMBOLO}" alt="">
      <p>Não fazemos coleções para repetir. Fazemos <em>pequenas tiragens</em> de um gesto — e quando a última peça encontra dona, o molde volta ao rio.</p>
      <div class="numeros">
        <div><strong>3–9</strong><span>Exemplares por peça</span></div>
        <div><strong>100%</strong><span>Feito à mão</span></div>
        <div><strong>1</strong><span>Autora, uma assinatura</span></div>
      </div>
    </section>

    <div class="envolvente">${ondas}</div>

    <section class="seccao envolvente">
      <div class="seccao-cab"><div><span class="rotulo">Coleções</span><h2 class="titulo">Três troços do <em>mesmo rio</em></h2></div><a class="btn" href="#/colecoes">Todas as coleções</a></div>
      ${blocoColecoes()}
    </section>

    ${blocoOpala()}

    <section class="seccao envolvente">
      <div class="seccao-cab"><div><span class="rotulo">Ainda disponíveis</span><h2 class="titulo">Peças da <em>estação</em></h2></div><a class="btn" href="#/loja">Ver todas</a></div>
      <div class="grelha">${destaque.map(cartao).join("")}</div>
    </section>

    ${blocoAtelier()}
    <section class="seccao envolvente">${blocoCertificado()}</section>
    ${blocoNewsletter()}`;
  }

  /* ---------------- especialidade: opala ---------------- */
  const OPALAS = () => P.filter((p) => p.especialidade === "opala");
  function blocoOpala() {
    const lista = OPALAS().filter((p) => p.disponiveis).slice(0, 3);
    return `<section class="opala-bloco">
      <div class="envolvente opala-grelha">
        <div class="surgir opala-foto">${slot("opala:destaque", { rotulo: "Opala favo de mel — detalhe", hover: false, formato: "4/5", modo: "substituir" })}${credito("opala:destaque")}</div>
        <div class="surgir">
          <span class="rotulo">Especialidade da casa</span>
          <h2 class="titulo" style="margin-top:14px"><span class="brilho">Opala</span> Favo de Mel<br><em>réplicas em cerâmica plástica</em></h2>
          <p>A inspiração é uma pedra que bebe água: a opala de Welo, no norte da Etiópia, absorve a humidade e muda de aspeto com ela, quase como um rio. O seu padrão favo de mel, em que a cor se acende em pequenos alvéolos, é o mais raro destas opalas.</p>
          <p>Nesta coleção não uso opala verdadeira: as peças levam <strong>réplicas em cerâmica plástica</strong>, feitas por mim à mão, camada a camada, até a cor ganhar a profundidade e os alvéolos da pedra. Cada efeito sai diferente, por isso todas as peças são únicas.</p>
          <div class="opala-factos">
            <div><b>Welo</b><span>Inspiração, Etiópia</span></div>
            <div><b>Réplicas</b><span>Em cerâmica plástica</span></div>
            <div><b>1/1</b><span>Peças únicas</span></div>
          </div>
          <a class="btn" href="#/opala">Descobrir a especialidade</a>
        </div>
      </div>
      ${lista.length ? `<div class="envolvente"><div class="grelha grelha-3 opala-cartoes">${lista.map(cartao).join("")}</div></div>` : ""}
    </section>`;
  }

  function paginaOpala() {
    const lista = OPALAS();
    return `<section class="opala-hero">
        <div class="envolvente">
          <img class="divisor" src="${SIMBOLO}" alt="">
          <span class="rotulo">Especialidade Jusante · inspirada na opala da Etiópia</span>
          <h1><span class="brilho">Opala</span> Favo de Mel <em>réplicas em cerâmica plástica</em></h1>
          <p>Peças únicas com réplicas da opala favo de mel de Welo, modeladas à mão em cerâmica plástica. A pedra natural é a inspiração: nenhuma peça desta coleção contém opala verdadeira.</p>
        </div>
      </section>

      <section class="seccao envolvente opala-pedra-grelha">
        <figure class="surgir opala-foto">${slot("opala:destaque", { rotulo: "Opala favo de mel — detalhe", hover: false, formato: "4/5", modo: "substituir" })}${credito("opala:destaque")}</figure>
        <div class="opala-pedra">
          <div class="surgir"><b>i.</b><h4>A pedra que inspira</h4><p>A opala de Welo (Wollo), no planalto do norte da Etiópia, absorve água e muda de aspeto com ela. É a pedra mais "de rio" que conhecemos, e o ponto de partida desta coleção.</p></div>
          <div class="surgir"><b>ii.</b><h4>O padrão favo de mel</h4><p>Pequenas células de cor que se acendem e apagam com o movimento, separadas por finas linhas. É o padrão mais raro da opala etíope, e é ele que procuro recriar.</p></div>
          <div class="surgir"><b>iii.</b><h4>Réplicas em cerâmica plástica</h4><p>Não uso opala natural. Cada réplica é modelada à mão em cerâmica plástica, camada a camada, até ganhar a profundidade e os alvéolos de cor da pedra. Nenhum efeito sai igual a outro.</p></div>
        </div>
      </section>

      <section class="envolvente" style="padding-bottom:clamp(60px,8vw,110px)">
        <div class="seccao-cab"><div><span class="rotulo ouro">Réplicas únicas em cerâmica plástica</span><h2 class="titulo">Cada réplica, <em>uma só jóia</em></h2></div></div>
        <div class="grelha">${lista.map(cartao).join("")}</div>
      </section>

      <section class="opala-cuidados seccao">
        <div class="envolvente opala-cuidados-grelha">
          <div>
            <span class="rotulo ouro">Cuidados</span>
            <h2 class="titulo" style="margin-top:12px">Como cuidar <em>da sua peça</em></h2>
            <p>A cerâmica plástica é leve e resistente, mas o acabamento que imita a opala merece alguns cuidados para manter o brilho.</p>
          </div>
          <ul class="detalhes">
            <li>Tire a jóia antes de tomar banho, nadar ou fazer desporto.</li>
            <li>Evite perfumes, álcool, acetona e produtos de limpeza: podem tirar o brilho ao acabamento.</li>
            <li>Não deixe a peça ao sol forte nem junto de fontes de calor, como o tablier do carro.</li>
            <li>Limpe só com um pano macio, seco ou ligeiramente húmido.</li>
            <li>Guarde-a na bolsa de linho, separada de outras jóias, para não riscar.</li>
          </ul>
        </div>
      </section>

      <section class="seccao envolvente">
        <div class="certificado surgir">
          <img src="${SIMBOLO}" alt="">
          <div>
            <span class="rotulo ouro">Por medida</span>
            <h3 class="titulo" style="font-size:2rem;margin-top:10px">Escolha os tons <em>da sua opala</em></h3>
            <p>Posso criar uma réplica de opala só para si, nos tons que preferir: mais verdes, mais laranjas, mais azuis. Escreva para <strong>ola@jusante.pt</strong>, envio-lhe fotografias e vídeos das réplicas em cerâmica plástica disponíveis, e desenhamos juntas a peça. Cada peça segue com certificado de autenticidade assinado.</p>
          </div>
        </div>
      </section>`;
  }

  function blocoColecoes() {
    return `<div class="colecoes">${C.map((c) => `
      <a class="colecao surgir" href="#/colecao/${encodeURIComponent(c.nome)}">
        ${slot("colecao:" + c.nome, { rotulo: "Imagem da coleção", hover: false, formato: "3/4", modo: "substituir" })}
        <div class="colecao-txt"><h3>${c.nome}</h3><p>${c.texto}</p></div>
      </a>`).join("")}</div>`;
  }

  function blocoAtelier(completo = false) {
    return `<section class="atelier seccao">
      <div class="envolvente">
        <div class="atelier-grelha">
          <div class="surgir">${slot("atelier", { rotulo: "Retrato da autora / bancada", hover: false, formato: "4/5", modo: "substituir" })}</div>
          <div class="surgir">
            <span class="rotulo">O atelier</span>
            <h2 class="titulo" style="margin-top:14px">Um trabalho <em>autoral</em>,<br>peça a peça.</h2>
            <p>Jusante é o atelier de uma só artesã, instalado junto ao Rio Minho. Cada desenho começa num caderno de campo — um seixo, a linha de uma margem, o reflexo da ponte ao fim da tarde — e termina na bancada, entre o aço, a cerâmica plástica e as ferramentas.</p>
            <p>Não há produção em série. Cada modelo existe numa tiragem fechada, entre três e nove exemplares. Quando se esgota, não volta.</p>
            ${completo ? `<p>Aceitamos um número muito limitado de encomendas por medida por ano — presentes, peças a pares e variações de cor das peças da loja. Escreva-nos para <span style="color:var(--ouro)">ola@jusante.pt</span>.</p>` : ""}
            <span class="assinatura">Jusante</span>
          </div>
        </div>
        <div class="processo">
          <div><b>i.</b><h4>Recolha</h4><p>Formas, texturas e cores recolhidas ao longo do rio, de Melgaço à foz.</p></div>
          <div><b>ii.</b><h4>Desenho</h4><p>Esboços à mão e modelação peça a peça, sem moldes industriais.</p></div>
          <div><b>iii.</b><h4>Bancada</h4><p>Montagem e acabamento à mão em aço inoxidável e aço cirúrgico, metais resistentes que não escurecem.</p></div>
          <div><b>iv.</b><h4>Assinatura</h4><p>Cada exemplar é gravado com o número da tiragem e o punção da autora.</p></div>
        </div>
      </div>
    </section>`;
  }

  function blocoCertificado() {
    return `<div class="certificado surgir">
      <img src="${SIMBOLO}" alt="">
      <div>
        <span class="rotulo ouro">Certificado de autenticidade</span>
        <h3 class="titulo" style="font-size:2rem;margin-top:10px">Numerada, assinada, <em>única</em>.</h3>
        <p>Todas as peças seguem com certificado assinado pela autora, com o número do exemplar (ex.: 2/5), os materiais, o peso e a data de criação. A tiragem é registada e nunca é reeditada.</p>
      </div>
    </div>`;
  }

  function blocoNewsletter() {
    return `<section class="newsletter seccao">
      <div class="envolvente surgir">
        <span class="rotulo ouro">Lista de espera</span>
        <h2 class="titulo" style="margin-top:12px">Saiba primeiro das <em>novas tiragens</em></h2>
        <p>As tiragens esgotam depressa. Quem está na lista recebe cada nova peça 48 horas antes da loja.</p>
        <form data-acao="newsletter"><input type="email" placeholder="O seu email" required><button>Inscrever</button></form>
      </div>
    </section>`;
  }

  function paginaLoja(filtro) {
    const tipos = ["Todas", ...new Set(P.map((p) => p.tipo)), "Opala"];
    const f = filtro || "Todas";
    const lista = f === "Todas" ? P : P.filter((p) => p.tipo === f || p.colecao === f);
    return `<section class="loja-cab">
        <img class="divisor" src="${SIMBOLO}" alt="">
        <h1 class="titulo">As <em>peças</em></h1>
        <p>Tiragens fechadas e numeradas. O número de pontos mostra quantos exemplares de cada peça ainda existem.</p>
      </section>
      <div class="envolvente">
        <div class="filtros">${tipos.map((t) => `<button data-filtro="${t}" class="${t === f ? "ativo" : ""}">${t}</button>`).join("")}</div>
        <div class="grelha" style="padding-bottom:110px">${lista.map(cartao).join("")}</div>
      </div>`;
  }

  function paginaColecoes(nome) {
    if (nome) {
      const c = C.find((x) => x.nome === nome);
      const lista = P.filter((p) => p.colecao === nome);
      return `<section class="loja-cab"><img class="divisor" src="${SIMBOLO}" alt=""><span class="rotulo ouro">Coleção</span>
        <h1 class="marca-nome" style="font-size:clamp(3.4rem,7vw,5.5rem);color:var(--verde);display:block;margin-top:6px">${esc(nome)}</h1>
        <p>${esc(c?.texto || "")}</p></section>
        <div class="envolvente"><div class="grelha" style="padding-bottom:110px">${lista.map(cartao).join("")}</div></div>`;
    }
    return `<section class="loja-cab"><img class="divisor" src="${SIMBOLO}" alt=""><h1 class="titulo">As <em>coleções</em></h1>
      <p>Cada coleção corresponde a um troço do Rio Minho — e a um modo diferente de trabalhar o metal.</p></section>
      <section class="envolvente" style="padding-bottom:110px">${blocoColecoes()}</section>`;
  }

  let fotoAtiva = 0, tamanho = null;
  function paginaProduto(h) {
    const p = porHandle(h);
    if (!p) return `<section class="loja-cab"><h1 class="titulo">Peça não encontrada</h1><p><a class="btn" href="#/loja">Voltar à loja</a></p></section>`;
    const fotos = fotosDe(h);
    if (fotoAtiva >= Math.max(fotos.length, 1)) fotoAtiva = 0;
    const numero = p.edicao - p.disponiveis + 1;
    const rel = P.filter((x) => x.handle !== h && (x.colecao === p.colecao || x.tipo === p.tipo)).slice(0, 4);
    const tams = p.tamanhos.length
      ? `<div><span class="rotulo" style="font-size:.66rem">Tamanho</span><div class="opcoes-tam" style="margin-top:10px">${p.tamanhos.map((t) => `<button data-tam="${t}" class="${t === tamanho ? "ativo" : ""}">${t}</button>`).join("")}</div></div>`
      : "";
    const miniaturas = Array.from({ length: Math.max(fotos.length, 1) + (cfg.modo && fotos.length < MAX_FOTOS && fotos.length ? 1 : 0) }, (_, i) =>
      `<div role="button" tabindex="0" data-mini="${i}" class="mini ${i === fotoAtiva ? "ativo" : ""}" aria-label="Foto ${i + 1}">${slot(h, { idx: i, hover: false, rotulo: i < fotos.length ? "" : "+" })}</div>`
    ).join("");
    return `<div class="envolvente">
      <section class="produto">
        <div class="galeria">
          <div class="miniaturas">${miniaturas}</div>
          <div class="galeria-principal">${slot(h, { idx: fotoAtiva, hover: false, rotulo: p.titulo, modo: fotos[fotoAtiva] && cache[h]?.length ? "substituir" : "adicionar" })}</div>
        </div>
        <div class="produto-info">
          <div class="migalhas"><a href="#/loja">Loja</a> / ${p.especialidade ? `<a href="#/opala">Opala favo de mel</a>` : `<a href="#/colecao/${encodeURIComponent(p.colecao)}">${p.colecao}</a>`} / ${p.tipo}</div>
          <h1>${esc(p.titulo)}</h1>
          <div class="produto-preco">${eur(p.preco)}</div>
          <div class="edicao-caixa">
            <div class="linha1"><span class="rotulo" style="font-size:.66rem">${tiragemTxt(p)}</span>${pontos(p)}</div>
            <small>${p.edicao === 1 ? (p.disponiveis ? `A réplica de opala foi modelada à mão em cerâmica plástica e não se repete: não há segunda edição. Segue com certificado assinado.` : `Esta peça única já encontrou dona. Pergunte-nos por uma réplica por medida.`) : p.disponiveis ? `Receberá o exemplar <strong>n.º ${numero}/${p.edicao}</strong>, gravado e acompanhado de certificado assinado.` : `Todos os ${p.edicao} exemplares encontraram dona. Inscreva-se para saber da próxima tiragem.`}</small>
          </div>
          <p class="produto-desc">${esc(p.descricao)}</p>
          ${tams}
          ${p.disponiveis
            ? `<button class="btn btn-cheio" data-acao="adicionar" data-handle="${p.handle}">Adicionar ao pacote</button>`
            : `<a class="btn btn-cheio" href="#/" data-acao="lista-espera" style="text-align:center">Entrar na lista de espera</a>`}
          ${p.efeito ? `<div class="ficha-pedra"><span class="rotulo" style="font-size:.66rem">Réplica de opala</span><dl>
            <dt>Material</dt><dd>Réplica em cerâmica plástica, modelada à mão</dd><dt>Inspiração</dt><dd>Opala favo de mel de Welo, Etiópia</dd><dt>Padrão</dt><dd>${esc(p.efeito.padrao)}</dd>
            <dt>Tons</dt><dd>${esc(p.efeito.tons)}</dd><dt>Forma</dt><dd>${esc(p.efeito.forma)}</dd><dt>Medidas</dt><dd>${esc(p.efeito.medidas)}</dd></dl>
            <p class="ficha-nota">Réplica: esta peça não contém opala natural.</p>
            <a href="#/opala" class="ficha-link">Cuidados com a peça →</a></div>` : ""}
          <ul class="detalhes">${p.detalhes.map((d) => `<li>${esc(d)}</li>`).join("")}<li>${esc(p.material)}</li></ul>
          <div class="garantias"><span>✦ Feito à mão no Alto Minho</span><span>✦ Certificado de autenticidade</span><span>✦ Envio gratuito em Portugal</span><span>✦ Embalagem em linho natural</span>${p.efeito ? `<span>✦ Réplica de opala feita à mão</span>` : ""}</div>
        </div>
      </section>
    </div>
    ${rel.length ? `<section class="relacionados envolvente"><div class="seccao-cab"><h2 class="titulo" style="font-size:2rem">Do mesmo <em>troço do rio</em></h2></div><div class="grelha">${rel.map(cartao).join("")}</div></section>` : ""}`;
  }

  function paginaAtelier() {
    return blocoAtelier(true) + `<section class="seccao envolvente">${blocoCertificado()}</section>` + blocoNewsletter();
  }

  /* ---------------- router ---------------- */
  let rotaAnterior = "";
  function render() {
    const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const [r, arg] = hash.split("/");
    if (hash !== rotaAnterior) { fotoAtiva = 0; tamanho = null; }
    const mudou = hash !== rotaAnterior;
    rotaAnterior = hash;
    let html;
    if (r === "loja") html = paginaLoja(arg);
    else if (r === "colecoes") html = paginaColecoes();
    else if (r === "colecao") html = paginaColecoes(arg);
    else if (r === "p") html = paginaProduto(arg);
    else if (r === "atelier") html = paginaAtelier();
    else if (r === "opala") html = paginaOpala();
    else html = paginaInicio();
    const y = scrollY;
    app.innerHTML = html;
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("ativo", a.getAttribute("href") === "#/" + (r || "")));
    document.body.classList.remove("menu-aberto");
    if (mudou) scrollTo(0, 0); else scrollTo(0, y);
    observar(!mudou);
  }

  /* animações de entrada */
  let obs;
  function observar(imediato) {
    const els = document.querySelectorAll(".surgir");
    if (imediato || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("visivel")); return; }
    obs?.disconnect();
    obs = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visivel"); obs.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((e) => obs.observe(e));
  }

  /* ---------------- saco ---------------- */
  let saco = ls.get("jusante-saco", []);
  function guardarSaco() { ls.set("jusante-saco", saco); desenharSaco(); }
  function desenharSaco() {
    const n = saco.reduce((s, i) => s + i.q, 0);
    document.querySelector(".saco-n").textContent = n;
    const box = document.querySelector(".saco-itens");
    if (!saco.length) box.innerHTML = `<div class="saco-vazio">O seu pacote está vazio.<br><br><a class="btn" href="#/loja" data-acao="fechar-saco">Ver as peças</a></div>`;
    else box.innerHTML = saco.map((it, i) => {
      const p = porHandle(it.handle); if (!p) return "";
      return `<div class="saco-item">${slot(p.handle, { hover: false, rotulo: "" })}
        <div><h4>${esc(p.titulo)}</h4><small>${esc(p.material)}${it.tam ? " · Tam. " + it.tam : ""}</small><small>Exemplar de tiragem ${p.edicao} · qtd. ${it.q}</small><button data-remover="${i}">Remover</button></div>
        <strong style="font-family:var(--serif);font-weight:500">${eur(p.preco * it.q)}</strong></div>`;
    }).join("");
    const total = saco.reduce((s, i) => s + (porHandle(i.handle)?.preco || 0) * i.q, 0);
    document.querySelector(".saco-total strong").textContent = eur(total);
    document.querySelector('[data-acao="checkout"]').disabled = !saco.length;
  }
  function adicionarAoSaco(h) {
    const p = porHandle(h);
    if (p.tamanhos.length && !tamanho) { toast("Escolha um tamanho"); return; }
    const ja = saco.filter((i) => i.handle === h).reduce((s, i) => s + i.q, 0);
    if (ja >= p.disponiveis) { toast(`Só existem ${p.disponiveis} exemplar(es) disponíveis`); return; }
    const ex = saco.find((i) => i.handle === h && i.tam === tamanho);
    ex ? ex.q++ : saco.push({ handle: h, tam: tamanho, q: 1 });
    guardarSaco();
    document.body.classList.add("saco-aberto");
  }

  /* ---------------- toast ---------------- */
  let tt;
  function toast(m) {
    const t = document.querySelector(".toast");
    t.textContent = m; t.classList.add("mostrar");
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("mostrar"), 2200);
  }

  /* ---------------- eventos ---------------- */
  document.addEventListener("click", (e) => {
    const alvoFoto = e.target.closest(".foto-alvo");
    if (alvoFoto && cfg.modo) {
      e.preventDefault(); e.stopPropagation();
      const s = alvoFoto.closest(".foto-slot");
      if (e.target.closest('[data-acao-foto="remover"]')) return removerFoto(s.dataset.slot, +s.dataset.idx);
      alvoFoto.querySelector("input").click();
      return;
    }
    const mini = e.target.closest("[data-mini]");
    if (mini) { fotoAtiva = +mini.dataset.mini; render(); return; }
    const tam = e.target.closest("[data-tam]");
    if (tam) { tamanho = tam.dataset.tam; render(); return; }
    const filtro = e.target.closest("[data-filtro]");
    if (filtro) { location.hash = "#/loja/" + encodeURIComponent(filtro.dataset.filtro); return; }
    const rem = e.target.closest("[data-remover]");
    if (rem) { saco.splice(+rem.dataset.remover, 1); guardarSaco(); return; }

    const a = e.target.closest("[data-acao]");
    if (!a) return;
    switch (a.dataset.acao) {
      case "abrir-saco": document.body.classList.add("saco-aberto"); break;
      case "fechar-saco": document.body.classList.remove("saco-aberto"); break;
      case "menu": document.body.classList.toggle("menu-aberto"); break;
      case "adicionar": adicionarAoSaco(a.dataset.handle); break;
      case "checkout": toast("O checkout ficará ativo quando a loja estiver no Shopify"); break;
      case "lista-espera": {
        e.preventDefault();
        const inp = document.querySelector(".newsletter input");
        if (inp) inp.focus(); else { location.hash = "#/atelier"; setTimeout(() => { const i = document.querySelector(".newsletter input"); i?.scrollIntoView({ block: "center" }); i?.focus(); }, 80); }
        break;
      }
      case "modo-fotos": cfg.modo = !cfg.modo; aplicarCfg(); render(); toast(cfg.modo ? "Modo fotos ativo — arraste imagens para as peças" : "Modo fotos desligado"); break;
      case "limpar-fotos": if (confirm("Apagar todas as fotos de teste guardadas neste navegador?")) limparTudo(); break;
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.matches(".foto-alvo input")) {
      const s = e.target.closest(".foto-slot");
      const subst = s.dataset.modo === "substituir" && fotosDe(s.dataset.slot)[+s.dataset.idx] ? +s.dataset.idx : null;
      adicionarFotos(s.dataset.slot, [...e.target.files], subst);
    }
    if (e.target.matches("[data-opcao]")) { cfg[e.target.dataset.opcao] = e.target.value; aplicarCfg(); render(); }
  });

  document.addEventListener("submit", (e) => {
    if (e.target.matches('[data-acao="newsletter"]')) { e.preventDefault(); e.target.reset(); toast("Obrigada! Será avisada da próxima tiragem."); }
  });

  /* arrastar e largar */
  ["dragenter", "dragover"].forEach((ev) => document.addEventListener(ev, (e) => {
    const s = e.target.closest?.(".foto-slot");
    if (!s || !e.dataTransfer?.types?.includes("Files")) return;
    e.preventDefault();
    if (!cfg.modo) { cfg.modo = true; aplicarCfg(); }
    s.querySelector(".foto-alvo")?.classList.add("arrastar");
  }));
  document.addEventListener("dragleave", (e) => e.target.closest?.(".foto-alvo")?.classList.remove("arrastar"));
  document.addEventListener("drop", (e) => {
    const s = e.target.closest?.(".foto-slot");
    if (!s) return;
    e.preventDefault();
    const subst = s.dataset.modo === "substituir" && fotosDe(s.dataset.slot)[+s.dataset.idx] ? +s.dataset.idx : null;
    adicionarFotos(s.dataset.slot, [...e.dataTransfer.files], subst);
  });
  window.addEventListener("dragover", (e) => e.preventDefault());
  window.addEventListener("drop", (e) => e.preventDefault());

  addEventListener("scroll", () => document.querySelector(".topo").classList.toggle("compacto", scrollY > 60), { passive: true });
  addEventListener("hashchange", render);
  addEventListener("keydown", (e) => { if (e.key === "Escape") document.body.classList.remove("saco-aberto"); });

  document.getElementById("ano").textContent = new Date().getFullYear();

  /* arranque */
  aplicarCfg();
  abrirDB().then(carregarTodas).then(() => { render(); desenharSaco(); });
})();
