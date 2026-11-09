// ===== CONTEÚDO DO SITE =====
// Tudo o que aparece escrito no site está aqui, em português (pt) e inglês (en).
// Regra: só escreva o que é verdade e documentado. Campo vazio ('' ou []) não aparece no site.
//
// FOTOS E VÍDEOS (próxima etapa): coloque os arquivos em imagens/<pasta-do-projeto>/ e liste em "midia":
//   midia: [{src: 'imagens/megapost/tela-1.webp', alt: 'Tela de agendamento'},
//           {src: 'imagens/megapost/demo.mp4', tipo: 'video', poster: 'imagens/megapost/demo.webp', alt: 'Demonstração'}]
// A primeira mídia vira a capa do projeto. Sem mídia, o site mostra uma capa tipográfica.

window.LINKS = {
  linkedin: {url: 'https://www.linkedin.com/in/davi-carravieri-29508b318', rotulo: 'davi-carravieri'},
  github: {url: 'https://github.com/DaviCarravieri', rotulo: 'DaviCarravieri'},
  instagram: {url: 'https://www.instagram.com/davicarravieri', rotulo: '@davicarravieri'},
  email: {url: 'mailto:davicarravieri0@gmail.com', rotulo: 'davicarravieri0@gmail.com'},
  whatsapp: {url: 'https://wa.me/5514997533001', rotulo: 'WhatsApp'},
  site: {url: 'https://d3dcompany.com.br', rotulo: 'd3dcompany.com.br'},
};

// fotos para a faixa que desliza entre a abertura e a Atuação (vazia = faixa só de texto)
window.FAIXAS = [
  // 'imagens/faixas/foto-1.webp',
];

