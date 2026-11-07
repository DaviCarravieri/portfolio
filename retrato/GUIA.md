# Guia do retrato vivo

As imagens do rosto vêm todas de uma única **imagem-mãe**. Cada expressão é uma edição dela, e um script encaixa as imagens para ficarem alinhadas.

## Pastas

| Pasta | O que vai nela | Quem coloca |
|---|---|---|
| `1-foto/` | Sua foto original (não vai para o GitHub) | Você |
| `2-mae/` | A imagem-mãe aprovada, com o nome `rest.png` | Você |
| `3-chatgpt/` | As expressões geradas, cada uma com o nome da tabela abaixo | Você |
| `4-alinhadas/` | Expressões depois do alinhamento | Script |
| `5-olhares/` | Olhares e piscadas feitos no ComfyUI | Script |

## Etapa 0: a foto

- De frente, olhando direto para a câmera
- Luz clara e uniforme, sem sombra forte de um lado
- Rosto neutro, boca fechada
- Cabelo como você quer que apareça no site

## Etapa 1: a imagem-mãe (ChatGPT)

Abra uma conversa nova, envie sua foto e cole:

```text
Transforme a pessoa desta foto em uma cabeça de personagem 3D no estilo de filme de animação, mantendo bem a semelhança com o rosto dela.

Regras:
- Apenas a cabeça, o cabelo e um pedaço curto do pescoço. Sem ombros nem corpo.
- Cabeça centralizada, de frente, reta, ocupando cerca de 75% da altura da imagem.
- Olhos bem abertos, olhando exatamente para a câmera, com as pupilas no centro dos olhos.
- Expressão neutra e simpática, boca fechada.
- Iluminação de estúdio suave, uniforme e vinda da frente, sem sombras fortes.
- Fundo totalmente transparente.
- Imagem quadrada, 1024 x 1024.
```

Peça ajustes na mesma conversa até ficar parecido com você. Quando aprovar, baixe o PNG e salve como `2-mae/rest.png`.

**Feito em 06/11/2026:** a imagem-mãe é a versão 3D com óculos (`2-mae/rest.png`, 1254 x 1254, fundo transparente).

**Daqui em diante, nunca mude a imagem-mãe.** Se mudar, todas as expressões precisam ser refeitas.

## Etapa 2: as expressões (ChatGPT)

Para **cada** expressão:

1. Abra uma **conversa nova**. Não emende uma edição na outra, porque o rosto vai mudando aos poucos.
2. Envie a imagem-mãe (`rest.png`).
3. Cole o modelo abaixo, trocando `[EXPRESSÃO]` pelo texto da tabela.
4. Salve o resultado em `3-chatgpt/` com o nome da tabela.

```text
Edite esta imagem. Mude SOMENTE isto: [EXPRESSÃO].

Não mude mais nada: mesmo personagem, mesmo formato de rosto, mesmo tamanho e posição da cabeça, mesmo enquadramento, mesmo cabelo, mesma iluminação, mesmas cores e fundo transparente. O resultado deve ter exatamente o mesmo tamanho da imagem original.

A cabeça continua de frente, reta e parada: não gire, não incline e não vire o rosto. As sobrancelhas e os olhos ficam iguais, a não ser que a expressão peça para mudá-los.
```

**Dica importante:** se o ChatGPT mostrar a opção de **selecionar uma área** da imagem para editar, pinte só a parte que muda (por exemplo, só a boca para o beijo). Assim ele não redesenha o resto do rosto.

**Como saber se serviu:** a cabeça precisa estar na mesma posição da imagem-mãe, de frente. Se ela vier virada ou inclinada, não serve, mesmo que a expressão tenha ficado boa.

### Teste (faça só esta primeiro)

| Nome do arquivo | [EXPRESSÃO] |
|---|---|
| `kiss.png` | os lábios fazem bico de beijo, com os olhos abertos olhando para a câmera |

### Olhares (fazer depois do beijo)

Selecione **só os dois olhos** (se a opção de área existir). A cabeça, as sobrancelhas e a boca ficam iguais.

| Nome do arquivo | [EXPRESSÃO] |
|---|---|
| `olhar-e.png` | os dois olhos olham para o lado direito da imagem, com as pálpebras como estão |
| `olhar-w.png` | os dois olhos olham para o lado esquerdo da imagem, com as pálpebras como estão |
| `olhar-n.png` | os dois olhos olham para cima |
| `olhar-s.png` | os dois olhos olham para baixo |
| `olhar-ne.png` | os dois olhos olham para cima e para o lado direito da imagem |
| `olhar-nw.png` | os dois olhos olham para cima e para o lado esquerdo da imagem |
| `olhar-se.png` | os dois olhos olham para baixo e para o lado direito da imagem |
| `olhar-sw.png` | os dois olhos olham para baixo e para o lado esquerdo da imagem |
| `half.png` | os olhos ficam semicerrados, com as pálpebras cobrindo metade da íris, olhando para frente |
| `closed.png` | os olhos ficam totalmente fechados, relaxados, como piscando |

São 8 direções em vez de 16: o site usa a direção mais próxima, e a diferença quase não aparece.

Depois do teste, se o resultado for aprovado, a lista das outras expressões entra aqui.
