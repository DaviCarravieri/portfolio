// ===== PARTÍCULAS DE FUNDO =====
// Pontinhos discretos, como névoa de spray, sobre o site inteiro.
// - Sobem devagar, cada um numa "profundidade" diferente (os mais perto são maiores e mais rápidos).
// - Rolagem: andam junto com a página em velocidades diferentes e esticam em risquinhos quando ela corre rápido.
// - Cursor: os pontos se afastam dele e os que ficam por perto se ligam com fios finos.
// Somem no jardim de luz, que já tem a própria luz.
(() => {
  const tela = document.createElement('canvas');
  tela.id = 'particulas';
  tela.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tela);
  const ctx = tela.getContext('2d');
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const jardim = document.querySelector('#contato');

  const RAIO = 160;        // alcance do cursor (px)
  const FIO = 110;         // distância máxima para ligar dois pontos perto do cursor (px)
  let W = 0, H = 0, pontos = [];
  const mouse = {x: -9999, y: -9999, ativo: false};
  let scrollAnterior = scrollY, velocidade = 0;

  function criar() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    tela.width = Math.round(W * dpr); tela.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(110, Math.max(28, Math.round(W * H / 15000)));
    pontos = Array.from({length: n}, () => {
      const z = .25 + Math.random() * .75;
      return {x: Math.random() * W, y: Math.random() * H, z, ox: 0, oy: 0,
              deriva: (Math.random() - .5) * .25, fase: Math.random() * Math.PI * 2, r: .5 + z * 1.3};
    });
  }

  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.ativo = true; }, {passive: true});
  addEventListener('pointerup', e => { if (e.pointerType === 'touch') mouse.ativo = false; });
  document.addEventListener('pointerleave', () => { mouse.ativo = false; });
  addEventListener('blur', () => { mouse.ativo = false; });

  // dá a volta: o que sai por um lado entra pelo outro
  const voltar = (v, max) => ((v % max) + max) % max;

  function desenhar(t) {
    ctx.clearRect(0, 0, W, H);
    const esticar = Math.max(-18, Math.min(18, velocidade));
    const perto = [];

    for (const p of pontos) {
      const px = p.x + p.ox, py = p.y + p.oy;
      const a = .22 + .5 * p.z;
      ctx.strokeStyle = ctx.fillStyle = `rgba(215, 226, 234, ${a})`;
      if (Math.abs(esticar) > 2) {
        // rolagem rápida: vira um risco na direção do movimento
        ctx.lineWidth = p.r; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + esticar * p.z * 1.2); ctx.stroke();
      } else {
        // um leve "piscar", como poeira pegando luz
        const brilho = .75 + .25 * Math.sin(t / 900 + p.fase);
        ctx.beginPath(); ctx.arc(px, py, p.r * brilho, 0, Math.PI * 2); ctx.fill();
      }
      if (mouse.ativo && Math.hypot(px - mouse.x, py - mouse.y) < RAIO) perto.push([px, py, p.z]);
    }

    // fios finos entre os pontos que estão perto do cursor
    ctx.lineWidth = .6;
    for (let i = 0; i < perto.length; i++) for (let j = i + 1; j < perto.length; j++) {
      const [ax, ay] = perto[i], [bx, by] = perto[j], d = Math.hypot(ax - bx, ay - by);
      if (d > FIO) continue;
      ctx.strokeStyle = `rgba(215, 226, 234, ${(.28 * (1 - d / FIO)).toFixed(3)})`;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
    }
  }

  let tAnterior = 0;
  function passo(t) {
    requestAnimationFrame(passo);
    const dt = Math.min(.1, (t - (tAnterior || t)) / 1000) || .016; tAnterior = t;
    let dScroll = scrollY - scrollAnterior; scrollAnterior = scrollY;
    if (Math.abs(dScroll) > H * .5) dScroll = 0;      // salto (link do menu, recarregar): não estica nada
    const manter = Math.exp(-dt * 10);                 // a "velocidade" some em ~0,3 s, qualquer que seja o fps
    velocidade = velocidade * manter + dScroll * (1 - manter);

    for (const p of pontos) {
      // deriva: sobe devagar, balançando
      p.x += p.deriva * p.z + Math.sin(t / 2400 + p.fase) * .08;
      p.y -= .12 * p.z + dScroll * p.z * .35;        // a rolagem empurra mais os pontos "da frente"
      p.x = voltar(p.x, W); p.y = voltar(p.y, H);

      // o cursor empurra o ponto para longe; quando ele vai embora, o ponto volta devagar
      let ax = 0, ay = 0;
      if (mouse.ativo) {
        const dx = p.x + p.ox - mouse.x, dy = p.y + p.oy - mouse.y, d = Math.hypot(dx, dy);
        if (d < RAIO && d > .1) { const k = (1 - d / RAIO) ** 2 * 46 * p.z; ax = dx / d * k; ay = dy / d * k; }
      }
      p.ox += (ax - p.ox) * .07; p.oy += (ay - p.oy) * .07;
    }

    // some quando o jardim ocupa a tela
    if (jardim) {
      const topo = jardim.getBoundingClientRect().top;
      tela.style.opacity = Math.max(0, Math.min(1, (topo - H * .15) / (H * .45))).toFixed(2);
    }
    desenhar(t);
  }

  criar();
  addEventListener('resize', () => { criar(); if (reduzido) desenhar(0); });
  if (reduzido) desenhar(0);           // movimento reduzido: só os pontos parados
  else requestAnimationFrame(passo);
})();
