  // ===== RETRATO VIVO =====
  // Adaptado do motor do Living Portrait: cada expressão é uma imagem inteira e alinhada;
  // o código só escolhe qual mostrar e faz a "pele" se mexer.
  (() => {
    let IDS = {
      rest: 'retrato/2-mae/rest.png',
      kiss: 'retrato/4-alinhadas/kiss.png',
      desconfiado: 'retrato/4-alinhadas/desconfiado.png',
      e: 'retrato/4-alinhadas/olhar-e.png', ne: 'retrato/4-alinhadas/olhar-ne.png', n: 'retrato/4-alinhadas/olhar-n.png', nw: 'retrato/4-alinhadas/olhar-nw.png',
      w: 'retrato/4-alinhadas/olhar-w.png', sw: 'retrato/4-alinhadas/olhar-sw.png', s: 'retrato/4-alinhadas/olhar-s.png', se: 'retrato/4-alinhadas/olhar-se.png',
      // half: 'retrato/4-alinhadas/half.png', closed: 'retrato/4-alinhadas/closed.png',   // entram quando existirem
    };
    // aberto com dois cliques (file://), o WebGL só aceita as imagens embutidas
    if ((location.protocol === 'file:' || location.search.includes('embutido')) && window.RETRATO_IMGS) IDS = {...window.RETRATO_IMGS};
    // 8 direções de olhar (o original usa 16)
    const RING = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'];
    // faces que inclinam a cabeça (feito girando a imagem, não no ChatGPT)
    const TILT = {desconfiado: true};

    const OVER = 1.7, N = 72, M = N + 1, SPAN = OVER / N, ORIGIN = .5 - OVER / 2;
    const WOBBLE = 2.3 * 2 * Math.PI, REACH = .085 / SPAN, C = REACH * WOBBLE, GAMMA = 2 * .14 * WOBBLE, NU = .2 * C;

    const wrap = document.getElementById('magnetWrap'), inner = document.getElementById('magnetInner'), canvas = document.getElementById('faceGl');
    const gl = canvas.getContext('webgl', {alpha: true, premultipliedAlpha: true, antialias: true});
    if (!gl) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const VS = `attribute vec2 a, d; attribute float s; varying vec2 vUv; varying float vS;
      uniform vec2 lean; uniform float overS;
      void main(){ vUv = a; vS = s; vec2 p = a + d + lean; gl_Position = vec4(vec2(p.x-.5, .5-p.y)*2./overS, 0., 1.); }`;
    const FS = `precision highp float; varying vec2 vUv; varying float vS;
      uniform sampler2D faceA, faceB; uniform float fade;
      void main(){
        if(vUv.x<0.||vUv.y<0.||vUv.x>1.||vUv.y>1.){ gl_FragColor = vec4(0.); return; }
        vec4 c = mix(texture2D(faceA,vUv), texture2D(faceB,vUv), fade);
        if(c.a<.004){ gl_FragColor = vec4(0.); return; }
        gl_FragColor = vec4(c.rgb*vS, c.a);
      }`;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr); gl.useProgram(pr);
    const U = {};
    for (const n of ['lean', 'faceA', 'faceB', 'fade', 'overS']) U[n] = gl.getUniformLocation(pr, n);
    gl.uniform1f(U.overS, OVER); gl.uniform1i(U.faceA, 0); gl.uniform1i(U.faceB, 1);

    // ---- a "pele": equação de onda amortecida sobre uma malha ----
    const count = M * M, ux = new Float32Array(count), uy = new Float32Array(count), vx = new Float32Array(count), vy = new Float32Array(count);
    const rest = new Float32Array(count * 2), dyn = new Float32Array(count * 3);
    const sx = new Float32Array(count), sy = new Float32Array(count);
    for (let j = 0, k = 0; j < M; j++) for (let i = 0; i < M; i++) { rest[k++] = ORIGIN + i * SPAN; rest[k++] = ORIGIN + j * SPAN; }
    const idx = new Uint16Array(N * N * 6);
    for (let j = 0, k = 0; j < N; j++) for (let i = 0; i < N; i++) { const a = j * M + i, b = a + 1, c = a + M, d = c + 1; idx[k++] = a; idx[k++] = c; idx[k++] = b; idx[k++] = b; idx[k++] = c; idx[k++] = d; }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, rest, gl.STATIC_DRAW);
    const aa = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(aa); gl.vertexAttribPointer(aa, 2, gl.FLOAT, false, 0, 0);
    const dynBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, dynBuf); gl.bufferData(gl.ARRAY_BUFFER, dyn, gl.DYNAMIC_DRAW);
    const ad = gl.getAttribLocation(pr, 'd'), as = gl.getAttribLocation(pr, 's');
    gl.enableVertexAttribArray(ad); gl.vertexAttribPointer(ad, 2, gl.FLOAT, false, 12, 0);
    gl.enableVertexAttribArray(as); gl.vertexAttribPointer(as, 1, gl.FLOAT, false, 12, 8);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);

    let brush = null;
    function takeHold(u, v, radius = .22) {
      const list = [];
      for (let k = 0; k < count; k++) {
        const dx = rest[k * 2] + ux[k] - u, dy = rest[k * 2 + 1] + uy[k] - v, w = Math.exp(-(dx * dx + dy * dy) / (radius * radius));
        if (w > .02) list.push([k, w, ux[k], uy[k]]);
      }
      brush = {u, v, list, px: 0, py: 0};
    }
    // a malha nunca pode dobrar: cada linha e coluna volta à ordem com uma folga mínima
    const GAP = SPAN * .34, lineA = new Float32Array(M), lineB = new Float32Array(M), lineP = new Float32Array(M);
    function order(start, stride, field, base) {
      for (let i = 0; i < M; i++) { const k = start + i * stride; lineP[i] = base[k] + field[k]; }
      lineA[0] = lineP[0]; for (let i = 1; i < M; i++) lineA[i] = Math.max(lineP[i], lineA[i - 1] + GAP);
      lineB[N] = lineP[N]; for (let i = N - 1; i >= 0; i--) lineB[i] = Math.min(lineP[i], lineB[i + 1] - GAP);
      for (let i = 0; i < M; i++) { const k = start + i * stride; field[k] = (lineA[i] + lineB[i]) / 2 - base[k]; }
    }
    const restX = new Float32Array(count), restY = new Float32Array(count);
    for (let k = 0; k < count; k++) { restX[k] = rest[k * 2]; restY[k] = rest[k * 2 + 1]; }
    function untangle() {
      for (let pass = 0; pass < 2; pass++) {
        for (let j = 0; j < M; j++) order(j * M, 1, sx, restX);
        for (let i = 0; i < M; i++) order(i, M, sy, restY);
      }
    }
    const H = 1 / 240; let simLeft = 0;
    function step(dt) {
      const c2 = C * C, wo2 = WOBBLE * WOBBLE;
      for (let j = 1; j < N; j++) for (let i = 1; i < N; i++) {
        const k = j * M + i, l = k - 1, r = k + 1, t = k - M, b = k + M;
        const lx = ux[l] + ux[r] + ux[t] + ux[b] - 4 * ux[k], ly = uy[l] + uy[r] + uy[t] + uy[b] - 4 * uy[k];
        const lvx = vx[l] + vx[r] + vx[t] + vx[b] - 4 * vx[k], lvy = vy[l] + vy[r] + vy[t] + vy[b] - 4 * vy[k];
        vx[k] += (c2 * lx - wo2 * ux[k] - GAMMA * vx[k] + NU * lvx) * dt;
        vy[k] += (c2 * ly - wo2 * uy[k] - GAMMA * vy[k] + NU * lvy) * dt;
      }
      if (brush) for (const [k, w, u0, v0] of brush.list) {
        const K = 3000 * w, D = 90 * w;
        vx[k] += ((u0 + brush.px * w - ux[k]) * K - vx[k] * D) * dt;
        vy[k] += ((v0 + brush.py * w - uy[k]) * K - vy[k] * D) * dt;
      }
      for (let k = 0; k < count; k++) { ux[k] += vx[k] * dt; uy[k] += vy[k] * dt; }
    }
    function poke(u, v, dx, dy, radius = .09) {
      for (let k = 0; k < count; k++) {
        const ax = rest[k * 2] - u, ay = rest[k * 2 + 1] - v, w = Math.exp(-(ax * ax + ay * ay) / (radius * radius));
        vx[k] += dx * w; vy[k] += dy * w;
      }
    }

    // ---- imagens ----
    const tex = {};
    const param = () => { gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); };
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    const load = name => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = IDS[name]; });
    function upload(name, img) { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); param(); tex[name] = t; }
    let alphaMap = null;
    function hitMap(img) {
      const a = document.createElement('canvas'); a.width = a.height = 128;
      const ac = a.getContext('2d', {willReadFrequently: true}); ac.drawImage(img, 0, 0, 128, 128);
      alphaMap = ac.getImageData(0, 0, 128, 128).data;
    }

    // ---- comportamento ----
    // medidas no rosto do Davi (imagem 1254 x 1254): olhos em y ~ .49, boca ~ .70, queixo ~ .80
    const EYE_Y = .49;
    const ACTS = {
      shifty: [['eye:w', 60, 520], ['eye:e', 60, 600], ['eye:w', 60, 400], ['eye:rest', 60, 260]],
      roll: [['eye:w', 70, 220], ['eye:nw', 50, 90], ['eye:n', 50, 160], ['eye:ne', 50, 90], ['eye:e', 50, 260], ['eye:rest', 90, 200], ['desconfiado', 120, 1100]],
      kiss: [['eye:ne', 70, 400], ['kiss', 110, 900], ['eye:rest', 90, 200]],
      look: [['eye:s', 80, 700], ['eye:sw', 60, 300], ['eye:se', 60, 300], ['eye:rest', 80, 200], ['desconfiado', 120, 900]],
    };
    const ROTATION = ['shifty', 'roll', 'kiss', 'look'];
    const ZONES = {
      hover: {mouth: 'kiss'},
      tap: {brow: 'desconfiado', eyeL: 'desconfiado', eyeR: 'desconfiado', nose: 'act:roll', mouth: 'kiss', cheek: 'kiss', chin: 'desconfiado'}
    };
    const zoneAt = (u, v) => {
      const a = (u - .502) / .215, b = (v - .6) / .27;
      if (a * a + b * b > 1 || v < .36) return 'hair';
      if (v < .45) return 'brow';
      if (Math.abs(v - EYE_Y) < .05 && u > .33 && u < .47) return 'eyeL';
      if (Math.abs(v - EYE_Y) < .05 && u > .53 && u < .67) return 'eyeR';
      if (Math.abs(u - .5) < .06 && v < .64) return 'nose';
      if (v > .64 && v < .76 && Math.abs(u - .5) < .12) return 'mouth';
      return v > .76 ? 'chin' : 'cheek';
    };

    let ready = false, tStart = 0, last = performance.now();
    let pu = .5, pv = .5, onHead = false, zone = null, zoneSince = 0;
    let lastInput = -1e9, awake = false, pressed = false, downAt = 0, downU = 0, downV = 0, lastX = 0, lastY = 0;
    let moodFace = null, moodUntil = 0;
    let act = null, actI = 0, actT = 0, rotation = [], nextIdle = 30000, wantEyes = null;
    let faceA = 'rest', faceB = 'rest', fadeT = 0, fadeMs = 1;
    let logical = 'rest', logicalMs = 70, eyeNow = 'rest', eyeNowMs = 40;
    let nextBlink = 0, blinkStep = -1, blinkT = 0;
    let leanX = 0, leanY = 0, lvX = 0, lvY = 0;
    const has = n => !!tex[n];
    let simples = false;
    const fallbackImg = document.getElementById('faceFallback');

    const setFace = (n, ms) => { logical = has(n) ? n : 'rest'; logicalMs = ms; };
    const setEye = (cell, ms) => { if (has(cell)) { eyeNow = cell; eyeNowMs = ms; } };
    // só uma imagem na tela por vez
    function show(n, ms, now) {
      if (!tex[n] || n === faceB) return;
      faceA = (now - fadeT) / fadeMs > .5 ? faceB : faceA; faceB = n; fadeT = now; fadeMs = Math.min(70, Math.max(1, ms));
      inner.classList.toggle('inclinado', !!TILT[n]);
      if (simples) fallbackImg.src = IDS[n];
    }
    function compose(now) { show(logical !== 'rest' ? logical : eyeNow, logical !== 'rest' ? logicalMs : eyeNowMs, now); }
    const ringFor = (dx, dy) => RING[Math.round(((Math.atan2(-dy, dx) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 4)) % 8];

    function startAct(name, now) { act = ACTS[name]; actI = -1; actT = now; advance(now); }
    function endAct() { act = null; wantEyes = null; }
    function advance(now) {
      actI++;
      if (!act || actI >= act.length) { endAct(); return; }
      const [face, fade] = act[actI]; actT = now;
      if (face.startsWith('eye:')) { setFace('rest', fade); wantEyes = face.slice(4); setEye(wantEyes, fade); }
      else { wantEyes = null; setFace(face, fade); }
    }

    // ---- entrada ----
    // a área do canvas é a imagem com 35% de folga em cada lado; no modo simples o canvas some, então mede pela <img>
    const toUv = (x, y) => { const r = simples ? (b => ({left: b.left - b.width * .35, top: b.top - b.height * .35, width: b.width * 1.7, height: b.height * 1.7}))(fallbackImg.getBoundingClientRect()) : canvas.getBoundingClientRect(); return [((x - r.left) / r.width - .5) * OVER + .5, ((y - r.top) / r.height - .5) * OVER + .5]; };
    const solid = (u, v) => !alphaMap ? ((u - .5) / .33) ** 2 + ((v - .47) / .42) ** 2 < 1 : u >= 0 && v >= 0 && u < 1 && v < 1 && alphaMap[((v * 128 | 0) * 128 + (u * 128 | 0)) * 4 + 3] > 40;
    function wake(now) {
      lastInput = now; nextIdle = 30000 + Math.random() * 15000;
      if (!awake) { awake = true; nextBlink = now + 1600; setEye('half', 90); setTimeout(() => awake && setEye('rest', 100), 110); }
    }
    addEventListener('pointermove', e => {
      const now = performance.now();
      const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
      [pu, pv] = toUv(e.clientX, e.clientY);
      wake(now);
      if (act && !pressed) endAct();
      onHead = solid(pu, pv);
      const z = onHead ? zoneAt(pu, pv) : null;
      if (z !== zone) { zone = z; zoneSince = now; }
      wrap.style.cursor = pressed ? 'grabbing' : onHead ? 'grab' : '';
      if (onHead && !pressed) poke(pu, pv, dx * .00035, dy * .00035, .07);
      if (pressed && brush) {
        let px = pu - brush.u, py = pv - brush.v; const L = Math.hypot(px, py), lim = .24;
        if (L > 0) { const k = lim * (1 - Math.exp(-L / lim)) / L; px *= k; py *= k; }
        brush.px = px; brush.py = py;
      }
    });
    wrap.addEventListener('pointerdown', e => {
      const now = performance.now(), [u, v] = toUv(e.clientX, e.clientY);
      if (!solid(u, v)) return;
      wake(now); endAct(); pressed = true; downAt = now; downU = u; downV = v; takeHold(u, v);
      moodFace = null; wrap.setPointerCapture(e.pointerId); e.preventDefault();
    });
    function release() {
      if (!pressed) return;
      const now = performance.now(), L = Math.hypot(brush.px, brush.py), z = zoneAt(downU, downV), held = now - downAt;
      pressed = false; brush = null; wrap.style.cursor = onHead ? 'grab' : '';
      if (L < .03 && held < 380) {   // um toque
        const r = ZONES.tap[z];
        if (!r) return;
        if (r.startsWith('act:')) startAct(r.slice(4), now); else { moodFace = r; moodUntil = now + 1300; }
        poke(downU, downV, 0, .5, .06);
        return;
      }
      moodFace = 'desconfiado'; moodUntil = now + 700 + L * 2800;   // depois de puxar, ele fica desconfiado
    }
    addEventListener('pointerup', release); addEventListener('pointercancel', release);
    addEventListener('pointerleave', () => { zone = null; });
    let lastScroll = scrollY, scrollUntil = 0;
    addEventListener('scroll', () => { const n = performance.now(); if (Math.abs(scrollY - lastScroll) > 2) { scrollUntil = n + 500; lastScroll = scrollY; } wake(n); }, {passive: true});

    let visible = true;
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, {threshold: 0}).observe(wrap);
    new ResizeObserver(() => { const r = Math.min(devicePixelRatio || 1, 2), b = canvas.getBoundingClientRect(); canvas.width = b.width * r; canvas.height = b.height * r; gl.viewport(0, 0, canvas.width, canvas.height); }).observe(canvas);

    // ---- quadro a quadro ----
    function frame(now) {
      requestAnimationFrame(frame);
      const dt = Math.min(.04, (now - last) / 1000); last = now;
      if (!ready || !visible) return;

      // atos sozinho só depois de 30 a 45 s sem ninguém mexer
      if (act) { if (now - actT > act[actI][2]) advance(now); }
      else if (!reduced && !pressed && now - Math.max(lastInput, tStart) > nextIdle) {
        if (!rotation.length) rotation = [...ROTATION];
        startAct(rotation.shift(), now); lastInput = now; nextIdle = 30000 + Math.random() * 15000;
      }

      let want = 'rest';
      if (act) want = null;
      else if (pressed) want = 'rest';
      else if (moodFace && now < moodUntil) want = moodFace;
      else if (zone && now - zoneSince > 80 && ZONES.hover[zone]) want = ZONES.hover[zone];
      if (want) setFace(want, want === 'rest' ? 110 : 90);

      if (logical === 'rest') {
        if (wantEyes) setEye(wantEyes, 60);
        else if (!awake) setEye(has('closed') ? 'closed' : 'rest', 200);
        else if (blinkStep >= 0) {
          const s = (now - blinkT) / 62 | 0;
          if (s !== blinkStep) { blinkStep = s; if (s === 0 || s === 2) setEye('half', 20); else if (s === 1) setEye('closed', 20); else blinkStep = -1; }
        } else {
          const target = now < scrollUntil ? [0, 1] : [pu - .5, pv - EYE_Y];
          setEye(Math.hypot(target[0], target[1]) < .13 ? 'rest' : ringFor(target[0], target[1]), 50);
          if (has('half') && now > nextBlink) { blinkStep = 0; blinkT = now; setEye('half', 20); nextBlink = now + 2200 + Math.random() * 3400; }
        }
      }
      compose(now);
      if (simples) return;

      // a cabeça se inclina de leve para o cursor
      const tx = (pressed ? (brush ? brush.px * .16 : 0) : awake ? (pu - .5) * .012 : 0) + Math.sin(now * .0009) * .0015;
      const ty = (pressed ? (brush ? brush.py * .16 : 0) : awake ? (pv - EYE_Y) * .008 : 0) + Math.sin(now * .0013) * .0022;
      lvX += ((tx - leanX) * 70 - lvX * 8) * dt; lvY += ((ty - leanY) * 70 - lvY * 8) * dt;
      leanX += lvX * dt; leanY += lvY * dt;

      simLeft += dt;
      let steps = 0;
      while (simLeft >= H && steps < 9) { step(H); simLeft -= H; steps++; }
      if (steps === 9) simLeft = 0;
      for (let j = 0; j < M; j++) for (let i = 0; i < M; i++) {
        const k = j * M + i, edge = i === 0 || j === 0 || i === N || j === N;
        sx[k] = edge ? ux[k] : (ux[k] * 4 + ux[k - 1] + ux[k + 1] + ux[k - M] + ux[k + M]) / 8;
        sy[k] = edge ? uy[k] : (uy[k] * 4 + uy[k - 1] + uy[k + 1] + uy[k - M] + uy[k + M]) / 8;
      }
      untangle();
      for (let k = 0, o = 0; k < count; k++) {
        dyn[o++] = sx[k]; dyn[o++] = sy[k];
        const r = k % M, c = k / M | 0;
        let s = 1;
        if (r > 0 && r < N && c > 0 && c < N) s = Math.max(.86, Math.min(1.16, 1 - ((sx[k + 1] - sx[k - 1]) + (sy[k + M] - sy[k - M])) * 1.8));
        dyn[o++] = s;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, dynBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, dyn);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[faceA] || tex.rest);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex[faceB] || tex.rest);
      gl.uniform1f(U.fade, Math.min(1, (now - fadeT) / fadeMs));
      gl.uniform2f(U.lean, leanX, leanY);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    }

    (async () => {
      const base = await load('rest');
      if (!base) return;
      // aberto direto do disco (file://), o navegador proíbe o WebGL de ler as imagens:
      // aí entra o modo simples, que só troca a <img> (sem a pele elástica)
      try { if (location.search.includes('simples')) throw new Error('forçado pelo endereço'); upload('rest', base); hitMap(base); }
      catch (e) { simples = true; tex.rest = true; canvas.style.display = 'none'; console.warn('Modo simples (abra pelo servidor para a versão completa):', e.message); }
      if (!simples) document.getElementById('faceFallback').style.visibility = 'hidden';
      ready = true; tStart = performance.now(); requestAnimationFrame(frame);
      const names = Object.keys(IDS).filter(n => n !== 'rest');
      let i = 0;
      await Promise.all(Array.from({length: 4}, async () => { while (i < names.length) { const n = names[i++]; const img = await load(n); if (img) { if (simples) tex[n] = true; else upload(n, img); } } }));
      window.__retrato = {tex: Object.keys(tex), get face() { return faceB; }};
    })();
  })();