// ---------- PROJETOS ----------
// Campos de texto têm versão pt e en. "pendente: true" = falta conteúdo: aparece só como item simples da lista.
window.PROJETOS = [
  {
    id: 'portfolio',
    nome: {pt: 'Retrato vivo', en: 'Living portrait'},
    categoria: {pt: 'Experiência digital · IA', en: 'Digital experience · AI'},
    descricao: {
      pt: 'Este portfólio. Um retrato 3D que reage ao visitante: os olhos seguem o cursor, as expressões mudam e a pele estica quando é puxada.',
      en: 'This portfolio. A 3D portrait that reacts to the visitor: the eyes follow the cursor, the expressions change and the skin stretches when pulled.',
    },
    contexto: {
      pt: 'Criar uma apresentação pessoal que mostrasse, na prática, o que consigo construir com tecnologia e inteligência artificial.',
      en: 'Build a personal presentation that shows, in practice, what I can create with technology and artificial intelligence.',
    },
    desafio: {pt: '', en: ''},
    processo: {
      pt: 'Gerei uma versão 3D do meu rosto e cada expressão com IA generativa. Alinhei as imagens com visão computacional (OpenCV) para que nada “pule” na troca, e montei um motor WebGL que escolhe a expressão e simula a pele. O jardim do final foi escrito do zero com Three.js.',
      en: 'I generated a 3D version of my face and each expression with generative AI. I aligned the images with computer vision (OpenCV) so nothing “jumps” between them, and built a WebGL engine that picks the expression and simulates the skin. The closing garden was written from scratch with Three.js.',
    },
    tecnologias: ['HTML', 'CSS', 'JavaScript', 'WebGL', 'Three.js', 'Python', 'OpenCV', 'IA generativa'],
    participacao: {
      pt: 'Direção criativa, geração e curadoria das imagens e desenvolvimento do site com apoio de IA (Claude Code).',
      en: 'Creative direction, image generation and curation, and site development assisted by AI (Claude Code).',
    },
    resultado: {pt: '', en: ''},
    midia: [   // a primeira vira a capa; as outras aparecem no estudo de caso
      // {src: 'imagens/portfolio/capa.webp', alt: {pt: '', en: ''}, legenda: {pt: '', en: ''}},
    ],
    links: {repo: 'https://github.com/DaviCarravieri/portfolio'},
  },
  {
    id: 'megapost',
    nome: {pt: 'MegaPost', en: 'MegaPost'},
    categoria: {pt: 'Aplicação web · Automação', en: 'Web app · Automation'},
    descricao: {
      pt: 'Agendador de Reels que publica sozinho no Instagram e espelha a publicação na Página do Facebook.',
      en: 'A Reels scheduler that posts to Instagram on its own and mirrors the post to the Facebook Page.',
    },
    contexto: {pt: '', en: ''},
    desafio: {pt: '', en: ''},
    processo: {pt: '', en: ''},
    tecnologias: ['Cloudflare Workers', 'D1', 'R2', 'TypeScript', 'JavaScript'],
    participacao: {pt: '', en: ''},
    resultado: {pt: '', en: ''},
    midia: [
      // {src: 'imagens/megapost/capa.webp', alt: {pt: '', en: ''}, legenda: {pt: '', en: ''}},
    ],
    links: {},   // repositório privado; para um link de demonstração: demo: 'https://...'
  },
  {
    id: 'revelando-sp',
    nome: {pt: 'Site Revelando SP', en: 'Revelando SP website'},
    categoria: {pt: 'Site', en: 'Website'},
    descricao: {
      pt: 'Site criado para os frequentadores da Fábrica de Cultura no evento Revelando SP.',
      en: 'A website made for Fábrica de Cultura visitors during the Revelando SP event.',
    },
    contexto: {pt: '', en: ''},
    desafio: {pt: '', en: ''},
    processo: {pt: '', en: ''},
    tecnologias: ['HTML'],
    participacao: {pt: '', en: ''},
    resultado: {pt: '', en: ''},
    midia: [
      // {src: 'imagens/revelando-sp/capa.webp', alt: {pt: '', en: ''}, legenda: {pt: '', en: ''}},
    ],
    links: {demo: 'https://davicarravieri.github.io/Site-RevelandoSP/', repo: 'https://github.com/DaviCarravieri/Site-RevelandoSP'},
  },
  {
    id: 'd3d-company',
    nome: {pt: 'D3D Company', en: 'D3D Company'},
    categoria: {pt: 'E-commerce · Fabricação digital', en: 'E-commerce · Digital fabrication'},
    descricao: {
      pt: 'Minha loja online de impressão 3D: action figures, chaveiros, brinquedos, decoração e peças personalizadas, com envio para todo o Brasil e atendimento a lojistas.',
      en: 'My online 3D printing store: action figures, keychains, toys, home decor and custom pieces, shipping across Brazil and serving retailers.',
    },
    contexto: {pt: '', en: ''},
    desafio: {pt: '', en: ''},
    processo: {pt: '', en: ''},
    tecnologias: ['Nuvemshop', 'E-commerce', 'Impressão 3D'],
    participacao: {pt: '', en: ''},
    resultado: {pt: '', en: ''},
    midia: [
      // {src: 'imagens/d3d-company/capa.webp', alt: {pt: '', en: ''}, legenda: {pt: '', en: ''}},
    ],
    links: {demo: 'https://d3dcompany.com.br'},
  },
  {
    id: 'pecas-3d',
    pendente: true,   // falta: descrição completa, processo, fotos
    nome: {pt: 'Peças em impressão 3D', en: '3D printed parts'},
    categoria: {pt: 'Fabricação digital', en: 'Digital fabrication'},
    descricao: {pt: 'Modelagem e impressão 3D de peças.', en: '3D modeling and printing of parts.'},
    tecnologias: ['Modelagem 3D', 'Impressão 3D'],
    contexto: {pt: '', en: ''},
    desafio: {pt: '', en: ''},
    processo: {pt: '', en: ''},
    participacao: {pt: '', en: ''},
    resultado: {pt: '', en: ''},
    midia: [
      // {src: 'imagens/pecas-3d/capa.webp', alt: {pt: '', en: ''}, legenda: {pt: '', en: ''}},
    ],
    links: {},
  },
];

// ---------- EXPERIÊNCIAS ----------
// "periodo", "papel" e "instituicao" vazios não aparecem. "pendente" marca o que falta preencher.
window.EXPERIENCIAS = [
  {
    id: 'fabrica-de-cultura',
    destaque: true,
    pendente: true,   // falta: período, cargo, resultados e aprendizados
    instituicao: 'Fábrica de Cultura de Iguape',
    organizacao: 'Poiesis',
    periodo: '',
    papel: {pt: 'Educação tecnológica', en: 'Technology education'},
    atividades: {
      pt: 'Aulas práticas de realidade virtual e de pilotagem de drones, aproximando jovens da tecnologia por meio da experimentação.',
      en: 'Hands-on virtual reality and drone piloting classes, bringing young people closer to technology through experimentation.',
    },
    tecnologias: {pt: ['Realidade virtual', 'Drones', 'Cultura maker', 'Fabricação digital'], en: ['Virtual reality', 'Drones', 'Maker culture', 'Digital fabrication']},
    aprendizados: {pt: '', en: ''},
    midia: [   // fotos aparecem em galeria logo abaixo da experiência
      // {src: 'imagens/fabrica-de-cultura/aula-vr.webp', alt: {pt: '', en: ''}, legenda: {pt: '', en: ''}},
    ],
  },
  {
    id: 'ads',
    pendente: true,   // falta: instituição e período
    instituicao: {pt: 'Análise e Desenvolvimento de Sistemas', en: 'Systems Analysis and Development'},
    organizacao: '',   // nome da faculdade
    periodo: {pt: 'Em andamento', en: 'In progress'},
    papel: {pt: 'Graduação', en: 'Degree'},
    atividades: {pt: '', en: ''},
    tecnologias: {pt: [], en: []},
    aprendizados: {pt: '', en: ''},
    midia: [
      // {src: 'imagens/ads/foto.webp', alt: {pt: '', en: ''}, legenda: {pt: '', en: ''}},
    ],
  },
];

