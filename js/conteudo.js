// ===== TEXTOS DO SITE =====
// Tudo o que aparece escrito no site está aqui, em português (pt) e inglês (en).
// Para mudar um texto, mude nas duas línguas.
//
// Fotos: coloque os arquivos nas pastas de imagens/ e escreva o caminho nas listas "fotos".
// Enquanto uma lista estiver vazia, o site mostra um espaço reservado no lugar.

window.LINKS = {
  github: 'https://github.com/DaviCarravieri',
  linkedin: 'https://www.linkedin.com/in/davi-carravieri-29508b318',
  instagram: 'https://www.instagram.com/davicarravieri',
  email: 'davicarravieri0@gmail.com',
  whatsapp: '5514997533001',   // 55 (Brasil) + DDD 14 + número; abre uma conversa no WhatsApp
  site: 'https://d3dcompany.com.br',
  curriculo: '',               // ex.: 'arquivos/curriculo-davi.pdf' — quando tiver, aparece um botão no contato
};

// fotos das faixas 3D (imagens/faixas/). Cada item pode ser só o caminho da foto,
// ou {src: 'caminho', projeto: 0} para que clicar na foto leve ao projeto (0 = primeiro da lista).
window.FAIXAS = [];

// Cada projeto tem UMA cor, usada em tudo que é dele (faixas, cartão, etiquetas).
// Rosa fica reservado para botões e amarelo para destaques, então não use esses dois aqui.

window.TEXTOS = {
  pt: {
    titulo_pagina: 'Davi Carravieri — Portfólio',
    nav: ['Sobre', 'Serviços', 'Projetos', 'Contato'],
    hero_titulo: 'Davi Carravieri',
    hero_frase: 'Estudante de ADS que transforma ideias em apps, sites e experiências com IA',
    contato: 'Fale comigo',
    sobre_titulo: 'Sobre mim',
    sobre_texto: 'Tenho 19 anos, estudo Análise e Desenvolvimento de Sistemas e trabalho na Poiesis, onde ensino realidade virtual e drones na Fábrica de Cultura. Fora das aulas, crio apps como o MegaPost e imprimo peças em 3D. Quero levar essa mistura de código, criatividade e ensino para uma empresa de inteligência artificial. Vamos construir algo juntos?',
    servicos_titulo: 'O que eu faço',
    // [nome, descrição, projetos onde dá para ver isso (números da lista de projetos, começando em 0)]
    servicos: [
      ['Apps e sites', 'Do protótipo ao lançamento: interfaces simples, código organizado e foco em quem vai usar.', [0, 1]],
      ['IA na prática', 'Uso ferramentas de inteligência artificial para gerar imagens, automatizar tarefas e acelerar projetos, como este próprio site.', []],
      ['Ensino de tecnologia', 'Aulas práticas de realidade virtual e pilotagem de drones para jovens na Fábrica de Cultura.', [2]],
      ['Impressão 3D', 'Modelagem e impressão de peças funcionais e decorativas, do arquivo até a peça pronta.', [3, 0]],
    ],
    veja_em: 'Veja em',
    projetos_titulo: 'Projetos',
    ver_projeto: 'Ver projeto',
    foto_em_breve: 'foto em breve',
    destaque: 'Destaque',
    meu_papel: 'Meu papel',
    resumo_em_breve: 'Descrição em breve.',
    // resumo: o que é, em uma frase · papel: o que VOCÊ fez · tags: ferramentas e temas
    projetos: [
      {nome: 'Revelando SP', tipo: 'Site', cor: 'azul', destaque: true, link: '', fotos: [],
       resumo: 'Site para criar desenhos em 3D e transformá-los em peças prontas para impressão 3D.',
       papel: 'Ideia, design e programação', tags: ['Web', '3D', 'Impressão 3D']},
      {nome: 'MegaPost', tipo: 'App', cor: 'verde', link: '', fotos: [],
       resumo: '', papel: '', tags: []},
      {nome: 'Aulas de VR e drone', tipo: 'Educação', cor: 'lilas', link: '', fotos: [],
       resumo: 'Aulas práticas de realidade virtual e pilotagem de drones para jovens na Fábrica de Cultura, pela Poiesis.',
       papel: 'Professor', tags: ['Realidade virtual', 'Drones', 'Ensino']},
      {nome: 'Peças 3D', tipo: 'Maker', cor: 'coral', link: '', fotos: [],
       resumo: 'Peças funcionais e decorativas, da modelagem no computador até a peça impressa.',
       papel: 'Modelagem e impressão', tags: ['Modelagem 3D', 'Impressão 3D']},
    ],
    final_titulo: 'Vamos conversar?',
    email_botao: 'Mandar um e-mail',
    curriculo: 'Currículo',
    final_dica: 'Mova a luz pelo jardim · clique para as flores abrirem',
    em_breve: 'em breve',
    rodape: 'Feito por Davi Carravieri',
    idioma_botao: 'EN',
    idioma_rotulo: 'Switch to English',
  },
  en: {
    titulo_pagina: 'Davi Carravieri — Portfolio',
    nav: ['About', 'Services', 'Projects', 'Contact'],
    hero_titulo: 'Davi Carravieri',
    hero_frase: 'A systems development student turning ideas into apps, websites and AI-powered experiences',
    contato: 'Contact me',
    sobre_titulo: 'About me',
    sobre_texto: "I'm 19, I study Systems Analysis and Development and I work at Poiesis, where I teach virtual reality and drone flying at Fábrica de Cultura. Outside class, I build apps like MegaPost and 3D print parts. I want to bring this mix of code, creativity and teaching to an artificial intelligence company. Let's build something together?",
    servicos_titulo: 'What I do',
    servicos: [
      ['Apps & websites', 'From prototype to launch: simple interfaces, clean code and a focus on the people who use them.', [0, 1]],
      ['Hands-on AI', 'I use artificial intelligence tools to generate images, automate tasks and speed up projects, like this very website.', []],
      ['Tech teaching', 'Hands-on virtual reality and drone piloting classes for young people at Fábrica de Cultura.', [2]],
      ['3D printing', 'Modeling and printing functional and decorative parts, from the file to the finished piece.', [3, 0]],
    ],
    veja_em: 'See it in',
    projetos_titulo: 'Projects',
    ver_projeto: 'View project',
    foto_em_breve: 'photo coming soon',
    destaque: 'Featured',
    meu_papel: 'My role',
    resumo_em_breve: 'Description coming soon.',
    projetos: [
      {nome: 'Revelando SP', tipo: 'Website',
       resumo: 'A website for creating 3D drawings and turning them into parts ready for 3D printing.',
       papel: 'Idea, design and code', tags: ['Web', '3D', '3D printing']},
      {nome: 'MegaPost', tipo: 'App'},
      {nome: 'VR & drone classes', tipo: 'Education',
       resumo: 'Hands-on virtual reality and drone piloting classes for young people at Fábrica de Cultura, through Poiesis.',
       papel: 'Teacher', tags: ['Virtual reality', 'Drones', 'Teaching']},
      {nome: '3D prints', tipo: 'Maker',
       resumo: 'Functional and decorative parts, from modeling on the computer to the printed piece.',
       papel: 'Modeling and printing', tags: ['3D modeling', '3D printing']},
    ],
    final_titulo: "Let's talk?",
    email_botao: 'Send me an e-mail',
    curriculo: 'Résumé',
    final_dica: 'Move the light across the garden · click to make the flowers bloom',
    em_breve: 'coming soon',
    rodape: 'Made by Davi Carravieri',
    idioma_botao: 'PT',
    idioma_rotulo: 'Mudar para português',
  },
};
