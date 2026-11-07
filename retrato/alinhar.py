"""Alinha uma expressão gerada à imagem-mãe e trava tudo o que não mudou.

Uso:
    .venv/Scripts/python.exe retrato/alinhar.py retrato/3-chatgpt/desconfiado.webp desconfiado

Saídas em retrato/4-alinhadas/:
    <nome>.png         a imagem final, inteira e alinhada à imagem-mãe
    <nome>-mascara.png  onde a imagem nova foi usada (branco) e onde ficou a mãe (preto)
"""
import argparse
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent
MAE = RAIZ / "2-mae" / "rest.png"
SAIDA = RAIZ / "4-alinhadas"


def carregar(caminho):
    return np.asarray(Image.open(caminho).convert("RGBA"))


def cinza(rgba):
    rgb = rgba[..., :3].astype(np.float32) * (rgba[..., 3:4] / 255.0)
    return cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2GRAY)


def estimar_transformacao(mae, nova):
    """Rotação, escala e deslocamento que levam a imagem nova até a mãe."""
    orb = cv2.ORB_create(6000)
    k1, d1 = orb.detectAndCompute(cinza(mae), None)
    k2, d2 = orb.detectAndCompute(cinza(nova), None)
    pares = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True).match(d1, d2)
    p1 = np.float32([k1[p.queryIdx].pt for p in pares])
    p2 = np.float32([k2[p.trainIdx].pt for p in pares])
    M, ok = cv2.estimateAffinePartial2D(p2, p1, method=cv2.RANSAC, ransacReprojThreshold=3)
    if M is None:
        raise SystemExit("Não consegui encontrar pontos em comum com a imagem-mãe.")
    escala = float(np.hypot(M[0, 0], M[1, 0]))
    angulo = float(np.degrees(np.arctan2(M[1, 0], M[0, 0])))
    return M, int(ok.sum()), escala, angulo


def mascara_de_mudanca(mae, alinhada, area_rosto):
    """Onde a expressão realmente mudou, com bordas suaves."""
    lab_m = cv2.cvtColor(mae[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)
    lab_n = cv2.cvtColor(alinhada[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)
    dif = np.linalg.norm(lab_m - lab_n, axis=2)
    dif = cv2.GaussianBlur(dif, (0, 0), 3)
    mudou = ((dif > 14) & area_rosto).astype(np.uint8)
    mudou = cv2.morphologyEx(mudou, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    # ignora manchinhas soltas, fica só com as regiões que de fato mudaram
    n, rotulos, stats, _ = cv2.connectedComponentsWithStats(mudou)
    limpa = np.zeros_like(mudou)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] > 400:
            limpa[rotulos == i] = 1
    limpa = cv2.morphologyEx(limpa, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    limpa = cv2.dilate(limpa, np.ones((21, 21), np.uint8))
    suave = cv2.GaussianBlur(limpa.astype(np.float32), (0, 0), 9)
    return np.clip(suave, 0, 1) * area_rosto


def zona_do_rosto(forma):
    """Elipse das sobrancelhas ao queixo. Cabelo, orelhas e contorno ficam sempre da mãe.

    Medida na imagem-mãe de 1254 x 1254: sobrancelhas em y ~ 520, queixo em y ~ 1060.
    O topo fica bem acima das sobrancelhas para não cortar uma sobrancelha levantada.
    """
    h, w = forma[:2]
    zona = np.zeros((h, w), np.float32)
    centro = (int(w * 0.502), int(h * 0.59))
    eixos = (int(w * 0.23), int(h * 0.29))
    cv2.ellipse(zona, centro, eixos, 0, 0, 360, 1.0, -1)
    return cv2.GaussianBlur(zona, (0, 0), 14)


def ajustar_cor(mae, alinhada, area_igual):
    """Corrige o tom de pele/luz da imagem nova usando a região que não mudou."""
    saida = alinhada[..., :3].astype(np.float32).copy()
    for c in range(3):
        x = alinhada[..., c][area_igual].astype(np.float32)
        y = mae[..., c][area_igual].astype(np.float32)
        a, b = np.polyfit(x, y, 1)
        saida[..., c] = saida[..., c] * a + b
    return np.clip(saida, 0, 255)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("imagem")
    ap.add_argument("nome")
    args = ap.parse_args()

    mae = carregar(MAE)
    nova = carregar(args.imagem)
    if nova.shape != mae.shape:
        nova = np.asarray(Image.fromarray(nova).resize((mae.shape[1], mae.shape[0]), Image.LANCZOS))

    M, pontos, escala, angulo = estimar_transformacao(mae, nova)
    alinhada = cv2.warpAffine(nova, M, (mae.shape[1], mae.shape[0]), flags=cv2.INTER_LANCZOS4,
                              borderMode=cv2.BORDER_REPLICATE)

    silhueta = mae[..., 3] > 200
    area_rosto = cv2.erode(silhueta.astype(np.uint8), np.ones((31, 31), np.uint8)).astype(bool)
    mascara = mascara_de_mudanca(mae, alinhada, area_rosto) * zona_do_rosto(mae.shape)
    area_igual = area_rosto & (mascara < 0.01)

    cor = ajustar_cor(mae, alinhada, area_igual)
    m = mascara[..., None]
    rgb = mae[..., :3] * (1 - m) + cor * m
    final = np.dstack([rgb.round().astype(np.uint8), mae[..., 3]])

    SAIDA.mkdir(exist_ok=True)
    Image.fromarray(final, "RGBA").save(SAIDA / f"{args.nome}.png")
    Image.fromarray((mascara * 255).astype(np.uint8)).save(SAIDA / f"{args.nome}-mascara.png")

    print(f"pontos em comum: {pontos}")
    print(f"correção aplicada: escala {escala:.4f}, rotação {angulo:+.2f}°, "
          f"deslocamento x {M[0, 2]:+.1f} px, y {M[1, 2]:+.1f} px")
    print(f"área trocada: {mascara.mean() * 100:.1f}% da imagem")
    print(f"salvo em {SAIDA / (args.nome + '.png')}")


if __name__ == "__main__":
    main()