// ---------- TEXTOS FIXOS ----------
window.TEXTOS = {
  pt: {
    titulo_pagina: 'Davi Carravieri — Tecnologia, design e inovação',
    descricao_pagina: 'Portfólio de Davi Carravieri: experiências digitais, inteligência artificial, fabricação digital e educação tecnológica.',
    pular: 'Pular para o conteúdo',
    nav: {inicio: 'Início', atuacao: 'Atuação', projetos: 'Projetos', experiencias: 'Experiências', sobre: 'Sobre', contato: 'Contato'},
    menu_abrir: 'Abrir menu', menu_fechar: 'Fechar menu',
    idioma_botao: 'EN', idioma_rotulo: 'Switch to English',

    hero_area: 'Tecnologia · Design · Inovação',
    hero_frase: 'Ideias que conectam o digital ao mundo real.',
    hero_desc: 'Tecnologia, criatividade e experimentação para desenvolver experiências, soluções e projetos.',
    hero_projetos: 'Ver projetos',
    hero_contato: 'Contato',
    hero_rolar: 'Role para explorar',

    atuacao_titulo: 'Onde tecnologia encontra criatividade.',
    atuacao_texto: 'Exploro diferentes possibilidades da tecnologia para criar experiências digitais, desenvolver soluções inteligentes e transformar ideias em projetos reais.',
    atuacao: [
      {nome: 'Experiências digitais', desc: 'Desenvolvimento de sites, interfaces, aplicações e experiências interativas.', areas: ['Design digital', 'Desenvolvimento web', 'Prototipagem']},
      {nome: 'Inteligência artificial', desc: 'Exploração e aplicação de IA para desenvolver soluções, automatizar processos e ampliar possibilidades criativas.', areas: ['IA aplicada', 'Automação', 'Experimentação']},
      {nome: 'Fabricação digital', desc: 'Da modelagem à materialização: criação de objetos, protótipos e experiências por meio da impressão 3D.', areas: ['Modelagem 3D', 'Impressão 3D', 'Prototipagem']},
      {nome: 'Educação e experiências tecnológicas', desc: 'Desenvolvimento de vivências criativas que aproximam pessoas da tecnologia.', areas: ['Cultura maker', 'Realidade virtual', 'Educação tecnológica']},
    ],

    projetos_titulo: 'Projetos selecionados.',
    projetos_texto: 'Ideias, experimentações e soluções que saíram do papel e ganharam forma.',
    projetos_outros: 'Também em desenvolvimento',
    rotulos: {contexto: 'Contexto', desafio: 'Desafio', processo: 'Processo', tecnologias: 'Tecnologias', participacao: 'Minha participação', resultado: 'Resultado', atividades: 'Atividades', aprendizados: 'Aprendizados'},
    estudo_abrir: 'Ver estudo de caso', estudo_fechar: 'Fechar estudo de caso',
    link_demo: 'Ver site', link_repo: 'Repositório',

    exp_titulo: 'Experiências que constroem conhecimento.',
    exp_texto: 'Trajetória prática entre educação, cultura maker e desenvolvimento.',

    sobre_titulo: 'Sobre',
    sobre_texto: 'Gosto de tecnologia quando ela sai da tela. Estudo Análise e Desenvolvimento de Sistemas, desenvolvo sites e aplicações, imprimo peças em 3D e levo realidade virtual e drones para a Fábrica de Cultura de Iguape. Cada frente me ensina algo diferente: o código pede precisão, a fabricação digital pede paciência e a sala de aula mostra que uma ideia só faz sentido quando chega às pessoas. É assim que vejo inovação: menos sobre a ferramenta do momento e mais sobre o que ela permite construir. Quero seguir aprendendo em projetos com impacto real, onde tecnologia, criatividade e pessoas se encontram.',
    sobre_dica: 'Os objetos flutuam em gravidade zero. Pegue e arremesse.',

    contato_titulo: 'Vamos transformar uma ideia em realidade?',
    contato_texto: 'Estou aberto a projetos, colaborações e oportunidades que conectem tecnologia, criatividade e inovação.',
    contato_rotulos: {linkedin: 'LinkedIn', github: 'GitHub', instagram: 'Instagram', email: 'E-mail', whatsapp: 'WhatsApp', site: 'D3D Company'},
    whatsapp_rotulo: 'Conversar no WhatsApp',
    final_dica: 'Mova a luz pelo jardim · clique para as flores abrirem',
    voltar_topo: 'Voltar ao topo',
    rodape: 'Davi Carravieri',
  },
  en: {
    titulo_pagina: 'Davi Carravieri — Technology, design and innovation',
    descricao_pagina: 'Portfolio of Davi Carravieri: digital experiences, artificial intelligence, digital fabrication and technology education.',
    pular: 'Skip to content',
    nav: {inicio: 'Home', atuacao: 'Focus', projetos: 'Projects', experiencias: 'Experience', sobre: 'About', contato: 'Contact'},
    menu_abrir: 'Open menu', menu_fechar: 'Close menu',
    idioma_botao: 'PT', idioma_rotulo: 'Mudar para português',

    hero_area: 'Technology · Design · Innovation',
    hero_frase: 'Ideas that connect the digital to the real world.',
    hero_desc: 'Technology, creativity and experimentation to build experiences, solutions and projects.',
    hero_projetos: 'View projects',
    hero_contato: 'Get in touch',
    hero_rolar: 'Scroll to explore',

    atuacao_titulo: 'Where technology meets creativity.',
    atuacao_texto: 'I explore what technology makes possible to create digital experiences, build smart solutions and turn ideas into real projects.',
    atuacao: [
      {nome: 'Digital experiences', desc: 'Building websites, interfaces, applications and interactive experiences.', areas: ['Digital design', 'Web development', 'Prototyping']},
      {nome: 'Artificial intelligence', desc: 'Exploring and applying AI to build solutions, automate processes and expand creative possibilities.', areas: ['Applied AI', 'Automation', 'Experimentation']},
      {nome: 'Digital fabrication', desc: 'From modeling to making: creating objects, prototypes and experiences through 3D printing.', areas: ['3D modeling', '3D printing', 'Prototyping']},
      {nome: 'Education & tech experiences', desc: 'Designing creative experiences that bring people closer to technology.', areas: ['Maker culture', 'Virtual reality', 'Technology education']},
    ],

    projetos_titulo: 'Selected projects.',
    projetos_texto: 'Ideas, experiments and solutions that left the page and took shape.',
    projetos_outros: 'Also in progress',
    rotulos: {contexto: 'Context', desafio: 'Challenge', processo: 'Process', tecnologias: 'Technologies', participacao: 'My role', resultado: 'Outcome', atividades: 'Activities', aprendizados: 'Learnings'},
    estudo_abrir: 'Read case study', estudo_fechar: 'Close case study',
    link_demo: 'Live site', link_repo: 'Repository',

    exp_titulo: 'Experience that builds knowledge.',
    exp_texto: 'A hands-on path across education, maker culture and development.',

    sobre_titulo: 'About',
    sobre_texto: "I like technology when it leaves the screen. I study Systems Analysis and Development, build websites and applications, 3D print parts and bring virtual reality and drones to Fábrica de Cultura in Iguape. Each of these teaches me something different: code asks for precision, digital fabrication asks for patience, and the classroom shows that an idea only matters once it reaches people. That's how I see innovation: less about the tool of the moment and more about what it lets us build. I want to keep learning on projects with real impact, where technology, creativity and people meet.",
    sobre_dica: 'The objects float in zero gravity. Grab one and throw it.',

    contato_titulo: 'Shall we turn an idea into reality?',
    contato_texto: "I'm open to projects, collaborations and opportunities that connect technology, creativity and innovation.",
    contato_rotulos: {linkedin: 'LinkedIn', github: 'GitHub', instagram: 'Instagram', email: 'Email', whatsapp: 'WhatsApp', site: 'D3D Company'},
    whatsapp_rotulo: 'Chat on WhatsApp',
    final_dica: 'Move the light across the garden · click to make the flowers bloom',
    voltar_topo: 'Back to top',
    rodape: 'Davi Carravieri',
  },
};
