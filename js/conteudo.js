// ===== CONTEÚDO DO SITE =====
// Tudo o que aparece escrito no site está aqui, em português (pt) e inglês (en).
// Regra: só escreva o que é verdade e documentado. Campo vazio ('' ou []) não aparece no site.
//
// FOTOS E VÍDEOS (próxima etapa): coloque os arquivos em imagens/<pasta-do-projeto>/ e liste em "midia":
//   midia: [{src: 'imagens/megapost/tela-1.webp', alt: 'Tela de agendamento'},
//           {src: 'imagens/megapost/demo.mp4', tipo: 'video', poster: 'imagens/megapost/demo.webp', alt: 'Demonstração'}]
// A primeira mídia vira a capa do projeto. Sem mídia, o site mostra uma capa tipográfica.
// No estudo de caso (tela que rola para o lado), cada mídia vira um passo com imagem + texto.
//   Para escrever o texto de um passo, acrescente na mídia:  titulo: {pt: '', en: ''}, texto: {pt: '', en: ''}
//   Sem "titulo", aparece a descrição da imagem (alt). Sem "texto", o passo mostra só o título.

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
  'imagens/faixas/drone.webp',
  'imagens/faixas/grafite-pintura.webp',
  'imagens/faixas/cult-sp.webp',
  'imagens/faixas/montagem-pc.webp',
  'imagens/faixas/estudio.webp',
  'imagens/faixas/drone-turma.webp',
  'imagens/faixas/miniaturas.webp',
  'imagens/faixas/grafite.webp',
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
    desafio: {
      pt: 'Fazer imagens geradas por IA parecerem um único rosto vivo: cada expressão precisava encaixar perfeitamente nas outras, sem nada “pular” na troca, e tudo tinha que rodar leve no navegador.',
      en: 'Making AI-generated images feel like one living face: every expression had to line up perfectly with the others, with nothing “jumping” during a swap, and everything had to run smoothly in the browser.',
    },
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
    midia: [   // a primeira vira a capa; cada uma vira um passo do estudo de caso
      {src: 'imagens/portfolio/site-abertura.webp', inteira: true,
        alt: {pt: 'Abertura do site com o retrato 3D do Davi ao lado do nome', en: 'Site opening with Davi’s 3D portrait next to his name'},
        titulo: {pt: 'Um retrato que reage a quem visita', en: 'A portrait that reacts to visitors'},
        texto: {pt: 'Na abertura do site, o rosto acompanha o cursor com os olhos, manda beijo, fica desconfiado e estica como massa quando é puxado. Tudo roda no navegador, sem nenhum programa extra.', en: 'On the opening screen, the face follows the cursor with its eyes, blows a kiss, looks suspicious and stretches like dough when pulled. Everything runs in the browser, with no extra software.'}},
      {src: 'imagens/portfolio/testes-pixel.webp',
        alt: {pt: 'Quatro testes do rosto do Davi em estilo pixel art, feitos antes da versão definitiva', en: 'Four pixel-art tests of Davi’s face, made before the final version'},
        titulo: {pt: '1. Testes de estilo', en: '1. Style tests'},
        texto: {pt: 'Antes da versão definitiva, testei o rosto em pixel art, com fundos e expressões diferentes. Esses testes ajudaram a escolher o estilo final: o 3D em estilo de animação.', en: 'Before the final version, I tried the face in pixel art, with different backgrounds and expressions. These tests helped me choose the final style: animation-style 3D.'}},
      {src: 'imagens/portfolio/imagem-mae.webp',
        alt: {pt: 'Imagem-mãe: versão 3D do rosto do Davi gerada com IA', en: 'Base image: 3D version of Davi’s face generated with AI'},
        titulo: {pt: '2. A imagem-mãe', en: '2. The base image'},
        texto: {pt: 'A partir de uma foto, gerei com IA (ChatGPT) uma versão 3D do meu rosto em estilo de animação. Ela é a base de tudo: depois de aprovada, nunca mais muda, porque todas as expressões partem dela.', en: 'Starting from a photo, I used AI (ChatGPT) to generate a 3D, animation-style version of my face. It is the foundation of everything: once approved, it never changes, because every expression starts from it.'}},
      {src: 'imagens/portfolio/expressoes.webp',
        alt: {pt: 'Três expressões do retrato: neutro, beijo e desconfiado', en: 'Three portrait expressions: neutral, kiss and suspicious'},
        titulo: {pt: '3. Cada expressão é uma imagem', en: '3. Each expression is an image'},
        texto: {pt: 'Cada expressão é uma edição da imagem-mãe, feita numa conversa nova da IA e mudando só a área necessária (olhos ou boca). Montei um guia com os prompts para que o rosto não fosse mudando aos poucos de uma edição para outra.', en: 'Each expression is an edit of the base image, made in a fresh AI conversation and changing only the area that needs it (eyes or mouth). I put together a guide with the prompts so the face would not slowly drift from one edit to the next.'}},
      {src: 'imagens/portfolio/olhares.webp',
        alt: {pt: 'Grade com os nove olhares do retrato: oito direções e o neutro no centro', en: 'Grid with the portrait’s nine gazes: eight directions and neutral in the center'},
        titulo: {pt: '4. Oito olhares', en: '4. Eight gazes'},
        texto: {pt: 'Para os olhos seguirem o cursor, gerei oito olhares (cima, baixo, lados e diagonais). O código descobre para onde o mouse está apontando e troca a imagem em poucos milissegundos, sem transição longa.', en: 'For the eyes to follow the cursor, I generated eight gazes (up, down, sides and diagonals). The code works out where the mouse is pointing and swaps the image within milliseconds, with no long transition.'}},
      {src: 'imagens/portfolio/alinhamento.webp',
        alt: {pt: 'Três etapas do alinhamento: imagem gerada pela IA, máscara da área que muda e resultado encaixado', en: 'Three alignment steps: AI-generated image, mask of the area that changes and the fitted result'},
        titulo: {pt: '5. Alinhamento com visão computacional', en: '5. Alignment with computer vision'},
        texto: {pt: 'A IA nunca devolve a imagem exatamente na mesma posição. Criei, com apoio do Claude Code, um script em Python com OpenCV que encontra pontos em comum com a imagem-mãe (ORB + RANSAC), corrige posição, escala, rotação e cor, e troca só a área do rosto que mudou (1 → 2 → 3). Assim, cabelo, orelhas e contorno não “pulam” na troca.', en: 'AI never returns the image in exactly the same position. With help from Claude Code, I built a Python script with OpenCV that finds points in common with the base image (ORB + RANSAC), corrects position, scale, rotation and color, and swaps only the part of the face that changed (1 → 2 → 3). This way the hair, ears and outline never “jump” during a swap.'}},
      {src: 'imagens/portfolio/tentativa-olhares.webp',
        alt: {pt: 'Comparação dos olhos: tentativa com a íris movida por código e versão final gerada com IA', en: 'Eye comparison: attempt with the iris moved by code and final version generated with AI'},
        titulo: {pt: '6. O que não deu certo', en: '6. What didn’t work'},
        texto: {pt: 'Primeiro tentei mover a íris por código (1). Surgiram manchas ao redor dos olhos e o olhar ficou artificial. Voltei para a IA: cada olhar passou a ser gerado e depois encaixado pelo alinhamento (2). Errar rápido e trocar de abordagem economizou muito tempo.', en: 'At first I tried moving the iris with code (1). Smudges appeared around the eyes and the gaze looked artificial. I went back to AI: each gaze was generated and then fitted by the alignment script (2). Failing fast and switching approaches saved a lot of time.'}},
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
    midia: [   // a primeira vira a capa
      {src: 'imagens/megapost/demonstracao.mp4', tipo: 'video', poster: 'imagens/megapost/demonstracao.webp', alt: {pt: 'Vídeo de demonstração do MegaPost: enviar vídeos, programar horários, ver o calendário e acompanhar os resultados', en: 'MegaPost demo video: uploading videos, scheduling times, viewing the calendar and tracking results'}},
      {src: 'imagens/megapost/calendario.webp', alt: {pt: 'Calendário do MegaPost com os Reels agendados e publicados do mês', en: 'MegaPost calendar with the month’s scheduled and published Reels'}, inteira: true},
      {src: 'imagens/megapost/painel.webp', alt: {pt: 'Painel do MegaPost com a fila de próximos posts e a atividade recente', en: 'MegaPost dashboard with the upcoming posts queue and recent activity'}, inteira: true},
      {src: 'imagens/megapost/analises.webp', alt: {pt: 'Tela de análises com visualizações, alcance e interações da conta', en: 'Analytics screen with the account’s views, reach and interactions'}, inteira: true},
      {src: 'imagens/megapost/enviar-videos.webp', alt: {pt: 'Tela para enviar vídeos e definir a legenda dos próximos posts', en: 'Screen to upload videos and set the caption for the next posts'}, inteira: true},
      {src: 'imagens/megapost/configuracoes.webp', alt: {pt: 'Configurações da conta: horários de publicação e conexão com Instagram e Facebook', en: 'Account settings: posting times and Instagram and Facebook connection'}, inteira: true},
    ],
    links: {},   // repositório privado; para um link de demonstração: demo: 'https://...'
  },
  {
    id: 'paint-to-print',
    nome: {pt: 'Paint to Print', en: 'Paint to Print'},
    categoria: {pt: 'Site · IA · Impressão 3D', en: 'Website · AI · 3D printing'},
    descricao: {
      pt: 'Site-guia do workshop de criação com IA e impressão 3D, feito para os frequentadores da Fábrica de Cultura no evento Revelando SP. Em três passos, o participante transforma o próprio desenho em imagem 3D com o Gemini e depois em um modelo 3D pronto para imprimir.',
      en: 'A step-by-step site for an AI and 3D printing workshop, made for Fábrica de Cultura visitors during the Revelando SP event. In three steps, participants turn their own drawing into a 3D-style image with Gemini and then into a 3D model ready to print.',
    },
    contexto: {pt: '', en: ''},
    desafio: {pt: '', en: ''},
    processo: {pt: '', en: ''},
    tecnologias: ['HTML', 'Gemini', 'Imagem para 3D', 'Impressão 3D'],
    participacao: {pt: '', en: ''},
    resultado: {pt: '', en: ''},
    midia: [   // a primeira vira a capa
      {src: 'imagens/paint-to-print/workshop.mp4', tipo: 'video', poster: 'imagens/paint-to-print/workshop.webp', alt: {pt: 'Vídeo do passo a passo do workshop: do desenho no papel ao modelo 3D pronto para imprimir', en: 'Workshop walkthrough video: from a paper drawing to a 3D model ready to print'}},
      {src: 'imagens/paint-to-print/inicio.webp', alt: {pt: 'Página inicial do Paint to Print com o passo a passo do workshop', en: 'Paint to Print home page with the workshop step by step'}, inteira: true},
      {src: 'imagens/paint-to-print/celular.webp', alt: {pt: 'Paint to Print no celular: copiar o prompt, usar o Gemini e transformar em 3D', en: 'Paint to Print on a phone: copy the prompt, use Gemini and turn it into 3D'}, inteira: true},
      {src: 'imagens/paint-to-print/makerworld.webp', alt: {pt: 'Ferramenta de imagem para modelo 3D com personagens gerados', en: 'Image-to-3D-model tool with generated characters'}, inteira: true},
    ],
    links: {demo: 'https://davicarravieri.github.io/Paint-to-Print/', repo: 'https://github.com/DaviCarravieri/Paint-to-Print'},
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
    midia: [   // a primeira vira a capa
      {src: 'imagens/d3d-company/inicio.webp', alt: {pt: 'Página inicial da loja D3D Company com a frase “Ideias que ganham forma” e as categorias de produtos', en: 'D3D Company store home page with the tagline “Ideias que ganham forma” and product categories'}, inteira: true},
      {src: 'imagens/d3d-company/destaques.webp', alt: {pt: 'Produtos em destaque: action figures e estojo em formato de lápis personalizável', en: 'Featured products: action figures and a customizable pencil-shaped case'}, inteira: true},
      {src: 'imagens/d3d-company/catalogo.webp', alt: {pt: 'Catálogo da loja com organizadores de cozinha, chaveiros e decoração impressos em 3D', en: 'Store catalog with 3D printed kitchen organizers, keychains and home decor'}, inteira: true},
      {src: 'imagens/d3d-company/produto.webp', alt: {pt: 'Página de produto da loja com fotos, preço e descrição da peça', en: 'Store product page with photos, price and item description'}, inteira: true},
      {src: 'imagens/d3d-company/personalizar-atacado.webp', alt: {pt: 'Seções da loja sobre pedidos personalizados pelo WhatsApp e compras no atacado', en: 'Store sections about custom orders via WhatsApp and wholesale purchases'}, inteira: true},
    ],
    links: {demo: 'https://d3dcompany.com.br'},
  },
  {
    id: 'pecas-3d',
    nome: {pt: 'Peças em impressão 3D', en: '3D printed parts'},
    categoria: {pt: 'Fabricação digital', en: 'Digital fabrication'},
    descricao: {pt: 'Modelagem e impressão 3D de peças.', en: '3D modeling and printing of parts.'},
    tecnologias: ['Modelagem 3D', 'Impressão 3D'],
    contexto: {pt: '', en: ''},
    desafio: {pt: '', en: ''},
    processo: {pt: '', en: ''},
    participacao: {pt: '', en: ''},
    resultado: {pt: '', en: ''},
    midia: [   // a primeira vira a capa
      {src: 'imagens/pecas-3d/cachorro-girando.mp4', tipo: 'video', poster: 'imagens/pecas-3d/cachorro-girando.webp', alt: {pt: 'Escultura de cachorro impressa em 3D girando na palma da mão', en: '3D printed dog sculpture turning in the palm of a hand'}},
      {src: 'imagens/pecas-3d/casa-real.webp', alt: {pt: 'Fachada de uma casa antiga de portas e janelas de madeira', en: 'Facade of an old house with wooden doors and windows'}},
      {src: 'imagens/pecas-3d/casa-modelo.webp', alt: {pt: 'Modelo 3D da mesma casa', en: '3D model of the same house'}},
      {src: 'imagens/pecas-3d/casa-impressa.webp', alt: {pt: 'Maquete da casa impressa em 3D e pintada', en: '3D printed and painted model of the house'}},
      {src: 'imagens/pecas-3d/personagem-real.webp', alt: {pt: 'Pessoa com máscara e figurino de personagem diante de um fundo verde', en: 'Person wearing a character mask and costume in front of a green screen'}},
      {src: 'imagens/pecas-3d/personagem-ficha.webp', alt: {pt: 'Ficha do personagem em 3D com vistas e detalhes', en: '3D character sheet with views and details'}},
      {src: 'imagens/pecas-3d/personagem-impresso.webp', alt: {pt: 'Miniatura do personagem impressa em 3D', en: '3D printed miniature of the character'}},
      {src: 'imagens/pecas-3d/roda-gigante-fatiador.webp', alt: {pt: 'Roda-gigante em miniatura preparada no programa de impressão 3D', en: 'Miniature Ferris wheel prepared in the 3D printing software'}},
      {src: 'imagens/pecas-3d/roda-gigante.webp', alt: {pt: 'Roda-gigante em miniatura impressa em 3D na palma da mão', en: '3D printed miniature Ferris wheel in the palm of a hand'}},
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
    pendente: true,   // falta: cargo, resultados e aprendizados
    instituicao: 'Fábrica de Cultura de Iguape',
    organizacao: 'Poiesis',
    periodo: {pt: 'Desde maio de 2025', en: 'Since May 2025'},
    papel: {pt: 'Educação tecnológica', en: 'Technology education'},
    atividades: {
      pt: 'Aulas práticas de realidade virtual e de pilotagem de drones, aproximando jovens da tecnologia por meio da experimentação. As turmas costumam ter de 20 a 30 pessoas.',
      en: 'Hands-on virtual reality and drone piloting classes, bringing young people closer to technology through experimentation. Classes usually have 20 to 30 people.',
    },
    tecnologias: {pt: ['Realidade virtual', 'Drones', 'Cultura maker', 'Fabricação digital'], en: ['Virtual reality', 'Drones', 'Maker culture', 'Digital fabrication']},
    aprendizados: {pt: '', en: ''},
    midia: [   // a primeira vira a capa
      {src: 'imagens/fabrica-de-cultura/vr-crianca.webp', alt: {pt: 'Davi, ajoelhado, coloca óculos de realidade virtual em uma criança de costas para a câmera', en: 'Davi, kneeling, puts a virtual reality headset on a child facing away from the camera'}},
      {src: 'imagens/fabrica-de-cultura/drone-voo.webp', alt: {pt: 'Aula de drone ao ar livre com o drone em voo', en: 'Outdoor drone class with the drone in flight'}},
      {src: 'imagens/fabrica-de-cultura/drone-fpv.webp', alt: {pt: 'Davi com o controle do drone enquanto uma participante usa os óculos de voo', en: 'Davi holding the drone controller while a participant wears the flight goggles'}},
      {src: 'imagens/fabrica-de-cultura/vr-laboratorio.webp', alt: {pt: 'Participantes com óculos de realidade virtual no laboratório da Fábrica de Cultura', en: 'Participants wearing virtual reality headsets in the Fábrica de Cultura lab'}},
      {src: 'imagens/fabrica-de-cultura/apresentacao.webp', alt: {pt: 'Apresentação para um grupo na Fábrica de Cultura', en: 'Presentation to a group at Fábrica de Cultura'}},
      {src: 'imagens/fabrica-de-cultura/selfie-grupo.webp', alt: {pt: 'Selfie do Davi com um grupo de participantes', en: 'Davi’s selfie with a group of participants'}},
    ],
  },
  {
    id: 'curso-informatica',
    instituicao: {pt: 'Curso de Informática Básica', en: 'Informática Básica (Basic Computing) course'},
    organizacao: {pt: 'Prefeitura de Iguape · ETEC (Centro Paula Souza)', en: 'Iguape City Hall · ETEC (Centro Paula Souza)'},
    periodo: {pt: 'Ago–set de 2026', en: 'Aug–Sep 2026'},
    papel: {pt: 'Instrutor', en: 'Instructor'},
    atividades: {
      pt: 'Ministrei o curso completo, com 12 aulas e 60 horas no período da noite, de 17 de agosto a 1º de setembro. Entre os temas abordados estiveram o uso do computador, o pacote Office, inteligência artificial e a montagem e desmontagem de computadores.',
      en: 'I taught the full course, 12 evening classes totaling 60 hours, from August 17 to September 1. Topics included using a computer, Microsoft Office, artificial intelligence, and assembling and disassembling computers, among others.',
    },
    tecnologias: {pt: ['Informática básica', 'Pacote Office', 'IA', 'Hardware'], en: ['Computer basics', 'Microsoft Office', 'AI', 'Hardware']},
    aprendizados: {pt: '', en: ''},
    midia: [
      {src: 'imagens/curso-informatica/montagem.webp', alt: {pt: 'Alunos montam um computador durante a aula', en: 'Students assemble a computer during class'}},
      {src: 'imagens/curso-informatica/turma.webp', alt: {pt: 'Selfie do Davi com a turma do curso', en: 'Davi’s selfie with the class'}},
      {src: 'imagens/curso-informatica/encerramento.webp', alt: {pt: 'Turma reunida com pizzas no encerramento do curso', en: 'The class gathered with pizzas at the end of the course'}},
      {src: 'imagens/curso-informatica/apostilas.webp', alt: {pt: 'Apostilas do curso sobre a mesa da sala de informática', en: 'Course handouts on a desk in the computer room'}},
    ],
  },
  {
    id: 'ads',
    instituicao: {pt: 'Análise e Desenvolvimento de Sistemas', en: 'Systems Analysis and Development'},
    organizacao: 'Descomplica Faculdade Digital',
    periodo: {pt: 'Desde janeiro de 2025', en: 'Since January 2025'},
    papel: {pt: 'Graduação', en: 'Degree'},
    atividades: {   // módulos com certificado emitido pela faculdade
      pt: 'Módulos concluídos: Basic Frontend (240 h), Programmer (160 h) e Frontend Developer (240 h).',
      en: 'Completed modules: Basic Frontend (240 h), Programmer (160 h) and Frontend Developer (240 h).',
    },
    tecnologias: {pt: [], en: []},
    aprendizados: {pt: '', en: ''},
    midia: [
      // {src: 'imagens/ads/foto.webp', alt: {pt: '', en: ''}, legenda: {pt: '', en: ''}},
    ],
  },
];

