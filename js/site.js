// ===== SITE: idioma, menu, seções geradas, animações de rolagem =====
(() => {
  const T = window.TEXTOS, L = window.LINKS || {}, P = window.PROJETOS || [], E = window.EXPERIENCIAS || [];
  const $ = s => document.querySelector(s);
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

  // ---------- idioma ----------
  let idioma = 'pt';
  try { idioma = localStorage.getItem('idioma') || ((navigator.language || 'pt').startsWith('pt') ? 'pt' : 'en'); } catch (e) {}
  if (!T[idioma]) idioma = 'pt';
  const t = () => T[idioma];
  // texto que pode ser simples ou {pt, en}
  const tx = v => (v && typeof v === 'object' && !Array.isArray(v)) ? (v[idioma] ?? v.pt ?? '') : (v ?? '');
  const tem = v => { const x = tx(v); return Array.isArray(x) ? x.length > 0 : String(x).trim() !== ''; };
  const pegar = (obj, chave) => chave.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

  function aplicarIdioma() {
    const x = t();
    document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : 'en';
    document.title = x.titulo_pagina;
    document.querySelector('meta[name="description"]').setAttribute('content', x.descricao_pagina);
    document.querySelectorAll('[data-t]').forEach(el => { const v = pegar(x, el.dataset.t); if (v != null) el.textContent = v; });
    document.querySelectorAll('[data-t-label]').forEach(el => el.setAttribute('aria-label', pegar(x, el.dataset.tLabel)));
    menu.rotular();
    montarFrentes(); montarProjetos(); montarExperiencias(); montarContato(); montarFaixas(); letras.preparar();
    observarFades(); aoRolar();
  }
  $('#idioma').addEventListener('click', () => {
    idioma = idioma === 'pt' ? 'en' : 'pt';
    try { localStorage.setItem('idioma', idioma); } catch (e) {}
    aplicarIdioma();
  });

  // ---------- menu ----------
  const menu = {
    nav: $('#menu'), botao: $('#menuBotao'), aberto: false,
    rotular() { this.botao.setAttribute('aria-label', this.aberto ? t().menu_fechar : t().menu_abrir); },
    alternar(abrir = !this.aberto) {
      this.aberto = abrir;
      this.nav.classList.toggle('aberto', abrir);
      this.botao.setAttribute('aria-expanded', abrir);
      document.body.classList.toggle('menu-aberto', abrir);
      this.rotular();
      if (abrir) this.nav.querySelector('a').focus();
    },
  };
  menu.botao.addEventListener('click', () => menu.alternar());
  menu.nav.addEventListener('click', e => { if (e.target.closest('a') && menu.aberto) menu.alternar(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.aberto) { menu.alternar(false); menu.botao.focus(); } });
  matchMedia('(min-width: 900px)').addEventListener('change', e => { if (e.matches && menu.aberto) menu.alternar(false); });

  // seção atual no menu
  const linksMenu = [...document.querySelectorAll('.menu a')];
  const secoes = linksMenu.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
  function marcarSecao() {
    const meio = innerHeight * .4;
    let atual = secoes[0];
    secoes.forEach(s => { if (s.getBoundingClientRect().top <= meio) atual = s; });
    linksMenu.forEach(a => a.setAttribute('aria-current', a.hash === '#' + atual.id ? 'true' : 'false'));
    $('#topo').classList.toggle('rolado', scrollY > 24);
  }

  // ---------- aparecer ao entrar na tela ----------
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    {rootMargin: '0px 0px -8% 0px', threshold: 0});
  function observarFades() {
    document.querySelectorAll('.fade:not(.in)').forEach(el => {
      if (el.dataset.delay) el.style.setProperty('--fd', el.dataset.delay + 's');
      if (el.dataset.y) el.style.setProperty('--fy', el.dataset.y + 'px');
      if (el.dataset.x) el.style.setProperty('--fx', el.dataset.x + 'px');
      io.observe(el);
    });
  }

  // ---------- atuação ----------
  function montarFrentes() {
    $('#frentes').innerHTML = t().atuacao.map((f, i) => `
      <li class="frente fade" data-delay="${(i % 2) * .12}">
        <span class="frente-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="frente-nome">${esc(f.nome)}</h3>
        <p class="frente-desc">${esc(f.desc)}</p>
        <ul class="frente-areas">${f.areas.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
      </li>`).join('');
  }

  // ---------- mídia (fotos e vídeos dos projetos/experiências) ----------
  const ehVideo = m => m.tipo === 'video' || /\.(mp4|webm|mov)$/i.test(m.src);
  function midiaHTML(m, capa) {
    const alt = esc(tx(m.alt) || '');
    if (ehVideo(m)) return `<video src="${esc(m.src)}" ${m.poster ? `poster="${esc(m.poster)}"` : ''} ${capa ? 'muted loop playsinline autoplay' : 'controls playsinline'} preload="metadata" aria-label="${alt}"></video>`;
    return `<img src="${esc(m.src)}" alt="${alt}" loading="lazy" decoding="async">`;
  }
  const galeria = lista => `<div class="galeria">${lista.map(m => `<figure>${midiaHTML(m, false)}${tem(m.legenda) ? `<figcaption>${esc(tx(m.legenda))}</figcaption>` : ''}</figure>`).join('')}</div>`;

  // ---------- projetos ----------
  const CAMPOS = ['contexto', 'desafio', 'processo', 'participacao', 'resultado'];
  const temEstudo = p => CAMPOS.some(c => tem(p[c])) || (p.midia || []).length > 1;
  function linksHTML(p) {
    const x = t(), l = p.links || {};
    return [l.demo && `<a class="botao botao-linha seta" href="${esc(l.demo)}" target="_blank" rel="noopener">${x.link_demo}</a>`,
            l.repo && `<a class="botao botao-linha seta" href="${esc(l.repo)}" target="_blank" rel="noopener">${x.link_repo}</a>`].filter(Boolean).join('');
  }
  function montarProjetos() {
    const x = t(), completos = P.filter(p => !p.pendente), pendentes = P.filter(p => p.pendente);
    $('#cartoes').innerHTML = completos.map((p, i) => {
      const m = (p.midia || [])[0];
      const capa = m ? midiaHTML(m, true)
        : `<div class="capa-tipo" aria-hidden="true"><span class="capa-tec">${(p.tecnologias || []).map(esc).join(' · ')}</span><span class="capa-nome">${esc(tx(p.nome))}</span></div>`;
      const acoes = (temEstudo(p) ? `<button class="botao botao-principal" type="button" data-estudo="${esc(p.id)}">${x.estudo_abrir}</button>` : '') + linksHTML(p);
      return `<div class="cartao-caixa" style="--i:${i}"><article class="cartao" aria-labelledby="proj-${esc(p.id)}">
        <div class="cartao-info">
          <div class="cartao-meta"><span class="cartao-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="rotulo">${esc(tx(p.categoria))}</span></div>
          <h3 class="cartao-nome" id="proj-${esc(p.id)}">${esc(tx(p.nome))}</h3>
          ${tem(p.descricao) ? `<p class="cartao-desc">${esc(tx(p.descricao))}</p>` : ''}
          ${(p.tecnologias || []).length ? `<ul class="etiquetas" aria-label="${x.rotulos.tecnologias}">${p.tecnologias.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
          ${acoes ? `<div class="cartao-acoes">${acoes}</div>` : ''}
        </div>
        <div class="capa">${capa}</div>
      </article></div>`;
    }).join('');
    // projetos sem conteúdo suficiente: lista simples, sem botões nem capas
    $('#outros').innerHTML = pendentes.length ? `<h3 class="rotulo">${x.projetos_outros}</h3><ul>${pendentes.map(p => `
      <li class="outro" data-pendente="true"><span class="rotulo">${esc(tx(p.categoria))}</span><span class="outro-nome">${esc(tx(p.nome))}</span>
      ${tem(p.descricao) ? `<span class="outro-desc">${esc(tx(p.descricao))}</span>` : ''}</li>`).join('')}</ul>` : '';
  }
  function empilhar() {
    if (matchMedia('(max-width: 767px)').matches) return;
    const caixa = $('#cartoes'), cartoes = caixa.querySelectorAll('.cartao'), n = cartoes.length;
    if (n < 2) return;
    const r = caixa.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
    cartoes.forEach((c, i) => {
      const alvo = 1 - (n - 1 - i) * .03, inicio = i / n;
      const k = Math.min(1, Math.max(0, (p - inicio) / (1 - inicio)));
      c.style.transform = `scale(${1 - (1 - alvo) * k})`;
    });
  }

  // estudo de caso em uma janela (<dialog>)
  const dialogo = document.createElement('dialog');
  dialogo.className = 'estudo';
  document.body.append(dialogo);
  let origem = null;
  function abrirEstudo(id, botao) {
    const p = P.find(x => x.id === id), x = t();
    if (!p) return;
    origem = botao;
    const campos = CAMPOS.filter(c => tem(p[c])).map(c => `<div class="${c === 'processo' ? 'largo' : ''}"><dt class="rotulo">${x.rotulos[c]}</dt><dd>${esc(tx(p[c]))}</dd></div>`).join('');
    dialogo.setAttribute('aria-labelledby', 'estudoTitulo');
    dialogo.innerHTML = `<div class="estudo-corpo">
      <div class="estudo-topo"><div><p class="rotulo">${esc(tx(p.categoria))}</p><h2 id="estudoTitulo">${esc(tx(p.nome))}</h2></div>
        <button class="estudo-fechar" type="button" aria-label="${x.estudo_fechar}">×</button></div>
      ${tem(p.descricao) ? `<p class="intro">${esc(tx(p.descricao))}</p>` : ''}
      <dl class="estudo-campos">${campos}
        ${(p.tecnologias || []).length ? `<div class="largo"><dt class="rotulo">${x.rotulos.tecnologias}</dt><dd><ul class="etiquetas">${p.tecnologias.map(s => `<li>${esc(s)}</li>`).join('')}</ul></dd></div>` : ''}</dl>
      ${(p.midia || []).length ? galeria(p.midia) : ''}
      ${linksHTML(p) ? `<div class="cartao-acoes">${linksHTML(p)}</div>` : ''}
    </div>`;
    dialogo.querySelector('.estudo-fechar').addEventListener('click', () => dialogo.close());
    dialogo.showModal();
  }
  dialogo.addEventListener('click', e => { if (e.target === dialogo) dialogo.close(); });
  dialogo.addEventListener('close', () => { dialogo.innerHTML = ''; if (origem) origem.focus(); });
  $('#cartoes').addEventListener('click', e => { const b = e.target.closest('[data-estudo]'); if (b) abrirEstudo(b.dataset.estudo, b); });

  // ---------- experiências ----------
  function montarExperiencias() {
    const x = t();
    $('#linhaTempo').innerHTML = E.map(ex => {
      const tags = tx(ex.tecnologias) || [];
      const meta = [tem(ex.periodo) && `<span class="rotulo">${esc(tx(ex.periodo))}</span>`, tem(ex.organizacao) && `<span class="rotulo">${esc(tx(ex.organizacao))}</span>`].filter(Boolean).join('');
      return `<li class="exp fade${ex.destaque ? ' destaque' : ''}"${ex.pendente ? ' data-pendente="true"' : ''}>
        ${meta ? `<div class="exp-meta">${meta}</div>` : ''}
        <h3 class="exp-nome">${esc(tx(ex.instituicao))}</h3>
        ${tem(ex.papel) ? `<p class="exp-papel">${esc(tx(ex.papel))}</p>` : ''}
        ${tem(ex.atividades) ? `<p class="exp-texto">${esc(tx(ex.atividades))}</p>` : ''}
        ${tem(ex.aprendizados) ? `<p class="exp-texto"><span class="rotulo">${x.rotulos.aprendizados}</span><br>${esc(tx(ex.aprendizados))}</p>` : ''}
        ${tags.length ? `<ul class="etiquetas">${tags.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
        ${(ex.midia || []).length ? galeria(ex.midia) : ''}
      </li>`;
    }).join('');
  }

  // ---------- faixa em movimento ----------
  // sem fotos: as quatro frentes de atuação em texto; com fotos (window.FAIXAS): fileiras de imagens
  function montarFaixas() {
    const fotos = window.FAIXAS || [];
    if (fotos.length) {
      const blocos = lista => { const h = lista.map(src => `<div class="bloco">${midiaHTML({src}, true)}</div>`).join(''); return h + h + h; };
      const meio = Math.ceil(fotos.length / 2);
      $('#faixa1').innerHTML = blocos(fotos.slice(0, meio));
      $('#faixa2').innerHTML = blocos(fotos.slice(meio).length ? fotos.slice(meio) : fotos.slice(0, meio));
      return;
    }
    const nomes = t().atuacao.map(f => f.nome);
    const linha = (estilo) => { const h = nomes.map(n => `<span class="faixa-texto ${estilo}">${esc(n)}</span><span class="faixa-sinal">✦</span>`).join(''); return h + h + h; };
    $('#faixa1').innerHTML = linha('vazado');
    $('#faixa2').innerHTML = linha('cheio');
  }
  function moverFaixas() {
    if (reduzido) return;
    const s = $('#faixas'), r = s.getBoundingClientRect();
    if (r.bottom < -200 || r.top > innerHeight + 200) return;
    const off = (innerHeight - r.top) * .35;
    $('#faixa1').style.transform = `translateX(${off - 900}px)`;
    $('#faixa2').style.transform = `translateX(${-(off - 200)}px)`;
  }

  // ---------- "Sobre" letra por letra ----------
  const letras = {
    el: $('#sobreTexto'), spans: [],
    preparar() {
      const texto = t().sobre_texto;
      this.el.setAttribute('aria-label', texto);
      this.el.innerHTML = texto.split(' ').map(p => `<span class="palavra" aria-hidden="true">${[...p].map(c => `<span class="letra">${esc(c)}</span>`).join('')}</span>`).join(' ');
      this.spans = [...this.el.querySelectorAll('.letra')];
      this.mover();
    },
    mover() {
      if (!this.spans.length) return;
      const r = this.el.getBoundingClientRect(), vh = innerHeight, n = this.spans.length;
      if (r.bottom < -vh || r.top > vh * 2) return;
      const p = reduzido ? 1 : Math.min(1, Math.max(0, (vh * .85 - r.top) / (vh * .5 + r.height)));
      const pos = p * n;
      this.spans.forEach((s, i) => { s.style.opacity = .2 + .8 * Math.min(1, Math.max(0, pos - i)); });
    },
  };

  // ---------- contato ----------
  function montarContato() {
    const x = t(), ordem = ['linkedin', 'email', 'whatsapp', 'github', 'instagram', 'site'];
    $('#canais').innerHTML = ordem.filter(k => L[k] && L[k].url).map(k => {
      const ext = /^https?:/.test(L[k].url);
      const valor = k === 'whatsapp' ? x.whatsapp_rotulo : L[k].rotulo;
      return `<li><a class="canal" href="${esc(L[k].url)}"${ext ? ' target="_blank" rel="noopener"' : ''}>
        <span class="canal-nome">${x.contato_rotulos[k]}</span><span class="canal-valor">${esc(valor)}</span></a></li>`;
    }).join('');
  }

  // ---------- jardim de luz: Three.js só é baixado quando o contato se aproxima ----------
  (() => {
    const alvo = $('#contato');
    let feito = false;
    const carregar = src => new Promise((ok, erro) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = erro; document.body.append(s); });
    new IntersectionObserver((es, obs) => {
      if (feito || !es[0].isIntersecting) return;
      feito = true; obs.disconnect();
      carregar('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js').then(() => carregar('js/flores.js')).catch(() => {});
    }, {rootMargin: '900px 0px'}).observe(alvo);
  })();

  // ---------- objetos em gravidade zero (Sobre) ----------
  // Cada objeto flutua devagar, gira, bate nas bordas da seção e nos outros.
  // Dá para pegar com o mouse (ou o dedo), arrastar e soltar com força para arremessar.
  (() => {
    const secao = $('#sobre');
    const corpos = [...secao.querySelectorAll('.deco')].map(el => ({
      el, x: 0, y: 0, vx: (Math.random() - .5) * 30, vy: (Math.random() - .5) * 30,
      a: (Math.random() - .5) * 10, va: (Math.random() - .5) * 8, pego: null,
    }));
    if (!corpos.length) return;
    let visivel = false, ultimo = performance.now();
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; }, {threshold: 0}).observe(secao);
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
        const h = c.pego.hist, a = h[0], b = h[h.length - 1], dt = Math.max(16, b[2] - a[2]) / 1000, lim = 2600;
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
      const W = secao.clientWidth, H = secao.clientHeight, info = corpos.map(base);
      corpos.forEach((c, i) => {
        if (c.pego) return;
        c.vx *= Math.exp(-dt * .35); c.vy *= Math.exp(-dt * .35); c.va *= Math.exp(-dt * .5);
        if (!reduzido && Math.hypot(c.vx, c.vy) < 14) { c.vx += (Math.random() - .5) * 40 * dt; c.vy += (Math.random() - .5) * 40 * dt; }
        c.x += c.vx * dt; c.y += c.vy * dt; c.a += c.va * dt;
        const {l, t: tp, w, h} = info[i], m = 8;
        if (l + c.x < m) { c.x = m - l; c.vx = Math.abs(c.vx) * .8; c.va += c.vy * .01; }
        if (l + c.x + w > W - m) { c.x = W - m - w - l; c.vx = -Math.abs(c.vx) * .8; c.va -= c.vy * .01; }
        if (tp + c.y < m) { c.y = m - tp; c.vy = Math.abs(c.vy) * .8; c.va -= c.vx * .01; }
        if (tp + c.y + h > H - m) { c.y = H - m - h - tp; c.vy = -Math.abs(c.vy) * .8; c.va += c.vx * .01; }
      });
      for (let i = 0; i < corpos.length; i++) for (let j = i + 1; j < corpos.length; j++) {
        const A = corpos[i], B = corpos[j], a = info[i], b = info[j];
        const ax = a.l + A.x + a.w / 2, ay = a.t + A.y + a.h / 2, bx = b.l + B.x + b.w / 2, by = b.t + B.y + b.h / 2;
        const ra = Math.min(a.w, a.h) * .42, rb = Math.min(b.w, b.h) * .42;
        let dx = bx - ax, dy = by - ay; const d = Math.hypot(dx, dy);
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
  function aoRolar() {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(() => { pedido = false; moverFaixas(); letras.mover(); empilhar(); marcarSecao(); });
  }
  addEventListener('scroll', aoRolar, {passive: true});
  addEventListener('resize', aoRolar);

  aplicarIdioma();
})();
