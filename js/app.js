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

  const aVenda = (p) => !p.vendida;
  function pontos(p) {
    return `<span class="pontos" aria-hidden="true"><i class="${aVenda(p) ? "cheio" : ""}"></i></span>`;
  }
  function tiragemTxt(p) {
    return aVenda(p) ? `Peça única · ${esc(p.colecao)}` : "Peça única · vendida";
  }
  function cartao(p) {
    const selo = aVenda(p) ? "" : `<span class="selo esgotado">Vendida</span>`;
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
  /* Estrutura da home segundo o Brand Bible (9.1):
     hero · manifesto · coleções · gesto artesanal · frase de respiro · Atlas · newsletter */
  const LINHA = `<svg class="marca-linha" viewBox="0 0 160 14" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true"><path d="M2 9 H58 C66 9, 68 4, 74 4 C78 4, 79 7, 77.5 9"/><path d="M83 9 C 86 12, 92 11, 96 9 H158"/></svg>`;

  function paginaInicio() {
    const destaque = P.filter((p) => aVenda(p) && !p.especialidade).slice(0, 4);
    return `
    <section class="hero">
      <div class="hero-texto">
        <span class="rotulo">Rio Minho / Miño · Portugal e Galiza</span>
        <h1>Peças que guardam <em>movimento, memória</em> e caminho.</h1>
        <p>Nascidas da observação do Rio Minho / Miño e do encontro entre Portugal e a Galiza. Esculpidas à mão livre em cerâmica plástica, sem moldes: as coleções repetem-se, as peças nunca.</p>
        <div class="hero-acoes"><a class="btn" href="#/loja">Ver as peças</a><a class="btn" href="#/atelier" style="border-color:transparent">Da matéria à forma →</a></div>
      </div>
      <div class="hero-imagem">${slot("hero", { rotulo: "Imagem principal", hover: false, formato: "auto" })}
        <span class="hero-numero">Coleção Poente</span></div>
      <img class="hero-ornamento" src="${SIMBOLO}" alt="">
    </section>

    <section class="manifesto surgir">
      <img class="divisor" src="${SIMBOLO}" alt="">
      <p class="manifesto-versos"><span>O rio que segue.</span><span>A luz que transforma.</span><span>A natureza que ensina.</span></p>
      <p class="nome-def"><strong>Jusante</strong> é a direção do curso da água: o movimento que segue, desce, transforma e encontra novos lugares.</p>
    </section>

    ${blocoAssinatura()}

    <section class="seccao envolvente">
      <div class="seccao-cab"><div><span class="rotulo">Coleções</span><h2 class="titulo">Poente, Corrente, <em>Margem</em></h2></div><a class="btn" href="#/colecoes">Ver coleções</a></div>
      ${blocoColecoes()}
    </section>

    <section class="seccao envolvente" style="padding-top:0">
      <div class="seccao-cab"><div><span class="rotulo">Peças em percurso</span><h2 class="titulo">Disponíveis <em>agora</em></h2></div><a class="btn" href="#/loja">Todas as peças</a></div>
      <div class="grelha">${destaque.map(cartao).join("")}</div>
    </section>

    ${blocoAtelier()}
    ${blocoRespiro()}
    ${blocoOpala()}
    ${blocoAtlasTeaser()}
    ${blocoNewsletter()}`;
  }

  /* a assinatura formal (Brand Bible, 4) */
  function blocoAssinatura() {
    const ico = [
      `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M54 14 A28 28 0 0 0 54 66"/><path d="M66 22 A20 20 0 0 1 66 58"/></svg>`,
      `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M20 40 H50 C56 40, 57 33, 60 33"/><path d="M64 46 C 68 48, 74 40, 100 40"/></svg>`,
      `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="46" cy="40" r="20"/><path d="M70 28 C 86 26, 96 44, 80 56 C 74 60, 68 54, 70 48"/></svg>`
    ];
    return `<section class="assinatura-seccao">
      <div class="envolvente">
        <div class="assinatura-cab surgir">
          <span class="rotulo ouro">A assinatura</span>
          <h2 class="titulo" style="margin-top:12px">Duas partes. <em>Uma fenda.</em></h2>
          <p>Cada peça Jusante nasce de duas formas que diferem, mas pertencem uma à outra, separadas por uma abertura: a fenda do rio.</p>
        </div>
        <div class="regras">
          <div class="regra surgir">${ico[0]}<h4>Duas partes</h4><p>Duas formas, volumes, superfícies ou semicírculos em diálogo.</p></div>
          <div class="regra surgir">${ico[1]}<h4>A fenda do rio</h4><p>Uma divisão: abertura, intervalo, linha negativa ou mudança de matéria.</p></div>
          <div class="regra surgir">${ico[2]}<h4>Sem simetria</h4><p>As partes não são espelhadas. Diferem, como as duas margens do mesmo rio.</p></div>
        </div>
      </div>
    </section>`;
  }

  function blocoRespiro() {
    return `<section class="respiro">
      <div class="surgir">
        <h2>Duas margens. <em>Uma corrente.</em></h2>
        <p>A natureza inspira. A arte interpreta. A alma contempla.</p>
        ${LINHA}
      </div>
    </section>`;
  }

  function blocoAtlasTeaser() {
    return `<section class="seccao envolvente">
      <div class="atlas-teaser">
        <div class="surgir">${slot("atlas:capa", { rotulo: "Foto do rio (sua)", hover: false, formato: "4/3", modo: "substituir" })}</div>
        <div class="surgir">
          <span class="rotulo ouro">Atlas da Jusante</span>
          <h2 class="titulo" style="margin-top:12px">Lugares que <em>inspiram</em></h2>
          <p>Caminhos à beira do rio, onde o tempo parece desacelerar e a natureza deixa pequenos sinais para quem sabe observar. Um diário de campo ao longo do Minho / Miño, nas duas margens.</p>
          <a class="btn" href="#/atlas" style="margin-top:26px">Abrir o Atlas</a>
        </div>
      </div>
    </section>`;
  }

  /* ---------------- especialidade: opala ---------------- */
  const OPALAS = () => P.filter((p) => p.especialidade === "opala");
  function blocoOpala() {
    const lista = OPALAS().filter(aVenda).slice(0, 3);
    return `<section class="opala-bloco">
      <div class="envolvente opala-grelha">
        <div class="surgir opala-foto">${slot("opala:destaque", { rotulo: "Opala favo de mel — detalhe", hover: false, formato: "4/5", modo: "substituir" })}${credito("opala:destaque")}</div>
        <div class="surgir">
          <span class="rotulo">Especialidade da casa</span>
          <h2 class="titulo" style="margin-top:14px"><span class="brilho">Opala</span> Favo de Mel<br><em>réplicas em cerâmica plástica</em></h2>
          <p>A inspiração é uma pedra que nasce da água e a guarda dentro de si: a opala de Welo, das rochas vulcânicas do norte da Etiópia, absorve a humidade e muda de aspeto com ela. O seu padrão favo de mel, em que a cor se acende em pequenos alvéolos, é o mais raro destas opalas.</p>
          <p>Nesta coleção não uso opala verdadeira: as peças levam <strong>réplicas em cerâmica plástica</strong>, feitas por mim à mão, camada a camada, até a cor ganhar a profundidade e os alvéolos da pedra. Cada efeito sai diferente, por isso todas as peças são únicas. Em algumas, a réplica aparece pela fenda, a assinatura da Jusante.</p>
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
          <div class="surgir"><b>i.</b><h4>A pedra que inspira</h4><p>A opala de Welo (Wollo) não é uma pedra de rio: forma-se na rocha vulcânica do planalto do norte da Etiópia, a partir de água rica em sílica. Guarda essa água dentro de si e muda de aspeto quando absorve humidade. É essa ligação à água que a traz para a Jusante.</p></div>
          <div class="surgir"><b>ii.</b><h4>O padrão favo de mel</h4><p>Pequenas células de cor que se acendem e apagam com o movimento, separadas por finas linhas. É o padrão mais raro da opala etíope, e é ele que procuro recriar.</p></div>
          <div class="surgir"><b>iii.</b><h4>Réplicas em cerâmica plástica</h4><p>Não uso opala natural. Cada réplica é modelada à mão em cerâmica plástica, camada a camada, até ganhar a profundidade e os alvéolos de cor da pedra. Nenhum efeito sai igual a outro.</p></div>
        </div>
      </section>

      <section class="envolvente" style="padding-bottom:clamp(60px,8vw,110px)">
        <div class="seccao-cab"><div><span class="rotulo ouro">Réplicas únicas em cerâmica plástica</span><h2 class="titulo">Cada réplica, <em>uma só joia</em></h2></div></div>
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
            <li>Tire a joia antes de tomar banho, nadar ou fazer desporto.</li>
            <li>Evite perfumes, álcool, acetona e produtos de limpeza: podem tirar o brilho ao acabamento.</li>
            <li>Não deixe a peça ao sol forte nem junto de fontes de calor, como o tablier do carro.</li>
            <li>Limpe só com um pano macio, seco ou ligeiramente húmido.</li>
            <li>Guarde-a na bolsa de linho, separada de outras joias, para não riscar.</li>
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
          <div class="surgir">${slot("atelier", { rotulo: "As suas mãos, as ferramentas, a bancada", hover: false, formato: "4/5", modo: "substituir" })}</div>
          <div class="surgir">
            <span class="rotulo">O gesto artesanal</span>
            <h2 class="titulo" style="margin-top:14px">Da matéria à forma. <em>Do desenho à joia.</em></h2>
            <p>Cada peça começa num caderno de campo: uma pedra, a linha de uma margem, a luz ao fim da tarde. Depois é esculpida à mão livre em cerâmica plástica, com lâminas e ferramentas de escultura. Sem moldes e sem cortadores.</p>
            <p>As coleções e as inspirações repetem-se, mas nenhuma peça sai igual a outra. A matéria guarda o gesto: pequenas diferenças de textura, de cor e de forma fazem parte de cada peça.</p>
            ${completo ? `<p>Aceito um número muito limitado de encomendas por medida: presentes, peças a pares e variações de cor das peças da loja. Escreva para <span style="color:var(--ouro)">ola@jusante.pt</span>.</p>` : ""}
          </div>
        </div>
        <div class="processo">
          <div><b>i.</b><h4>Observação</h4><p>Cores, matérias e formas recolhidas nas duas margens do Minho / Miño.</p></div>
          <div><b>ii.</b><h4>Escultura</h4><p>À mão livre, com lâminas e ferramentas de escultura. A forma nasce na hora.</p></div>
          <div><b>iii.</b><h4>Montagem</h4><p>Acabamento à mão e montagem em aço inoxidável e aço cirúrgico, que não escurecem.</p></div>
          <div><b>iv.</b><h4>Assinatura</h4><p>Cada peça é fotografada e assinada, e segue com certificado de autenticidade.</p></div>
        </div>
      </div>
    </section>`;
  }

  function blocoCertificado() {
    return `<div class="certificado surgir">
      <img src="${SIMBOLO}" alt="">
      <div>
        <span class="rotulo ouro">Certificado de autenticidade</span>
        <h3 class="titulo" style="font-size:2rem;margin-top:10px">Esculpida, assinada, <em>única</em>.</h3>
        <p>Todas as peças seguem com certificado assinado pela autora, com a fotografia da própria peça, os materiais e a data de criação. Pode haver outras peças com a mesma inspiração, mas nunca esta.</p>
      </div>
    </div>`;
  }

  function blocoNewsletter() {
    return `<section class="newsletter seccao">
      <div class="envolvente surgir">
        <span class="rotulo ouro">Acompanhe o curso</span>
        <h2 class="titulo" style="margin-top:12px">Novas peças, histórias e <em>pequenos fragmentos</em> da natureza.</h2>
        <p>Como cada peça é única, quando é vendida não volta. Quem acompanha o curso vê as peças novas 48 horas antes da loja.</p>
        <form data-acao="newsletter"><input type="email" placeholder="O seu email" aria-label="O seu email" autocomplete="email" required><button>Acompanhar</button></form>
      </div>
    </section>`;
  }

  /* Atlas da Jusante: diário de campo (Brand Bible 3.4 e 8.3).
     Regra de rigor: não apresentar "os afluentes" como inventário científico. */
  function paginaAtlas() {
    const caps = [1, 2, 3].map((n) => `<article class="capitulo surgir">
        ${slot("atlas:" + n, { rotulo: "Foto do lugar (sua)", hover: false, formato: "4/5", modo: "substituir" })}
        <small>Capítulo ${["I", "II", "III"][n - 1]}</small>
        <h3>Em preparação</h3>
        <p>Lugar, estação, cores observadas, matérias encontradas e as peças que nasceram daqui.</p>
      </article>`).join("");
    return `<section class="loja-cab">
        <img class="divisor" src="${SIMBOLO}" alt="">
        <span class="rotulo ouro">Atlas da Jusante</span>
        <h1 class="titulo" style="margin-top:10px">Lugares que <em>inspiram</em></h1>
        <p>Um diário de campo ao longo do Rio Minho / Miño: da nascente na Galiza à foz atlântica, passando pelo troço onde as duas margens se encontram.</p>
      </section>
      <section class="seccao envolvente" style="padding-top:20px">
        <div class="margens surgir">
          <div class="lado"><span class="rotulo ouro">Margem portuguesa</span><h3>Minho</h3><p>Luz, granito, socalcos e pequenas vilas debruçadas sobre a água.</p></div>
          <div class="fenda" aria-hidden="true"></div>
          <div class="lado"><span class="rotulo ouro">Margem galega</span><h3>Miño</h3><p>Musgo, sombra, folhas verdes e a outra metade da mesma paisagem.</p></div>
        </div>
        <p class="rotulo" style="text-align:center;margin-top:40px;color:var(--cinza)">Duas margens. Uma corrente.</p>
      </section>
      <section class="envolvente" style="padding-bottom:clamp(60px,8vw,110px)">
        <div class="seccao-cab"><div><span class="rotulo ouro">Capítulos</span><h2 class="titulo">O <em>diário</em> do rio</h2></div></div>
        <div class="atlas-capitulos">${caps}</div>
        <p class="atlas-nota" style="margin-top:40px">Os capítulos do Atlas são uma seleção editorial de lugares e afluentes que inspiram a Jusante, e não um inventário geográfico completo do rio.</p>
      </section>
      ${blocoNewsletter()}`;
  }

  function paginaLoja(filtro) {
    const tipos = ["Todas", ...new Set(P.map((p) => p.tipo)), "Opala"];
    const f = filtro || "Todas";
    const lista = (f === "Todas" ? P : P.filter((p) => p.tipo === f || p.colecao === f)).slice().sort((a, b) => a.vendida - b.vendida);
    return `<section class="loja-cab">
        <img class="divisor" src="${SIMBOLO}" alt="">
        <h1 class="titulo">As <em>peças</em></h1>
        <p>Cada peça é esculpida à mão livre e é única: a fotografia mostra a peça exata que vai receber. As peças vendidas ficam aqui como arquivo.</p>
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
        <h1 class="colecao-titulo">${esc(nome)}</h1>
        <p>${esc(c?.texto || "")}</p></section>
        <div class="envolvente"><div class="grelha" style="padding-bottom:110px">${lista.map(cartao).join("")}</div></div>`;
    }
    return `<section class="loja-cab"><img class="divisor" src="${SIMBOLO}" alt=""><h1 class="titulo">As <em>coleções</em></h1>
      <p>Três coleções permanentes, três maneiras de olhar o mesmo rio. As peças de cada coleção partilham a paleta e a inspiração, mas nenhuma é igual a outra.</p></section>
      <section class="envolvente" style="padding-bottom:110px">${blocoColecoes()}</section>`;
  }

  let fotoAtiva = 0, tamanho = null;
  function paginaProduto(h) {
    const p = porHandle(h);
    if (!p) return `<section class="loja-cab"><h1 class="titulo">Peça não encontrada</h1><p><a class="btn" href="#/loja">Voltar à loja</a></p></section>`;
    const fotos = fotosDe(h);
    if (fotoAtiva >= Math.max(fotos.length, 1)) fotoAtiva = 0;
    const rel = P.filter((x) => x.handle !== h && (x.colecao === p.colecao || x.tipo === p.tipo)).slice(0, 4);
    const tams = p.tamanho
      ? `<div class="tamanho-fixo"><span class="rotulo" style="font-size:.82rem">Tamanho</span> <strong>${esc(p.tamanho)}</strong> <small>Peça única, só existe neste tamanho.</small></div>`
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
            <div class="linha1"><span class="rotulo" style="font-size:.82rem">${tiragemTxt(p)}</span>${pontos(p)}</div>
            <small>${aVenda(p)
              ? (p.efeito
                ? `A réplica de opala foi esculpida à mão em cerâmica plástica: esta é a peça exata da fotografia, e não há outra igual. Segue com certificado assinado.`
                : `Esculpida à mão livre: esta é a peça exata da fotografia. Outras peças da coleção ${esc(p.colecao)} terão a mesma inspiração, mas nunca serão iguais. Segue com certificado assinado.`)
              : `Esta peça já encontrou dona. Veja outras peças da coleção ${esc(p.colecao)}, ou peça-nos uma por medida.`}</small>
          </div>
          <p class="produto-desc">${esc(p.descricao)}</p>
          ${p.codigo ? `<p class="produto-codigo">Código da peça: <strong>${esc(p.codigo)}</strong> · <a href="#/certificado/${encodeURIComponent(p.codigo)}">ver certificado</a></p>` : ""}
          ${tams}
          ${aVenda(p)
            ? `<button class="btn btn-cheio" data-acao="adicionar" data-handle="${p.handle}">Adicionar ao pacote</button>`
            : `<a class="btn btn-cheio" href="#/" data-acao="lista-espera" style="text-align:center">Entrar na lista de espera</a>`}
          ${p.efeito ? `<div class="ficha-pedra"><span class="rotulo" style="font-size:.82rem">Réplica de opala</span><dl>
            <dt>Material</dt><dd>Réplica em cerâmica plástica, modelada à mão</dd><dt>Inspiração</dt><dd>Opala favo de mel de Welo, Etiópia</dd><dt>Padrão</dt><dd>${esc(p.efeito.padrao)}</dd>
            <dt>Tons</dt><dd>${esc(p.efeito.tons)}</dd><dt>Forma</dt><dd>${esc(p.efeito.forma)}</dd><dt>Medidas</dt><dd>${esc(p.efeito.medidas)}</dd></dl>
            <p class="ficha-nota">Réplica: esta peça não contém opala natural.</p>
            <a href="#/opala" class="ficha-link">Cuidados com a peça →</a></div>` : ""}
          <ul class="detalhes">${p.detalhes.map((d) => `<li>${esc(d)}</li>`).join("")}<li>${esc(p.material)}</li></ul>
          <div class="garantias"><span>✦ Esculpida à mão livre</span><span>✦ Certificado de autenticidade</span><span>✦ Envio gratuito em Portugal</span><span>✦ Embalagem em linho natural</span>${p.efeito ? `<span>✦ Réplica de opala feita à mão</span>` : ""}</div>
        </div>
      </section>
    </div>
    ${rel.length ? `<section class="relacionados envolvente"><div class="seccao-cab"><h2 class="titulo" style="font-size:2rem">Do mesmo <em>troço do rio</em></h2></div><div class="grelha">${rel.map(cartao).join("")}</div></section>` : ""}`;
  }

  /* ---------------- certificado e verificação online ----------------
     Registo artístico do atelier: confirma autoria e identidade da peça.
     Não é avaliação de valor nem certificação gemológica. */
  const porCodigo = (c) => P.find((p) => (p.codigo || "").toUpperCase() === String(c || "").trim().toUpperCase().replace(/\s+/g, ""));
  const urlCertificado = (p) => location.href.split("#")[0] + "#/certificado/" + encodeURIComponent(p.codigo);

  function qrSVG(texto) {
    if (typeof qrcode !== "function") return "";
    try {
      const q = qrcode(0, "M"); q.addData(texto); q.make();
      return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true, alt: "QR code para verificar este certificado" });
    } catch { return ""; }
  }

  function paginaCertificado(codigo) {
    const p = porCodigo(codigo);
    if (!p) {
      return `<section class="loja-cab">
        <img class="divisor" src="${SIMBOLO}" alt="">
        <h1 class="titulo">Código <em>não encontrado</em></h1>
        <p>Não encontrámos nenhuma peça com o código <strong>${esc(codigo || "")}</strong>. Confirme o código impresso no certificado, ou escreva para ola@jusante.pt.</p>
        <p style="margin-top:26px"><a class="btn" href="#/verificar">Tentar outro código</a></p>
      </section>`;
    }
    const url = urlCertificado(p);
    const mat = p.efeito ? `${esc(p.material)}. Réplica: não contém opala natural.` : esc(p.material);
    return `<section class="cert-pagina envolvente">
      <div class="cert-confirma" role="status">✓ Peça registada pelo atelier Jusante</div>
      <article class="cert">
        <header class="cert-cab">
          <img src="${SIMBOLO}" alt="">
          <span class="rotulo ouro">Certificado de autenticidade</span>
          <span class="cert-marca">Jusante</span>
        </header>
        <div class="cert-corpo">
          <div class="cert-foto">${slot(p.handle, { hover: false, rotulo: p.titulo })}</div>
          <dl class="cert-dados">
            <dt>Código</dt><dd class="cert-codigo">${esc(p.codigo)}</dd>
            <dt>Peça</dt><dd>${esc(p.titulo)}</dd>
            <dt>Coleção</dt><dd>${p.especialidade ? "Opala favo de mel" : esc(p.colecao)}</dd>
            <dt>Materiais</dt><dd>${mat}</dd>
            ${p.tamanho ? `<dt>Tamanho</dt><dd>${esc(p.tamanho)}</dd>` : ""}
            <dt>Criada em</dt><dd>${esc(p.criada || "")}</dd>
            <dt>Técnica</dt><dd>Esculpida à mão livre, sem moldes. Peça única.</dd>
          </dl>
        </div>
        <p class="cert-texto">Esta peça foi esculpida à mão no atelier Jusante e não existe outra igual. A fotografia acima é a da própria peça.</p>
        <footer class="cert-pe">
          <div class="cert-assinatura"><span>Jusante</span><small>Assinatura da autora</small></div>
          <div class="cert-qr">${qrSVG(url)}<small>Verificar em<br>${esc(url.replace(/^https?:\/\//, ""))}</small></div>
        </footer>
        <p class="cert-nota">Registo artístico do atelier Jusante. Confirma a autoria e a identidade desta peça; não é uma avaliação de valor nem uma certificação gemológica.</p>
      </article>
      <div class="cert-acoes">
        <button class="btn btn-cheio" data-acao="imprimir">Imprimir certificado</button>
        <a class="btn" href="#/p/${p.handle}">Ver a peça</a>
      </div>
    </section>`;
  }

  function paginaVerificar() {
    return `<section class="loja-cab">
        <img class="divisor" src="${SIMBOLO}" alt="">
        <span class="rotulo ouro">Certificado de autenticidade</span>
        <h1 class="titulo" style="margin-top:10px">Verificar uma <em>peça</em></h1>
        <p>Cada peça Jusante tem um código único, impresso no certificado (por exemplo, JUS-PO-26-001). Escreva-o abaixo, ou leia o QR code do certificado com a câmara do telemóvel.</p>
        <form class="verificar-form" data-acao="verificar">
          <label for="codigo-peca" class="rotulo">Código da peça</label>
          <div><input id="codigo-peca" name="codigo" autocomplete="off" spellcheck="false" placeholder="JUS-PO-26-001" required><button class="btn btn-cheio">Verificar</button></div>
        </form>
      </section>`;
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
    else if (r === "atlas") html = paginaAtlas();
    else if (r === "certificado") html = paginaCertificado(arg);
    else if (r === "verificar") html = paginaVerificar();
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
        <div><h4>${esc(p.titulo)}</h4><small>${esc(p.material)}${it.tam ? " · Tam. " + it.tam : ""}</small><small>Peça única</small><button data-remover="${i}">Remover</button></div>
        <strong style="font-family:var(--serif);font-weight:500">${eur(p.preco * it.q)}</strong></div>`;
    }).join("");
    const total = saco.reduce((s, i) => s + (porHandle(i.handle)?.preco || 0) * i.q, 0);
    document.querySelector(".saco-total strong").textContent = eur(total);
    document.querySelector('[data-acao="checkout"]').disabled = !saco.length;
  }
  function adicionarAoSaco(h) {
    const p = porHandle(h);
    const ja = saco.some((i) => i.handle === h);
    if (!aVenda(p) || ja) { toast(ja ? "Esta peça única já está no seu pacote" : "Esta peça já foi vendida"); return; }
    saco.push({ handle: h, tam: p.tamanho || null, q: 1 });
    guardarSaco();
    document.body.classList.add("saco-aberto");
  }

  /* ---------------- opções de leitura ---------------- */
  const leitura = Object.assign({ grande: false, contraste: false }, ls.get("jusante-leitura", {}));
  function aplicarLeitura() {
    document.documentElement.classList.toggle("letra-grande", leitura.grande);
    document.documentElement.classList.toggle("alto-contraste", leitura.contraste);
    document.querySelectorAll("[data-leitura]").forEach((b) => b.setAttribute("aria-pressed", !!leitura[b.dataset.leitura]));
    ls.set("jusante-leitura", leitura);
  }
  function alternarLeitura(k) {
    leitura[k] = !leitura[k]; aplicarLeitura();
    toast(k === "grande" ? (leitura.grande ? "Letra maior ligada" : "Letra normal") : (leitura.contraste ? "Alto contraste ligado" : "Contraste normal"));
  }
  function fecharLeitura() {
    const p = document.getElementById("leitura-painel");
    if (p?.classList.contains("aberto")) { p.classList.remove("aberto"); document.querySelector(".leitura-btn")?.setAttribute("aria-expanded", "false"); }
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
    const op = e.target.closest("[data-leitura]");
    if (op) { alternarLeitura(op.dataset.leitura); return; }
    if (!e.target.closest(".leitura-painel, .leitura-btn")) fecharLeitura();
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
      case "menu": document.body.classList.toggle("menu-aberto"); a.setAttribute("aria-expanded", document.body.classList.contains("menu-aberto")); break;
      case "leitura": {
        const painel = document.getElementById("leitura-painel");
        const aberto = painel.classList.toggle("aberto");
        a.setAttribute("aria-expanded", aberto);
        if (aberto) painel.querySelector("button").focus();
        break;
      }
      case "adicionar": adicionarAoSaco(a.dataset.handle); break;
      case "imprimir": window.print(); break;
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
    if (e.target.matches('[data-acao="verificar"]')) {
      e.preventDefault();
      const c = e.target.codigo.value.trim().toUpperCase().replace(/\s+/g, "");
      location.hash = "#/certificado/" + encodeURIComponent(c);
      return;
    }
    if (e.target.matches('[data-acao="newsletter"]')) { e.preventDefault(); e.target.reset(); toast("Obrigada! Será avisada das peças novas."); }
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
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") { document.body.classList.remove("saco-aberto"); fecharLeitura(); }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-mini]")) { e.preventDefault(); e.target.click(); }
  });

  document.getElementById("ano").textContent = new Date().getFullYear();

  /* arranque */
  aplicarCfg();
  aplicarLeitura();
  abrirDB().then(carregarTodas).then(() => { render(); desenharSaco(); });
})();
