// ===== JARDIM DE LUZ =====
// Um campo de grama e flores feito do zero com Three.js. A luz segue o cursor:
// perto dela as flores se abrem e brilham, a grama se afasta e os vaga-lumes se aproximam.
// Um clique solta uma onda que faz o campo inteiro florescer.
(() => {
  const canvas = document.getElementById('flores');
  if (!canvas || !window.THREE) return;
  const THREE = window.THREE;
  const celular = matchMedia('(max-width: 760px)').matches || matchMedia('(pointer: coarse)').matches;
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias: !celular, powerPreference: 'high-performance'}); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, celular ? 1.5 : 1.75));
  renderer.setClearColor(0x05070d, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 60);
  const CAM = new THREE.Vector3(0, 1.3, 6.2), ALVO = new THREE.Vector3(0, .95, 0);

  const FUNDO = new THREE.Color(0x05070d);
  const U = {
    uTime: {value: 0},
    uLuz: {value: new THREE.Vector3(0, .35, 1.2)},     // onde está a luz (segue o cursor)
    uForca: {value: 0},                                 // 0 antes do cursor entrar, 1 depois
    uOnda: {value: new THREE.Vector4(0, 0, 0, -100)},   // x, z do clique e o momento dele
    uFundo: {value: FUNDO},
  };

  // ---------- trecho de shader comum: vento, luz e onda ----------
  const COMUM = `
    uniform float uTime, uForca; uniform vec3 uLuz; uniform vec4 uOnda; uniform vec3 uFundo;
    varying float vPerto, vNevoa;
    float onda(vec2 p) {
      float t = uTime - uOnda.w; if (t < 0. || t > 6.) return 0.;
      float d = length(p - uOnda.xy);
      return exp(-pow(d - t * 3.2, 2.) * 1.6) * exp(-t * .45);
    }
    float perto(vec2 p) { vec2 d = p - uLuz.xz; return exp(-dot(d, d) * 1.1) * uForca; }
    vec3 dobrar(vec3 wp, vec2 base) {
      float h = max(wp.y, 0.), k = h * h;
      float w = sin(uTime * 1.25 + base.x * .65 + base.y * .4) * .55 + sin(uTime * 2.3 + base.x * 1.9 - base.y) * .18;
      vec2 off = vec2(w * .2, w * .07) * k;
      vec2 d = base - uLuz.xz; float dist = length(d);
      off += d / (dist + .001) * (1. - smoothstep(0., 1.25, dist)) * .5 * k * uForca;
      off += vec2(0., -.25) * onda(base) * k;
      wp.xz += off; wp.y -= dot(off, off) * .6;
      return wp;
    }
    void fim(vec4 mv) { vNevoa = smoothstep(5., 15., -mv.z); }
  `;
  const FRAG_COMUM = `uniform vec3 uFundo; varying float vPerto, vNevoa;`;

  // ---------- campo ----------
  const LARG = 15, Z0 = -7.5, Z1 = 3.2;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), eixoY = new THREE.Vector3(0, 1, 0);

  // grama: lâminas finas com a ponta mais clara
  const NG = celular ? 2600 : 7000;
  const lamina = new THREE.PlaneGeometry(.045, 1, 1, 4); lamina.translate(0, .5, 0);
  { const pos = lamina.attributes.position; for (let i = 0; i < pos.count; i++) pos.setX(i, pos.getX(i) * (1 - pos.getY(i) * .92)); }
  const matGrama = new THREE.ShaderMaterial({
    uniforms: U, side: THREE.DoubleSide,
    vertexShader: COMUM + `
      attribute float aTom; varying float vH, vTom;
      void main() {
        vec4 base = modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.);
        vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.);
        wp.xyz = dobrar(wp.xyz, base.xz);
        vH = uv.y; vTom = aTom; vPerto = perto(base.xz) + onda(base.xz) * .6;
        vec4 mv = viewMatrix * wp; fim(mv); gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: FRAG_COMUM + `
      varying float vH, vTom;
      void main() {
        vec3 escuro = vec3(.012, .03, .03), claro = mix(vec3(.08, .22, .14), vec3(.14, .26, .1), vTom);
        vec3 c = mix(escuro, claro, vH);
        c += vec3(1., .78, .45) * vPerto * vH * .55;
        gl_FragColor = vec4(mix(c, uFundo, vNevoa), 1.);
      }`,
  });
  const grama = new THREE.InstancedMesh(lamina, matGrama, NG);
  const tomG = new Float32Array(NG);
  for (let i = 0; i < NG; i++) {
    p.set(rnd(-LARG / 2, LARG / 2), 0, rnd(Z0, Z1));
    q.setFromAxisAngle(eixoY, rnd(0, Math.PI)); s.set(rnd(.7, 1.3), rnd(.12, .36), 1);
    grama.setMatrixAt(i, m.compose(p, q, s)); tomG[i] = Math.random();
  }
  lamina.setAttribute('aTom', new THREE.InstancedBufferAttribute(tomG, 1));
  scene.add(grama);

  // flores: caule + cabeça de pétalas, em posições compartilhadas
  const NF = celular ? 220 : 520;
  const PALETA = [0xff6fb5, 0xb98cff, 0x6fd1ff, 0xffd166, 0xff8a5b, 0xcfc4ff, 0xe36bff];
  const flores = [];
  for (let i = 0; i < NF; i++) flores.push({x: rnd(-LARG / 2, LARG / 2), z: Z1 - .3 - (Z1 - .3 - Z0) * Math.pow(Math.random(), 1.4), h: rnd(.32, .7), giro: rnd(0, Math.PI * 2), tam: rnd(.95, 1.55)});

  const caule = new THREE.PlaneGeometry(.014, 1, 1, 4); caule.translate(0, .5, 0);
  const matCaule = new THREE.ShaderMaterial({
    uniforms: U, side: THREE.DoubleSide,
    vertexShader: COMUM + `
      void main() {
        vec4 base = modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.);
        vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.);
        wp.xyz = dobrar(wp.xyz, base.xz); vPerto = perto(base.xz);
        vec4 mv = viewMatrix * wp; fim(mv); gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: FRAG_COMUM + `void main() { vec3 c = vec3(.06, .16, .09) + vec3(.5, .4, .2) * vPerto * .3; gl_FragColor = vec4(mix(c, uFundo, vNevoa), 1.); }`,
  });
  const caules = new THREE.InstancedMesh(caule, matCaule, NF);
  flores.forEach((f, i) => { p.set(f.x, 0, f.z); q.identity(); s.set(1, f.h, 1); caules.setMatrixAt(i, m.compose(p, q, s)); });
  scene.add(caules);

  // cabeça: 6 pétalas em leque + miolo, desenhada à mão
  function cabeca() {
    const pos = [], raio = [], miolo = [];
    const tri = (a, b, c, ra, rb, rc, mi) => { pos.push(...a, ...b, ...c); raio.push(ra, rb, rc); miolo.push(mi, mi, mi); };
    const PET = 6, L = .13, W = .055, SEG = 10;
    for (let k = 0; k < PET; k++) {
      const a = k / PET * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      const ponto = t => { const lx = (Math.cos(t) * .5 + .5) * L, ly = Math.sin(t) * W * .5 * (1 - Math.cos(t) * .2);
        return [lx * ca - ly * sa, lx * sa + ly * ca, 0]; };
      for (let j = 0; j < SEG; j++) {
        const t0 = Math.PI + j / SEG * Math.PI * 2, t1 = Math.PI + (j + 1) / SEG * Math.PI * 2;
        const A = ponto(t0), B = ponto(t1);
        tri([0, 0, 0], A, B, 0, Math.hypot(A[0], A[1]) / L, Math.hypot(B[0], B[1]) / L, 0);
      }
    }
    const R = .028;
    for (let j = 0; j < 12; j++) {
      const a0 = j / 12 * Math.PI * 2, a1 = (j + 1) / 12 * Math.PI * 2;
      tri([0, 0, .006], [Math.cos(a0) * R, Math.sin(a0) * R, .006], [Math.cos(a1) * R, Math.sin(a1) * R, .006], 0, 1, 1, 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aRaio', new THREE.Float32BufferAttribute(raio, 1));
    g.setAttribute('aMiolo', new THREE.Float32BufferAttribute(miolo, 1));
    return g;
  }
  const geoCab = cabeca();
  const cores = new Float32Array(NF * 3), fases = new Float32Array(NF);
  const cor = new THREE.Color();
  flores.forEach((f, i) => { cor.set(PALETA[i % PALETA.length]); cores.set([cor.r, cor.g, cor.b], i * 3); fases[i] = Math.random(); });
  geoCab.setAttribute('aCor', new THREE.InstancedBufferAttribute(cores, 3));
  geoCab.setAttribute('aFase', new THREE.InstancedBufferAttribute(fases, 1));
  const matCab = new THREE.ShaderMaterial({
    uniforms: U, side: THREE.DoubleSide, transparent: false,
    vertexShader: COMUM + `
      attribute float aRaio, aMiolo, aFase; attribute vec3 aCor;
      varying float vRaio, vMiolo; varying vec3 vCor;
      void main() {
        vec4 base = modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.);
        float aberta = clamp(perto(base.xz) * 1.4 + onda(base.xz) * 1.2, 0., 1.);
        float respira = .04 * sin(uTime * 1.6 + aFase * 6.28);
        vec3 lp = position;
        // fechada: pétalas dobradas para cima como um botão; aberta: estrela inteira
        float abre = mix(.28, 1.15, aberta) + respira;
        float dobra = (1. - aberta) * 1.25 * aRaio;
        lp.xy *= abre * (1. - dobra * .35);
        lp.z += dobra * .07;
        // inclina a flor de frente para a câmera e um pouco para cima
        float c = cos(-1.05), s = sin(-1.05);
        lp = vec3(lp.x, lp.y * c - lp.z * s, lp.y * s + lp.z * c);
        vec4 wp = modelMatrix * instanceMatrix * vec4(lp, 1.);
        wp.xyz = dobrar(wp.xyz, base.xz);
        vRaio = aRaio; vMiolo = aMiolo; vCor = aCor; vPerto = aberta;
        vec4 mv = viewMatrix * wp; fim(mv); gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: FRAG_COMUM + `
      varying float vRaio, vMiolo; varying vec3 vCor;
      void main() {
        vec3 petala = vCor * mix(.4, 1., vRaio) * (.5 + vPerto * 1.1);
        petala += vCor * vPerto * vPerto * .9 * (1. - vRaio * .5);
        vec3 miolo = vec3(1., .82, .35) * (.4 + vPerto * 1.4);
        vec3 c = mix(petala, miolo, vMiolo);
        gl_FragColor = vec4(mix(c, uFundo, vNevoa * .9), 1.);
      }`,
  });
  const cabecas = new THREE.InstancedMesh(geoCab, matCab, NF);
  flores.forEach((f, i) => { p.set(f.x, f.h, f.z); q.setFromAxisAngle(eixoY, Math.sin(f.giro) * .5); s.setScalar(f.tam); cabecas.setMatrixAt(i, m.compose(p, q, s)); });
  scene.add(cabecas);

  // chão: escuro, com uma poça de luz quente sob o cursor
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: COMUM + `varying vec2 vXZ; void main() { vec4 wp = modelMatrix * vec4(position, 1.); vXZ = wp.xz; vPerto = perto(wp.xz); vec4 mv = viewMatrix * wp; fim(mv); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: FRAG_COMUM + `varying vec2 vXZ; void main() { vec3 c = vec3(.01, .018, .02) + vec3(.35, .24, .1) * vPerto * .35; gl_FragColor = vec4(mix(c, uFundo, vNevoa), 1.); }`,
  }));
  chao.rotation.x = -Math.PI / 2; scene.add(chao);

  // vaga-lumes e a própria luz: pontos que brilham somando cor
  const NV = celular ? 70 : 160;
  const vPos = new Float32Array(NV * 3), vSem = new Float32Array(NV);
  for (let i = 0; i < NV; i++) { vPos.set([rnd(-LARG / 2, LARG / 2), rnd(.2, 1.6), rnd(Z0, Z1)], i * 3); vSem[i] = Math.random() * 100; }
  const geoV = new THREE.BufferGeometry();
  geoV.setAttribute('position', new THREE.BufferAttribute(vPos, 3));
  geoV.setAttribute('aSem', new THREE.BufferAttribute(vSem, 1));
  const matV = new THREE.ShaderMaterial({
    uniforms: {...U, uPx: {value: renderer.getPixelRatio()}}, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime, uForca, uPx; uniform vec3 uLuz; attribute float aSem; varying float vBrilho;
      void main() {
        vec3 p = position;
        p.x += sin(uTime * .3 + aSem) * .6; p.y += sin(uTime * .5 + aSem * 1.7) * .25; p.z += cos(uTime * .27 + aSem * 2.3) * .5;
        vec3 d = uLuz - p; float dist = length(d);
        p += d * .35 * uForca * smoothstep(3.5, .3, dist) * (.5 + .5 * sin(uTime * .8 + aSem));
        vBrilho = (.45 + .55 * sin(uTime * 2.4 + aSem * 3.1)) * (.5 + .9 * uForca * smoothstep(3.5, 0., dist));
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_PointSize = 70. * uPx / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vBrilho;
      void main() { float d = length(gl_PointCoord - .5); float a = smoothstep(.5, 0., d); a *= a;
        gl_FragColor = vec4(vec3(1., .9, .55) * a * vBrilho, 1.); }`,
  });
  scene.add(new THREE.Points(geoV, matV));

  const geoL = new THREE.BufferGeometry(); geoL.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
  const matL = new THREE.ShaderMaterial({
    uniforms: {...U, uPx: matV.uniforms.uPx}, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform vec3 uLuz; uniform float uPx, uTime; void main() { vec4 mv = modelViewMatrix * vec4(uLuz, 1.); gl_PointSize = (520. + sin(uTime * 3.) * 30.) * uPx / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uForca; void main() { float d = length(gl_PointCoord - .5) * 2.; float a = exp(-d * d * 9.) * 1.1 + exp(-d * d * 1.6) * .22;
      gl_FragColor = vec4(vec3(1., .85, .55) * a * uForca, 1.); }`,
  });
  const luz = new THREE.Points(geoL, matL); luz.frustumCulled = false; scene.add(luz);

  // ---------- entrada ----------
  const ray = new THREE.Raycaster(), plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), -.35);
  const mouse = new THREE.Vector2(0, -.2), alvoLuz = new THREE.Vector3(0, .35, 1.2), ponto = new THREE.Vector3();
  let dentro = false, forcaAlvo = 0, ultimo = 0;
  function mirar(x, y) {
    const r = canvas.getBoundingClientRect();
    mouse.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    if (ray.ray.intersectPlane(plano, ponto)) { ponto.x = THREE.MathUtils.clamp(ponto.x, -7, 7); ponto.z = THREE.MathUtils.clamp(ponto.z, Z0, Z1); alvoLuz.copy(ponto); }
    dentro = true; forcaAlvo = 1; ultimo = performance.now();
  }
  canvas.addEventListener('pointermove', e => mirar(e.clientX, e.clientY));
  canvas.addEventListener('pointerdown', e => { mirar(e.clientX, e.clientY); U.uOnda.value.set(alvoLuz.x, alvoLuz.z, 0, U.uTime.value); });
  canvas.addEventListener('pointerleave', () => { dentro = false; });
  // os links por cima do canvas também levam a luz junto
  document.querySelector('.jardim').addEventListener('pointermove', e => { if (e.target !== canvas) mirar(e.clientX, e.clientY); });

  // ---------- tamanho e visibilidade ----------
  function medir() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < .8 ? 58 : 42;   // celular em pé vê mais do campo
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(medir).observe(canvas); medir();
  let visivel = false;
  new IntersectionObserver(es => { visivel = es[0].isIntersecting; }, {threshold: 0}).observe(canvas);

  // ---------- quadro a quadro ----------
  const relogio = new THREE.Clock();
  let t = 0;
  function quadro() {
    requestAnimationFrame(quadro);
    const dt = Math.min(relogio.getDelta(), .05);
    if (!visivel) return;
    t += reduzido ? dt * .25 : dt;
    U.uTime.value = t;

    // sem cursor (ou no celular parado), a luz passeia sozinha pelo campo
    if (!dentro && performance.now() - ultimo > 2500) {
      alvoLuz.set(Math.sin(t * .23) * 4.2, .35, -1.6 + Math.sin(t * .17) * 2.2); forcaAlvo = .85;
    }
    U.uLuz.value.lerp(alvoLuz, 1 - Math.exp(-dt * 7));
    U.uForca.value += (forcaAlvo - U.uForca.value) * (1 - Math.exp(-dt * 2.5));

    camera.position.set(CAM.x + mouse.x * .35, CAM.y + mouse.y * .12, CAM.z);
    camera.lookAt(ALVO);
    renderer.render(scene, camera);
  }
  quadro();
})();
