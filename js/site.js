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
    montarFrentes(); montarProjetos(); montarExperiencias(); montarCertificados(); montarContato(); montarFaixas(); letras.preparar();
    observarFades(); aoRolar();
    if (casoId) { const y = caso.scrollTop; montarCaso(P.find(q => q.id === casoId)); medirCaso(); caso.scrollTop = y; }
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
    return `<img src="${esc(m.src)}" alt="${alt}"${m.inteira ? ' class="inteira"' : ''} loading="lazy" decoding="async">`;
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

  // ---------- estudo de caso: o cartão dá zoom e abre uma tela cheia que rola para o lado ----------
  // A tela é um contêiner com rolagem vertical normal (roda do mouse, toque, teclado);
  // o código converte essa rolagem em deslocamento horizontal da trilha de painéis.
  const caso = document.createElement('div');
  caso.className = 'caso';
  caso.setAttribute('role', 'dialog');
  caso.setAttribute('aria-modal', 'true');
  caso.setAttribute('aria-labelledby', 'casoTitulo');
  caso.tabIndex = -1;
  caso.hidden = true;
  document.body.append(caso);
  let casoId = null, origem = null, comHistorico = false, fechando = false, rolagemPagina = 0;

  const num = n => String(n).padStart(2, '0');
  function midiaCaso(m, fundo) {
    const alt = esc(tx(m.alt) || '');
    if (ehVideo(m)) return `<video src="${esc(m.src)}" ${m.poster ? `poster="${esc(m.poster)}"` : ''} muted loop playsinline autoplay preload="auto" ${fundo ? 'aria-hidden="true"' : `aria-label="${alt}"`}></video>`;
    return `<img src="${esc(m.src)}" alt="${fundo ? '' : alt}" decoding="async">`;
  }
  function montarCaso(p) {
    const x = t(), midias = p.midia || [], completos = P.filter(q => !q.pendente);
    const prox = completos[(completos.indexOf(p) + 1) % completos.length];
    const campos = CAMPOS.filter(c => tem(p[c]));
    const passos = midias.map((m, i) => `
      <section class="caso-painel caso-passo${i % 2 ? ' invertido' : ''}">
        <figure class="caso-fig${m.inteira ? ' inteira' : ''}">${midiaCaso(m, false)}</figure>
        <div class="caso-texto">
          <span class="caso-num" aria-hidden="true">${num(i + 1)} / ${num(midias.length)}</span>
          <h3>${esc(tx(m.titulo) || tx(m.alt) || '')}</h3>
          ${tem(m.texto) ? `<p>${esc(tx(m.texto))}</p>` : ''}
        </div>
      </section>`).join('');
    caso.innerHTML = `
      <div class="caso-barra">
        <span class="rotulo">${esc(tx(p.categoria))}</span>
        <button class="caso-fechar" type="button" aria-label="${x.estudo_fechar}"><span aria-hidden="true">×</span></button>
      </div>
      <div class="caso-palco"><div class="caso-trilha">
        <section class="caso-painel caso-abertura">
          ${midias[0] ? `<div class="caso-fundo">${midiaCaso(midias[0], true)}</div>` : ''}
          <h2 class="caso-titulo" id="casoTitulo">${esc(tx(p.nome))}</h2>
          <div class="caso-intro">
            ${tem(p.descricao) ? `<p>${esc(tx(p.descricao))}</p>` : ''}
            ${(p.tecnologias || []).length ? `<ul class="etiquetas">${p.tecnologias.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
            ${linksHTML(p) ? `<div class="cartao-acoes">${linksHTML(p)}</div>` : ''}
            <p class="caso-dica" aria-hidden="true">${x.caso_rolar}</p>
          </div>
        </section>
        ${campos.length ? `<section class="caso-painel caso-campos"><dl>${campos.map(c => `<div><dt class="rotulo">${x.rotulos[c]}</dt><dd>${esc(tx(p[c]))}</dd></div>`).join('')}</dl></section>` : ''}
        ${passos}
        <section class="caso-painel caso-fim">
          ${prox && prox !== p ? `<p class="rotulo">${x.caso_proximo}</p><button class="caso-proximo" type="button" data-caso="${esc(prox.id)}">${esc(tx(prox.nome))} <span aria-hidden="true">→</span></button>` : ''}
          <button class="botao botao-linha caso-voltar" type="button">${x.caso_voltar}</button>
        </section>
      </div></div>
      <div class="caso-progresso" aria-hidden="true"><span></span></div>`;
    caso.querySelectorAll('img, video').forEach(el => el.addEventListener(el.tagName === 'IMG' ? 'load' : 'loadedmetadata', medirCaso));
  }

  // altura da rolagem = largura da trilha; a trilha fica presa na tela e anda para o lado
  function medirCaso() {
    const trilha = caso.querySelector('.caso-trilha'), palco = caso.querySelector('.caso-palco');
    if (!trilha) return;
    palco.style.height = (trilha.scrollWidth - innerWidth + innerHeight) + 'px';
    rolarCaso();
  }
  let casoPedido = false;
  function rolarCaso() {
    casoPedido = false;
    const trilha = caso.querySelector('.caso-trilha');
    if (!trilha) return;
    const max = Math.max(1, caso.scrollHeight - innerHeight), y = Math.min(caso.scrollTop, max);
    trilha.style.transform = `translate3d(${-y}px, 0, 0)`;
    caso.querySelector('.caso-progresso span').style.transform = `scaleX(${y / max})`;
    const w = innerWidth;
    caso.querySelectorAll('.caso-passo').forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.left < w * .82) s.classList.add('visto');
      // leve paralaxe: a imagem anda um pouco mais devagar que o painel
      const m = s.querySelector('.caso-fig > *');
      if (m && !reduzido) m.style.transform = `translate3d(${Math.max(-1, Math.min(1, (r.left + r.width / 2 - w / 2) / w)) * -2.5}%, 0, 0) scale(1.06)`;
    });
  }
  caso.addEventListener('scroll', () => { if (!casoPedido) { casoPedido = true; requestAnimationFrame(rolarCaso); } }, {passive: true});
  // gesto lateral do trackpad e setas também avançam
  caso.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { caso.scrollTop += e.deltaX; e.preventDefault(); } }, {passive: false});
  caso.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); fecharCaso(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { if (e.target.closest('button, a')) return; e.preventDefault(); caso.scrollBy({top: (e.key === 'ArrowRight' ? 1 : -1) * innerWidth * .6, behavior: reduzido ? 'auto' : 'smooth'}); }
    else if (e.key === 'Tab') {   // mantém o foco dentro da tela
      const f = [...caso.querySelectorAll('button, a[href], video[controls]')];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  caso.addEventListener('click', e => {
    if (e.target.closest('.caso-fechar, .caso-voltar')) fecharCaso();
    const b = e.target.closest('[data-caso]');
    if (b) trocarCaso(b.dataset.caso);
  });
  addEventListener('resize', () => { if (casoId) medirCaso(); });

  function abrirCaso(id, botao) {
    const p = P.find(q => q.id === id);
    if (!p || casoId) return;
    casoId = id; origem = botao; rolagemPagina = scrollY;
    montarCaso(p);
    caso.hidden = false;
    caso.scrollTop = 0;
    document.documentElement.classList.add('caso-aberto');
    medirCaso();
    const capa = botao && botao.closest('.cartao') && botao.closest('.cartao').querySelector('.capa');
    const mostrar = () => { caso.classList.add('ativo'); caso.focus({preventScroll: true}); };
    if (capa && !reduzido) {
      // zoom: uma cópia da capa sai do cartão e cresce até ocupar a tela inteira
      const r = capa.getBoundingClientRect(), raio = getComputedStyle(capa).borderRadius;
      const clone = capa.cloneNode(true);
      clone.className = 'capa caso-zoom';
      clone.querySelectorAll('video').forEach(v => { v.muted = true; v.play().catch(() => {}); });
      document.body.append(clone);
      const anim = clone.animate([
        {left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: raio},
        {left: '0px', top: '0px', width: innerWidth + 'px', height: innerHeight + 'px', borderRadius: '0px'},
      ], {duration: 820, easing: 'cubic-bezier(.76, 0, .24, 1)', fill: 'forwards'});
      anim.finished.then(() => { mostrar(); setTimeout(() => clone.remove(), 650); });
    } else mostrar();
    try { history.pushState({caso: id}, '', '#projeto-' + id); comHistorico = true; } catch (e) { comHistorico = false; }
  }
  function trocarCaso(id) {
    const p = P.find(q => q.id === id);
    if (!p) return;
    caso.classList.remove('ativo');
    setTimeout(() => {
      casoId = id;
      montarCaso(p); caso.scrollTop = 0; medirCaso();
      caso.classList.add('ativo'); caso.focus({preventScroll: true});
      try { history.replaceState({caso: id}, '', '#projeto-' + id); } catch (e) {}
    }, reduzido ? 0 : 450);
  }
  function fecharCaso(doHistorico) {
    if (!casoId || fechando) return;
    fechando = true;
    caso.classList.remove('ativo');
    setTimeout(() => {
      caso.hidden = true; caso.innerHTML = '';
      document.documentElement.classList.remove('caso-aberto');
      document.documentElement.style.scrollBehavior = 'auto';
      scrollTo(0, rolagemPagina);
      document.documentElement.style.scrollBehavior = '';
      casoId = null; fechando = false;
      if (origem) origem.focus({preventScroll: true});
    }, reduzido ? 0 : 500);
    if (comHistorico && !doHistorico) { comHistorico = false; history.back(); }
  }
  addEventListener('popstate', () => { if (casoId) { comHistorico = false; fecharCaso(true); } });
  $('#cartoes').addEventListener('click', e => { const b = e.target.closest('[data-estudo]'); if (b) abrirCaso(b.dataset.estudo, b); });

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

  // ---------- cursos e certificados (lista discreta) ----------
  function montarCertificados() {
    const x = t(), C = window.CERTIFICADOS || [];
    $('#certificados').innerHTML = C.length ? `<h3 class="rotulo">${x.cert_titulo}</h3><ul>${C.map(c => `
      <li class="cert"><span class="cert-nome">${esc(c.nome)}</span>
        <span class="cert-info">${[c.instituicao, c.ano, c.horas && (c.horas + ' h')].filter(Boolean).map(esc).join(' · ')}</span>
        ${c.imagem ? `<a class="cert-link" href="${esc(c.imagem)}" target="_blank" rel="noopener">${x.cert_ver} ↗</a>` : ''}</li>`).join('')}</ul>` : '';
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
