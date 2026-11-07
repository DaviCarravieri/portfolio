// ===== SITE: idioma, seções geradas, animações de rolagem =====
(() => {
  const T = window.TEXTOS, L = window.LINKS || {};
  const $ = s => document.querySelector(s);
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- idioma ----------
  let idioma = 'pt';
  try { idioma = localStorage.getItem('idioma') || (navigator.language || 'pt').slice(0, 2); } catch (e) {}
  if (!T[idioma]) idioma = 'pt';

  const pegar = (obj, chave) => chave.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  // projetos em inglês herdam fotos e links do português
  const projetos = () => T.pt.projetos.map((p, i) => ({...p, ...(T[idioma].projetos[i] || {})}));

  function aplicarIdioma() {
    const t = T[idioma];
    document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : 'en';
    document.title = t.titulo_pagina;
    document.querySelectorAll('[data-t]').forEach(el => {
      const v = pegar(t, el.dataset.t);
      if (v != null) el.textContent = v;
      if (el.dataset.tLabel) el.setAttribute('aria-label', pegar(t, el.dataset.tLabel));
    });
    titulo.montar(); montarServicos(); montarProjetos(); montarContato(); letras.preparar(); faixas.montar();
    observarFades();
  }

  // ---------- título da abertura: letras "pintadas com spray" ----------
  // Cada letra entra borrada e grande, como um jato de tinta assentando na parede.
  // Depois, as letras perto do cursor sobem e giram um pouquinho.
  const titulo = {
    el: $('#heroTitulo'), spans: [],
    montar() {
      const texto = this.el.textContent;
      this.el.setAttribute('aria-label', texto);
      let i = 0;
      this.el.innerHTML = texto.split(' ').map(p => `<span class="palavra" aria-hidden="true">${[...p].map(c =>
        `<span class="lt" style="--i:${i++};--r:${((Math.random() - .5) * 24).toFixed(1)}deg">${c}</span>`).join('')}</span>`).join(' ');
      this.spans = [...this.el.querySelectorAll('.lt')];
      document.fonts.ready.then(() => this.kerning());
    },
    // Cada letra separada perde o ajuste fino de espaço da fonte (ex.: "AV" fica com um buraco no meio).
    // Mede cada par de letras junto e separado, e devolve a diferença como margem.
    kerning() {
      const cs = getComputedStyle(this.el), px = parseFloat(cs.fontSize), ctx = document.createElement('canvas').getContext('2d');
      ctx.font = `${cs.fontWeight} ${px}px ${cs.fontFamily}`;
      const w = s => ctx.measureText(s).width;
      this.el.querySelectorAll('.palavra').forEach(p => {
        const ls = [...p.querySelectorAll('.lt')];
        ls.forEach((s, i) => {
          const a = s.textContent.toUpperCase(), b = ls[i + 1] && ls[i + 1].textContent.toUpperCase();
          s.style.marginRight = b ? `${((w(a + b) - w(a) - w(b)) / px).toFixed(3)}em` : '';
        });
      });
    },
    mover(x, y) {
      this.spans.forEach(s => {
        const r = s.getBoundingClientRect(), d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
        const k = Math.max(0, 1 - d / 260);
        s.style.translate = `0 ${(-k * k * 22).toFixed(1)}px`;
        s.style.rotate = `${(k * k * (s.style.getPropertyValue('--r').startsWith('-') ? -6 : 6)).toFixed(1)}deg`;
      });
    },
    soltar() { this.spans.forEach(s => { s.style.translate = ''; s.style.rotate = ''; }); },
  };
  if (!reduzido && matchMedia('(pointer: fine)').matches) {
    const hero = $('#topo');
    hero.addEventListener('pointermove', e => titulo.mover(e.clientX, e.clientY));
    hero.addEventListener('pointerleave', () => titulo.soltar());
  }
  $('#idioma').addEventListener('click', () => {
    idioma = idioma === 'pt' ? 'en' : 'pt';
    try { localStorage.setItem('idioma', idioma); } catch (e) {}
    aplicarIdioma();
  });

  // ---------- aparecer ao entrar na tela ----------
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    {rootMargin: '50px', threshold: 0});
  function observarFades() {
    document.querySelectorAll('.fade:not(.in)').forEach(el => {
      if (el.dataset.delay) el.style.setProperty('--fd', el.dataset.delay + 's');
      if (el.dataset.y) el.style.setProperty('--fy', el.dataset.y + 'px');
      if (el.dataset.x) el.style.setProperty('--fx', el.dataset.x + 'px');
      io.observe(el);
    });
  }

  // ---------- serviços ----------
  // cada serviço aponta para os projetos onde ele aparece (etiquetas na cor do projeto)
  const corDe = p => `var(--${p.cor || 'azul'})`;
  function etiquetaProjeto(i) {
    const p = projetos()[i];
    return p ? `<a class="etiqueta-projeto" href="#projeto-${i}" data-projeto="${i}" style="--cor:${corDe(p)}">${p.nome}</a>` : '';
  }
  function montarServicos() {
    const t = T[idioma];
    $('#listaServicos').innerHTML = t.servicos.map(([nome, desc, ligados = []], i) => `
      <li class="servico fade" data-delay="${i * .1}">
        <span class="servico-num">${String(i + 1).padStart(2, '0')}</span>
        <div class="servico-texto">
          <h3 class="servico-nome">${nome}</h3><p class="servico-desc">${desc}</p>
          ${ligados.length ? `<p class="servico-ver"><span>${t.veja_em}</span>${ligados.map(etiquetaProjeto).join('')}</p>` : ''}
        </div>
      </li>`).join('');
  }

  // ---------- projetos (cartões que se empilham) ----------
  // Enquanto não há foto, o espaço mostra a cor do projeto em três tons.
  function foto(src, cls, alt) {
    return src ? `<div class="foto ${cls}"><img src="${src}" alt="${alt}" loading="lazy"></div>`
               : `<div class="foto ${cls} vazio">${T[idioma].foto_em_breve}</div>`;
  }
  function montarProjetos() {
    const t = T[idioma], lista = projetos();
    $('#cartoes').innerHTML = lista.map((p, i) => {
      const f = p.fotos || [];
      const botao = p.link ? `<a class="botao-fantasma" href="${p.link}" target="_blank" rel="noopener">${t.ver_projeto}</a>`
                           : `<span class="botao-fantasma" aria-disabled="true">${t.em_breve}</span>`;
      const tags = (p.tags || []).map(x => `<li>${x}</li>`).join('');
      return `<div class="cartao-caixa" id="projeto-${i}" style="--i:${i};--cor:${corDe(p)}"><article class="cartao">
        <div class="cartao-topo">
          <span class="cartao-num">${String(i + 1).padStart(2, '0')}</span>
          <div>
            <div class="cartao-tipo">${p.tipo}${p.destaque ? `<span class="selo">${t.destaque}</span>` : ''}</div>
            <h3 class="cartao-nome">${p.nome}</h3>
          </div>
          ${botao}
        </div>
        <div class="cartao-corpo">
          <div class="cartao-info">
            <p class="cartao-resumo${p.resumo ? '' : ' pendente'}">${p.resumo || t.resumo_em_breve}</p>
            ${p.papel ? `<p class="cartao-papel"><span>${t.meu_papel}</span>${p.papel}</p>` : ''}
            ${tags ? `<ul class="cartao-tags">${tags}</ul>` : ''}
          </div>
          <div class="cartao-fotos">
            <div class="cartao-col">${foto(f[0], 'a', p.nome)}${foto(f[1], 'b', p.nome)}</div>
            ${foto(f[2], 'c', p.nome)}
          </div>
        </div>
      </article></div>`;
    }).join('');
  }
  // rola até o cartão do projeto i. Os cartões são "grudentos" (sticky), então a conta é feita
  // com a posição normal deles na lista, e não com a posição em que aparecem grudados.
  function irParaProjeto(i) {
    const caixas = [...document.querySelectorAll('.cartao-caixa')], alvo = caixas[i];
    if (!alvo) return;
    const topoLista = $('#cartoes').getBoundingClientRect().top + scrollY;
    const antes = caixas.slice(0, i).reduce((s, c) => s + c.offsetHeight, 0);
    scrollTo({top: topoLista + antes - parseFloat(getComputedStyle(alvo).top) + 1, behavior: reduzido ? 'auto' : 'smooth'});
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-projeto]');
    if (a) { e.preventDefault(); irParaProjeto(+a.dataset.projeto); }
  });
  function empilhar() {
    const caixa = $('#cartoes'), cartoes = caixa.querySelectorAll('.cartao'), n = cartoes.length;
    if (!n) return;
    const r = caixa.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
    cartoes.forEach((c, i) => {
      const alvo = 1 - (n - 1 - i) * .03, inicio = i / n;
      const k = Math.min(1, Math.max(0, (p - inicio) / (1 - inicio)));
      c.style.transform = `scale(${1 - (1 - alvo) * k})`;
    });
  }

  // ---------- fotos dos cartões: a imagem desliza contra o cursor, como uma janela com profundidade ----------
  if (!reduzido && matchMedia('(pointer: fine)').matches) {
    const cartoes = $('#cartoes');
    cartoes.addEventListener('pointermove', e => {
      const f = e.target.closest('.foto'), img = f && f.querySelector('img');
      if (!img) return;
      const r = f.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
      img.style.transform = `scale(1.08) translate(${(-dx * 4).toFixed(2)}%, ${(-dy * 4).toFixed(2)}%)`;
    });
    cartoes.addEventListener('pointerout', e => {
      const f = e.target.closest('.foto');
      if (f && !f.contains(e.relatedTarget)) { const img = f.querySelector('img'); if (img) img.style.transform = ''; }
    });
  }

  // ---------- faixas de imagens: duas fileiras em 3D, estilo "cover flow" ----------
  // As cartas ficam de lado, bem juntas; a que passa pelo centro gira e fica de frente.
  // Arrastar uma fileira move a outra no sentido contrário. Ao soltar, ela desliza (inércia)
  // e para com uma carta de frente. Clicar numa carta a traz para o centro.
  const faixas = (() => {
    const linhas = [$('#faixa1'), $('#faixa2')].map(el => ({el, itens: [], cartas: [], pos: 0, vel: 0, alvo: null}));
    let W = 0, carta = 0, passo = 0, total = 0, arrasto = null, ultimo = performance.now(), visivel = false;
    const ANGULO = 72;                  // giro das cartas de lado (graus)

    // sem fotos ainda: cartas na cor de cada projeto, com o nome pequeno (só aparece na carta da frente)
    function itensDasFaixas() {
      const ps = projetos();
      const comProjeto = (it, j) => { const p = ps[j]; return p ? {...it, projeto: j, nome: p.nome, cor: corDe(p)} : it; };
      return (window.FAIXAS && window.FAIXAS.length)
        ? window.FAIXAS.map(f => typeof f === 'string' ? {src: f} : comProjeto({src: f.src}, f.projeto))
        : Array.from({length: 12}, (_, i) => comProjeto({}, i % ps.length));
    }
    // cada carta é uma placa com espessura: a face da frente e, atrás dela, camadas com o mesmo
    // formato (cantos arredondados) que, vistas de lado, formam a borda grossa da peça
    const CAMADAS = 7;
    const lados = Array.from({length: CAMADAS}, (_, i) =>
      `<i class="camada${i === CAMADAS - 1 ? ' fundo' : ''}" style="--k:${i + 1};--n:${CAMADAS}"></i>`).join('');
    const bloco = it => {
      const attrs = `${it.projeto != null ? ` data-ir="${it.projeto}"` : ''}${it.cor ? ` style="--cor:${it.cor}"` : ''}`;
      const rotulo = it.nome ? `<span class="rotulo">${it.nome}</span>` : '';
      return it.src ? `<div class="bloco"${attrs}><div class="face"><img src="${it.src}" alt="" loading="lazy" draggable="false">${rotulo}</div>${lados}</div>`
                    : `<div class="bloco vazio"${attrs}><div class="face">${rotulo}</div>${lados}</div>`;
    };

    function montar() {
      const itens = itensDasFaixas(), meio = Math.ceil(itens.length / 2);
      linhas[0].itens = itens.slice(0, meio);
      linhas[1].itens = itens.slice(meio).length ? itens.slice(meio) : itens.slice(0, meio);
      medir(true);
    }

    // mede a tela e recria as cartas: cada fileira repete os itens até cobrir a largura com folga
    function medir(recriar) {
      W = linhas[0].el.clientWidth;
      const amostra = linhas[0].el.querySelector('.bloco');
      carta = amostra ? amostra.offsetWidth : (W >= 768 ? 380 : 220);
      passo = carta * .27;              // distância entre cartas de lado (elas se sobrepõem)
      linhas.forEach(l => {
        const n = l.itens.length, copias = Math.max(1, Math.ceil((W + carta * 3) / (n * passo)));
        if (recriar || l.cartas.length !== n * copias) {
          l.el.innerHTML = Array.from({length: n * copias}, (_, j) => bloco(l.itens[j % n])).join('');
          l.cartas = [...l.el.querySelectorAll('.bloco')];
        }
        if (!l.iniciada) { l.pos = W / 2; l.iniciada = true; }
      });
      if (recriar && !linhas[0].medida) { linhas[0].medida = true; return medir(false); }   // mede de novo com a carta real
      total = linhas[0].cartas.length * passo;
      desenhar();
    }

    // posição do centro da carta j na tela, dando a volta quando sai por um lado
    function centro(l, j) {
      const T = l.cartas.length * passo, folga = carta * 1.5;
      return ((j * passo + l.pos + folga) % T + T) % T - folga;
    }
    const encaixe = p => W / 2 + Math.round((p - W / 2) / passo) * passo;

    function desenhar() {
      linhas.forEach(l => l.cartas.forEach((c, j) => {
        const d = centro(l, j) - W / 2, s = d / passo, t = Math.max(-1, Math.min(1, s));
        const x = d + t * carta * .5 + W / 2 - carta / 2;    // abre espaço ao redor da carta da frente
        c.style.transform = `translate3d(${x.toFixed(1)}px,0,${(-Math.abs(t) * carta * .45).toFixed(1)}px) rotateY(${(-t * ANGULO).toFixed(2)}deg)`;
        c.style.zIndex = 1000 - Math.round(Math.abs(s) * 10);
        c.style.setProperty('--s', (Math.abs(t) * .28).toFixed(3));   // as de lado ficam um pouco mais escuras
        c.classList.toggle('frente', Math.abs(s) < .5);
      }));
    }

    function passoAnim(agora) {
      requestAnimationFrame(passoAnim);
      const dt = Math.min(.05, (agora - ultimo) / 1000); ultimo = agora;
      if (!visivel) return;
      let mexeu = false;
      linhas.forEach(l => {
        if (arrasto) return;
        if (l.alvo != null) {
          l.pos += (l.alvo - l.pos) * (1 - Math.exp(-dt * 9));
          if (Math.abs(l.alvo - l.pos) < .3) { l.pos = l.alvo; l.alvo = null; }
          mexeu = true;
        } else if (Math.abs(l.vel) > 1) {
          l.pos += l.vel * dt; l.vel *= Math.exp(-dt * 3.2);
          if (Math.abs(l.vel) < 90) { l.vel = 0; l.alvo = encaixe(l.pos); }
          mexeu = true;
        }
      });
      if (mexeu || arrasto) desenhar();
    }

    // trazer a carta clicada para a frente; a outra fileira anda o mesmo tanto ao contrário
    function focar(l, j) {
      const outra = linhas[l === linhas[0] ? 1 : 0], delta = W / 2 - centro(l, j);
      l.vel = outra.vel = 0;
      l.alvo = encaixe(l.pos + delta);
      outra.alvo = encaixe(outra.pos - delta);
    }

    linhas.forEach((l, k) => {
      const outra = linhas[k ? 0 : 1];
      l.el.addEventListener('pointerdown', e => {
        if (e.button > 0) return;
        const c = e.target.closest('.bloco');
        arrasto = {l, outra, x0: e.clientX, p0: l.pos, o0: outra.pos, moveu: false, carta: c ? l.cartas.indexOf(c) : -1,
                   hist: [[e.clientX, performance.now()]], id: e.pointerId};
        l.alvo = outra.alvo = null; l.vel = outra.vel = 0;
      });
      l.el.addEventListener('pointermove', e => {
        if (!arrasto || arrasto.l !== l || e.pointerId !== arrasto.id) return;
        const dx = e.clientX - arrasto.x0;
        if (!arrasto.moveu && Math.abs(dx) > 6) {
          arrasto.moveu = true; l.el.classList.add('arrastando');
          try { l.el.setPointerCapture(e.pointerId); } catch (err) {}   // segue a mão mesmo fora da fileira
        }
        if (!arrasto.moveu) return;
        l.pos = arrasto.p0 + dx; outra.pos = arrasto.o0 - dx;
        arrasto.hist.push([e.clientX, performance.now()]); if (arrasto.hist.length > 6) arrasto.hist.shift();
      });
      const soltar = e => {
        if (!arrasto || arrasto.l !== l) return;
        const a = arrasto; arrasto = null; l.el.classList.remove('arrastando');
        if (!a.moveu) {
          if (a.carta < 0 || e.type !== 'pointerup') return;
          // clique na carta da frente: vai para o projeto dela; numa carta de lado: traz para a frente
          const c = l.cartas[a.carta];
          if (c.classList.contains('frente') && c.dataset.ir != null) irParaProjeto(+c.dataset.ir);
          else focar(l, a.carta);
          return;
        }
        const h = a.hist, p = h[0], q = h[h.length - 1], dt = Math.max(16, q[1] - p[1]) / 1000;
        const v = Math.max(-4000, Math.min(4000, (q[0] - p[0]) / dt));
        l.vel = v; outra.vel = -v;
        if (Math.abs(v) < 90) { l.alvo = encaixe(l.pos); outra.alvo = encaixe(outra.pos); }
      };
      l.el.addEventListener('pointerup', soltar);
      l.el.addEventListener('pointercancel', soltar);
    });

    // soltou fora da fileira antes de começar a arrastar: só cancela
    addEventListener('pointerup', () => { if (arrasto && !arrasto.moveu) arrasto = null; });
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; }, {threshold: 0}).observe($('#faixas'));
    addEventListener('resize', () => { const lw = W; medir(false); if (lw && lw !== W) linhas.forEach(l => { l.alvo = encaixe(l.pos); }); });
    requestAnimationFrame(passoAnim);
    return {montar};
  })();

  // ---------- "Sobre mim" letra por letra ----------
  const letras = {
    el: $('#sobreTexto'), spans: [],
    preparar() {
      const texto = T[idioma].sobre_texto;
      this.el.setAttribute('aria-label', texto);
      this.el.innerHTML = texto.split(' ').map(p => `<span class="palavra" aria-hidden="true">${[...p].map(c => `<span class="letra">${c}</span>`).join('')}</span>`).join(' ');
      this.spans = [...this.el.querySelectorAll('.letra')];
      this.mover();
    },
    mover() {
      if (!this.spans.length) return;
      const r = this.el.getBoundingClientRect(), vh = innerHeight, n = this.spans.length;
      const p = reduzido ? 1 : Math.min(1, Math.max(0, (vh * .8 - r.top) / (vh * .6 + r.height)));
      const pos = p * n;
      this.spans.forEach((s, i) => { s.style.opacity = .2 + .8 * Math.min(1, Math.max(0, pos - i)); });
    },
  };

  // ---------- contato ----------
  // um caminho principal (e-mail, o botão rosa) e os outros como links discretos
  function montarContato() {
    const t = T[idioma], fora = h => h.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
    const principal = L.email ? `<a class="botao-contato" href="mailto:${L.email}">${t.email_botao}</a>` : '';
    const outros = [
      ['WhatsApp', L.whatsapp && 'https://wa.me/' + L.whatsapp], ['LinkedIn', L.linkedin], ['GitHub', L.github],
      ['Instagram', L.instagram], ['D3D Company', L.site], [t.curriculo, L.curriculo],
    ].filter(([, h]) => h);
    $('#linksContato').innerHTML = principal +
      `<p class="links-secundarios">${outros.map(([nome, h]) => `<a href="${h}"${fora(h)}>${nome}</a>`).join('')}</p>`;
  }

  // ---------- objetos em gravidade zero (Sobre mim) ----------
  // Cada objeto flutua devagar, gira, bate nas bordas da seção e nos outros.
  // Dá para pegar com o mouse (ou o dedo), arrastar e soltar com força para arremessar.
  (() => {
    const secao = $('#sobre');
    const corpos = [...secao.querySelectorAll('.deco')].map((el, i) => ({
      el, x: 0, y: 0, vx: (Math.random() - .5) * 30, vy: (Math.random() - .5) * 30,
      a: (Math.random() - .5) * 10, va: (Math.random() - .5) * 8, pego: null,
    }));
    if (!corpos.length) return;
    const conteudo = [...secao.children].filter(e => !e.classList.contains('deco'));
    let visivel = false, ultimo = performance.now();
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; }, {threshold: 0}).observe(secao);

    // posição base de cada objeto (onde o CSS o colocou), medida sem o deslocamento da física
    const base = c => ({l: c.el.offsetLeft, t: c.el.offsetTop, w: c.el.offsetWidth, h: c.el.offsetHeight});

    corpos.forEach(c => {
      c.el.addEventListener('pointerdown', e => {
        e.preventDefault(); c.el.setPointerCapture(e.pointerId); c.el.classList.add('pegando');
        c.pego = {dx: e.clientX - c.x, dy: e.clientY - c.y, hist: [[e.clientX, e.clientY, performance.now()]]};
        c.vx = c.vy = 0;
      });
      c.el.addEventListener('pointermove', e => {
        if (!c.pego) return;
        c.x = e.clientX - c.pego.dx; c.y = e.clientY - c.pego.dy;
        c.pego.hist.push([e.clientX, e.clientY, performance.now()]); if (c.pego.hist.length > 6) c.pego.hist.shift();
      });
      const soltar = () => {
        if (!c.pego) return;
        const h = c.pego.hist, a = h[0], b = h[h.length - 1], dt = Math.max(16, b[2] - a[2]) / 1000;
        const lim = 2600;   // velocidade máxima do arremesso (px/s)
        c.vx = Math.max(-lim, Math.min(lim, (b[0] - a[0]) / dt)); c.vy = Math.max(-lim, Math.min(lim, (b[1] - a[1]) / dt));
        c.va += c.vx * .02;
        c.pego = null; c.el.classList.remove('pegando');
      };
      c.el.addEventListener('pointerup', soltar); c.el.addEventListener('pointercancel', soltar);
    });

    function passo(agora) {
      requestAnimationFrame(passo);
      const dt = Math.min(.033, (agora - ultimo) / 1000); ultimo = agora;
      if (!visivel) return;
      const W = secao.clientWidth, H = secao.clientHeight;
      const info = corpos.map(base);

      corpos.forEach((c, i) => {
        if (c.pego) return;
        const atrito = Math.exp(-dt * .35);            // quase nenhum atrito: é o espaço
        c.vx *= atrito; c.vy *= atrito; c.va *= Math.exp(-dt * .5);
        // um empurrãozinho aleatório para nunca ficarem parados de vez
        if (!reduzido && Math.hypot(c.vx, c.vy) < 14) { c.vx += (Math.random() - .5) * 40 * dt; c.vy += (Math.random() - .5) * 40 * dt; }
        c.x += c.vx * dt; c.y += c.vy * dt; c.a += c.va * dt;
        // bordas da seção: quica perdendo um pouco de força
        const {l, t, w, h} = info[i], m = 8;
        if (l + c.x < m) { c.x = m - l; c.vx = Math.abs(c.vx) * .8; c.va += c.vy * .01; }
        if (l + c.x + w > W - m) { c.x = W - m - w - l; c.vx = -Math.abs(c.vx) * .8; c.va -= c.vy * .01; }
        if (t + c.y < m) { c.y = m - t; c.vy = Math.abs(c.vy) * .8; c.va -= c.vx * .01; }
        if (t + c.y + h > H - m) { c.y = H - m - h - t; c.vy = -Math.abs(c.vy) * .8; c.va += c.vx * .01; }
      });

      // o título, o texto e o botão são uma "parede": os objetos quicam nela em vez de passar por cima.
      // Só empurra para um lado onde o objeto cabe (no celular sobra pouco espaço dos lados).
      const sr = secao.getBoundingClientRect(), rs = conteudo.map(e => e.getBoundingClientRect()), folga = 14, m = 8;
      const ob = {l: Math.min(...rs.map(r => r.left)) - sr.left - folga, r: Math.max(...rs.map(r => r.right)) - sr.left + folga,
                  t: Math.min(...rs.map(r => r.top)) - sr.top - folga, b: Math.max(...rs.map(r => r.bottom)) - sr.top + folga};
      corpos.forEach((c, i) => {
        if (c.pego) return;
        const {l, t, w, h} = info[i], px = w * .14, py = h * .14;   // as imagens têm margem transparente
        const x1 = l + c.x + px, x2 = l + c.x + w - px, y1 = t + c.y + py, y2 = t + c.y + h - py;
        if (x2 <= ob.l || x1 >= ob.r || y2 <= ob.t || y1 >= ob.b) return;
        const cw = x2 - x1, ch = y2 - y1, saidas = [];
        if (ob.l - m >= cw) saidas.push([x2 - ob.l, -1, 0]);
        if (W - m - ob.r >= cw) saidas.push([ob.r - x1, 1, 0]);
        if (ob.t - m >= ch) saidas.push([y2 - ob.t, 0, -1]);
        if (H - m - ob.b >= ch) saidas.push([ob.b - y1, 0, 1]);
        if (!saidas.length) return;
        const [pen, sx, sy] = saidas.sort((a, b) => a[0] - b[0])[0], passoMax = Math.min(pen, 900 * dt);
        if (sx) { c.x += sx * passoMax; c.vx = sx * Math.max(40, Math.abs(c.vx) * .8); }
        if (sy) { c.y += sy * passoMax; c.vy = sy * Math.max(40, Math.abs(c.vy) * .8); }
      });

      // batidas entre os objetos (como círculos)
      for (let i = 0; i < corpos.length; i++) for (let j = i + 1; j < corpos.length; j++) {
        const A = corpos[i], B = corpos[j], a = info[i], b = info[j];
        const ax = a.l + A.x + a.w / 2, ay = a.t + A.y + a.h / 2, bx = b.l + B.x + b.w / 2, by = b.t + B.y + b.h / 2;
        const ra = Math.min(a.w, a.h) * .42, rb = Math.min(b.w, b.h) * .42;
        let dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy);
        if (d === 0 || d >= ra + rb) continue;
        dx /= d; dy /= d;
        const sobra = ra + rb - d, pa = A.pego ? 0 : B.pego ? 1 : .5, pb = 1 - pa;
        if (!A.pego) { A.x -= dx * sobra * pa; A.y -= dy * sobra * pa; }
        if (!B.pego) { B.x += dx * sobra * pb; B.y += dy * sobra * pb; }
        const rel = (B.vx - A.vx) * dx + (B.vy - A.vy) * dy;
        if (rel < 0) {
          const imp = -rel * .9;
          if (!A.pego) { A.vx -= dx * imp * (B.pego ? 2 : 1); A.vy -= dy * imp * (B.pego ? 2 : 1); A.va -= imp * .05; }
          if (!B.pego) { B.vx += dx * imp * (A.pego ? 2 : 1); B.vy += dy * imp * (A.pego ? 2 : 1); B.va += imp * .05; }
        }
      }

      corpos.forEach(c => { c.el.style.translate = `${c.x.toFixed(1)}px ${c.y.toFixed(1)}px`; c.el.style.rotate = `${c.a.toFixed(2)}deg`; });
    }
    requestAnimationFrame(passo);
  })();

  // ---------- rolagem ----------
  let pedido = false;
  function aoRolar() { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; letras.mover(); empilhar(); }); }
  addEventListener('scroll', aoRolar, {passive: true});
  addEventListener('resize', aoRolar);

  aplicarIdioma();
  aoRolar();
})();
