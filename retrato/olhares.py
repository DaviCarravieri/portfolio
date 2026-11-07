"""Gera os olhares a partir da imagem-mãe, movendo a íris dentro do olho.

Nada fora dos olhos muda, então as imagens ficam alinhadas por construção.

Uso:
    .venv/Scripts/python.exe retrato/olhares.py            # todos os olhares
    .venv/Scripts/python.exe retrato/olhares.py w e s      # só alguns

Saídas em retrato/5-olhares/<nome>.png
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent
MAE = RAIZ / "2-mae" / "rest.png"
SAIDA = RAIZ / "5-olhares"

# medidas na imagem-mãe (1254 x 1254), em pixels
PUPILAS = [(517, 608), (747, 603)]   # olho do lado esquerdo e do lado direito da imagem
RAIO_IRIS = 31
CAIXA = (70, 34)                     # meia-largura e meia-altura da busca pela abertura do olho

# deslocamento da íris por direção (x para a direita da imagem, y para baixo), em pixels
ALCANCE_X, ALCANCE_Y = 24, 6
DIRECOES = {}
for i, nome in enumerate(['e', 'ene', 'ne', 'nne', 'n', 'nnw', 'nw', 'wnw', 'w', 'wsw', 'sw', 'ssw', 's', 'sse', 'se', 'ese']):
    ang = i * np.pi / 8
    DIRECOES[nome] = (np.cos(ang) * ALCANCE_X, -np.sin(ang) * ALCANCE_Y)


def abertura_do_olho(rgb, cx, cy):
    """Máscara da parte visível do olho (branco + íris), entre as pálpebras."""
    hx, hy = CAIXA
    sub = rgb[cy - hy:cy + hy, cx - hx:cx + hx]
    hsv = cv2.cvtColor(sub, cv2.COLOR_RGB2HSV).astype(int)
    # o branco do olho fica levemente colorido pela lente: claro, mas não saturado como a pele
    branco = (hsv[..., 2] > 140) & (hsv[..., 1] < 105)
    iris = np.zeros(sub.shape[:2], np.uint8)
    cv2.circle(iris, (hx, hy), RAIO_IRIS, 1, -1)
    escuro = (hsv[..., 2] < 150) & iris.astype(bool)
    m = (branco | escuro).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    n, rot, stats, _ = cv2.connectedComponentsWithStats(m)
    alvo = rot[hy, hx]
    m = (rot == alvo).astype(np.uint8)
    # preenche buracos (reflexo da íris) e suaviza
    cont, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cheia = np.zeros_like(m)
    cv2.drawContours(cheia, cont, -1, 1, -1)
    cheia = cv2.erode(cheia, np.ones((3, 3), np.uint8))
    return cheia.astype(bool)


def reflexo_das_lentes(sub):
    """Reflexos azulados/brancos do vidro: ficam parados, por cima de tudo."""
    r, g, b = [sub[..., i].astype(int) for i in range(3)]
    return ((b > r + 15) & (b > 120)) | ((r > 225) & (g > 225) & (b > 225))


def olhar(rgba, dx, dy):
    saida = rgba.copy()
    rgb = rgba[..., :3]
    hx, hy = CAIXA
    for cx, cy in PUPILAS:
        x0, y0 = cx - hx, cy - hy
        sub = rgb[y0:y0 + 2 * hy, x0:x0 + 2 * hx].copy()
        abertura = abertura_do_olho(rgb, cx, cy)

        disco = np.zeros(sub.shape[:2], np.uint8)
        cv2.circle(disco, (hx, hy), RAIO_IRIS + 2, 255, -1)
        disco = disco * abertura   # só a parte da íris que aparece; nunca leva pálpebra junto
        # olho sem íris: o branco é reconstruído onde a íris estava
        vazio = cv2.inpaint(sub, (disco > 0).astype(np.uint8) * 255 & (abertura * 255).astype(np.uint8), 7, cv2.INPAINT_TELEA)

        # íris recortada e movida
        M = np.float32([[1, 0, dx], [0, 1, dy]])
        iris_movida = cv2.warpAffine(sub, M, (sub.shape[1], sub.shape[0]), flags=cv2.INTER_CUBIC)
        disco_movido = cv2.warpAffine(cv2.GaussianBlur(disco.astype(np.float32) / 255, (0, 0), 1.2), M,
                                      (sub.shape[1], sub.shape[0]))

        visivel = cv2.GaussianBlur(abertura.astype(np.float32), (0, 0), 1.0)
        a = (disco_movido * visivel)[..., None]
        novo = vazio * (1 - a) + iris_movida * a

        refl = reflexo_das_lentes(sub)
        novo[refl] = sub[refl]
        m3 = visivel[..., None]
        saida[y0:y0 + 2 * hy, x0:x0 + 2 * hx, :3] = (sub * (1 - m3) + novo * m3).round().clip(0, 255).astype(np.uint8)
    return saida


def main():
    mae = np.asarray(Image.open(MAE).convert("RGBA"))
    nomes = sys.argv[1:] or list(DIRECOES)
    SAIDA.mkdir(exist_ok=True)
    for nome in nomes:
        dx, dy = DIRECOES[nome]
        Image.fromarray(olhar(mae, dx, dy), "RGBA").save(SAIDA / f"{nome}.png")
        print(f"{nome}: íris movida {dx:+.0f}, {dy:+.0f} px")


if __name__ == "__main__":
    main()
