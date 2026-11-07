# Portfólio — Davi Carravieri

**Site no ar:** https://davicarravieri.github.io/portfolio/

Meu portfólio pessoal. Tenho 19 anos, estudo Análise e Desenvolvimento de Sistemas e ensino realidade virtual e drones na Fábrica de Cultura (Poiesis).

O site tem três partes:

1. **Retrato vivo:** uma versão 3D do meu rosto que segue o mouse com os olhos, manda beijo, fica desconfiada e estica como massa quando você puxa.
2. **Conteúdo:** faixas de imagens que deslizam com a rolagem, "Sobre mim" que acende letra por letra, objetos 3D em gravidade zero que dá para arremessar, serviços e cartões de projetos que se empilham.
3. **Jardim de luz:** um campo de grama e flores feito do zero com Three.js. A luz segue o cursor, as flores se abrem perto dela e um clique faz o campo inteiro florescer.

O site está em português e inglês (botão PT/EN no menu).

## Como abrir

É HTML, CSS e JavaScript puro, sem etapa de build. Dá para abrir o `index.html` com dois cliques.

Para rodar com um servidor local:

```bash
python -m http.server 8766
```

Depois abra http://localhost:8766.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | A página |
| `css/site.css` | Estilos |
| `js/conteudo.js` | **Todos os textos (PT/EN), links de contato e listas de fotos.** É aqui que se edita o conteúdo. |
| `js/site.js` | Idioma, seções, animações de rolagem e a física dos objetos em gravidade zero |
| `js/retrato.js` | Motor do retrato vivo (WebGL) |
| `js/flores.js` | Jardim de luz (Three.js r128) |
| `imagens/` | Fotos dos projetos e objetos 3D decorativos |
| `retrato/` | Imagens do retrato e as ferramentas que as produziram |
| `referencias/` | Referências usadas no projeto |

## Como o retrato vivo foi feito

Cada expressão é uma imagem inteira, não um efeito de código. O código só escolhe qual mostrar e faz a "pele" se mexer numa malha WebGL.

1. **Imagem-mãe** (`retrato/2-mae/rest.png`): uma versão 3D do meu rosto, gerada no ChatGPT a partir de uma foto.
2. **Expressões** (`retrato/3-chatgpt/`): cada uma é uma edição da imagem-mãe, feita numa conversa nova do ChatGPT, selecionando só a área que muda (olhos ou boca). O passo a passo e os prompts estão em [`retrato/GUIA.md`](retrato/GUIA.md).
3. **Alinhamento** (`retrato/alinhar.py`): encontra pontos em comum com a imagem-mãe (ORB + RANSAC), corrige posição, escala, rotação e cor, e só troca a área do rosto que mudou. Cabelo, orelhas e contorno ficam sempre os da mãe, para nada "pular" na troca. Saída em `retrato/4-alinhadas/`.
4. **Embutir** (`retrato/embutir.py`): coloca as imagens dentro de `retrato/imagens.js`. Sem isso, o navegador não deixa o WebGL ler as imagens quando o site é aberto com dois cliques.
5. **Testes:** `retrato/teste.html` alterna as imagens para conferir se algo "pula", e `retrato/prototipo.html` é o primeiro protótipo do rosto seguindo o mouse.

`retrato/olhares.py` e `retrato/5-olhares/` são uma tentativa que não deu certo: mover a íris por código gerava manchas. Os olhares passaram a vir do ChatGPT.

### Ferramentas

- **ChatGPT** (geração de imagens): imagem-mãe, expressões e objetos 3D decorativos
- **Python** com OpenCV, NumPy e Pillow (`requirements.txt`): alinhamento e preparo das imagens
- **WebGL** puro: retrato vivo
- **Three.js r128**: jardim de luz
- **Claude Code**: desenvolvimento do site e das ferramentas

Para rodar as ferramentas:

```bash
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt
.venv/Scripts/python retrato/alinhar.py retrato/3-chatgpt/kiss.webp kiss
.venv/Scripts/python retrato/embutir.py
```

## Referências e créditos

- O layout e o motor do retrato vivo partem do modelo **Living Portrait** do [motionsites.ai](https://motionsites.ai). O prompt original está em `referencias/living-portrait-motionsites.md`.
- O jardim de luz foi inspirado no modelo **Flower Valley**, mas foi escrito do zero, sem usar o código original.
- Fonte [Kanit](https://fonts.google.com/specimen/Kanit) (Google Fonts).

## Contato

- LinkedIn: [davi-carravieri](https://www.linkedin.com/in/davi-carravieri-29508b318)
- GitHub: [DaviCarravieri](https://github.com/DaviCarravieri)
- Instagram: [@davicarravieri](https://www.instagram.com/davicarravieri)
