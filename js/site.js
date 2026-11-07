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
    montarServicos(); montarProjetos(); montarContato(); letras.preparar();
    observarFades();
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
  function montarServicos() {
    $('#listaServicos').innerHTML = T[idioma].servicos.map(([nome, desc], i) => `
      <li class="servico fade" data-delay="${i * .1}">
        <span class="servico-num">${String(i + 1).padStart(2, '0')}</span>
        <div><h3 class="servico-nome">${nome}</h3><p class="servico-desc">${desc}</p></div>
      </li>`).join('');
  }

  // ---------- cores dos espaços reservados ----------
  const CORES = [['#18011f', '#b600a8'], ['#0b1e3a', '#3a7bd5'], ['#1f0b00', '#be4c00'], ['#0d2410', '#3fa34d'],
                 ['#200a2c', '#7621b0'], ['#002a2a', '#14a3a3']];
  const fundo = i => { const [a, b] = CORES[i % CORES.length]; return `background:linear-gradient(135deg,${a},${b})`; };

  // ---------- projetos (cartões que se empilham) ----------
  function foto(src, cls, i, alt) {
    return src ? `<div class="foto ${cls}"><img src="${src}" alt="${alt}" loading="lazy"></div>`
               : `<div class="foto ${cls} vazio" style="${fundo(i)}">${T[idioma].foto_em_breve}</div>`;
  }
  function montarProjetos() {
    const lista = projetos();
    $('#cartoes').innerHTML = lista.map((p, i) => {
      const f = p.fotos || [];
      const botao = p.link ? `<a class="botao-fantasma" href="${p.link}" target="_blank" rel="noopener">${T[idioma].ver_projeto}</a>`
                           : `<span class="botao-fantasma" aria-disabled="true">${T[idioma].em_breve}</span>`;
      return `<div class="cartao-caixa" style="--i:${i}"><article class="cartao">
        <div class="cartao-topo">
          <span class="cartao-num">${String(i + 1).padStart(2, '0')}</span>
          <div><div class="cartao-tipo">${p.tipo}</div><h3 class="cartao-nome">${p.nome}</h3></div>
          ${botao}
        </div>
        <div class="cartao-fotos">
          <div class="cartao-col">${foto(f[0], 'a', i, p.nome)}${foto(f[1], 'b', i + 1, p.nome)}</div>
          ${foto(f[2], 'c', i + 2, p.nome)}
        </div>
      </article></div>`;
    }).join('');
  }
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

  // ---------- faixas de imagens ----------
  function montarFaixas() {
    const nomes = projetos().map(p => p.nome);
    const itens = (window.FAIXAS && window.FAIXAS.length) ? window.FAIXAS.map(src => ({src}))
      : Array.from({length: 12}, (_, i) => ({nome: nomes[i % nomes.length]}));
    const bloco = (it, i) => it.src ? `<div class="bloco"><img src="${it.src}" alt="" loading="lazy"></div>`
                                    : `<div class="bloco vazio" style="${fundo(i)}">${it.nome}</div>`;
    const meio = Math.ceil(itens.length / 2);
    const linha = parte => { const h = parte.map((it, i) => bloco(it, i)).join(''); return h + h + h; };
    $('#faixa1').innerHTML = linha(itens.slice(0, meio));
    $('#faixa2').innerHTML = linha(itens.slice(meio).length ? itens.slice(meio) : itens.slice(0, meio));
  }
  function moverFaixas() {
    const s = $('#faixas'), off = (scrollY - s.offsetTop + innerHeight) * .3;
    $('#faixa1').style.transform = `translateX(${off - 200 - 600}px)`;
    $('#faixa2').style.transform = `translateX(${-(off - 200)}px)`;
  }

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
  function montarContato() {
    const t = T[idioma], itens = [
      ['LinkedIn', L.linkedin], ['GitHub', L.github], ['Instagram', L.instagram],
      ['E-mail', L.email && 'mailto:' + L.email], ['WhatsApp', L.whatsapp && 'https://wa.me/' + L.whatsapp],
      ['D3D Company', L.site],
    ];
    $('#linksContato').innerHTML = itens.map(([nome, href]) => href
      ? `<a class="botao-fantasma" href="${href}" ${href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${nome}</a>`
      : `<span class="botao-fantasma" aria-disabled="true">${nome} · ${t.em_breve}</span>`).join('');
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
  function aoRolar() { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; moverFaixas(); letras.mover(); empilhar(); }); }
  addEventListener('scroll', aoRolar, {passive: true});
  addEventListener('resize', aoRolar);

  montarFaixas();
  aplicarIdioma();
  aoRolar();
})();