// ---------- CURSOS E CERTIFICADOS ----------
// Lista discreta abaixo das experiências. "imagem" abre o certificado (o RG no certificado do SENAI foi borrado).
window.CERTIFICADOS = [
  {nome: 'Fundamentos de Inteligência Artificial Generativa – Google Cloud', instituicao: 'SENAI-SP', ano: '2026', horas: 20, imagem: 'imagens/certificados/ia-generativa-google-cloud.webp'},
  {nome: 'Primeiros socorros e brigada de incêndio', instituicao: 'Líder Saúde Ocupacional · Poiesis', ano: '2026', horas: 8, imagem: 'imagens/certificados/brigada.webp'},
  {nome: 'Operação de Iluminação para Espaços Artísticos', instituicao: 'CULTSP PRO', ano: '2025', horas: 16, imagem: 'imagens/certificados/cultsp-iluminacao.webp'},
  {nome: 'Frontend Developer', instituicao: 'Descomplica Faculdade Digital', ano: '2026', horas: 240, imagem: 'imagens/certificados/descomplica-frontend-developer.webp'},
  {nome: 'Programmer', instituicao: 'Descomplica Faculdade Digital', ano: '2025', horas: 160, imagem: 'imagens/certificados/descomplica-programmer.webp'},
  {nome: 'Basic Frontend', instituicao: 'Descomplica Faculdade Digital', ano: '2025', horas: 240, imagem: 'imagens/certificados/descomplica-basic-frontend.webp'},
  {nome: 'Blender: criando um modelo 3D', instituicao: 'Alura', ano: '2025', horas: 8, imagem: 'imagens/certificados/blender.webp'},
  {nome: 'Deep Learning parte 2: como a rede aprende', instituicao: 'Alura', ano: '2025', horas: 6, imagem: 'imagens/certificados/deep-learning-2.webp'},
  {nome: 'Bootstrap5: crie uma landing page responsiva', instituicao: 'Alura', ano: '2025', horas: 8, imagem: 'imagens/certificados/bootstrap5.webp'},
  {nome: 'Classificação: aprendendo a classificar dados com Machine Learning', instituicao: 'Alura', ano: '2024', horas: 8, imagem: 'imagens/certificados/machine-learning.webp'},
  {nome: 'Pandas: conhecendo a biblioteca', instituicao: 'Alura', ano: '2024', horas: 8, imagem: 'imagens/certificados/pandas.webp'},
  {nome: 'Python para Dados: primeiros passos', instituicao: 'Alura', ano: '2024', horas: 10, imagem: 'imagens/certificados/python-dados.webp'},
  {nome: 'Python: crie a sua primeira aplicação', instituicao: 'Alura', ano: '2024', horas: 8, imagem: 'imagens/certificados/python.webp'},
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
    caso_rolar: 'Role para explorar', caso_proximo: 'Próximo projeto', caso_voltar: 'Voltar aos projetos',
    link_demo: 'Ver site', link_repo: 'Repositório',

    exp_titulo: 'Experiências que constroem conhecimento.',
    exp_texto: 'Trajetória prática entre educação, cultura maker e desenvolvimento.',
    cert_titulo: 'Cursos e certificados', cert_ver: 'Ver certificado',

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
    caso_rolar: 'Scroll to explore', caso_proximo: 'Next project', caso_voltar: 'Back to projects',
    link_demo: 'Live site', link_repo: 'Repository',

    exp_titulo: 'Experience that builds knowledge.',
    exp_texto: 'A hands-on path across education, maker culture and development.',
    cert_titulo: 'Courses and certificates', cert_ver: 'View certificate',

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
