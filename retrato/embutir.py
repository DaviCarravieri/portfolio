"""Gera retrato/web/*.webp (versões leves para o site online) e retrato/imagens.js com todas as imagens do retrato dentro do arquivo (base64, WebP).

Assim o prototipo.html funciona completo (com a pele elástica) mesmo aberto com dois cliques,
porque o navegador não deixa o WebGL ler imagens soltas do disco, mas deixa ler imagens embutidas.

Rode de novo sempre que entrar uma imagem nova:
    .venv/Scripts/python.exe -I retrato/embutir.py
"""
import base64
import io
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent
IMAGENS = {
    "rest": "2-mae/rest.png",
    "kiss": "4-alinhadas/kiss.png",
    "desconfiado": "4-alinhadas/desconfiado.png",
    **{d: f"4-alinhadas/olhar-{d}.png" for d in "e ne n nw w sw s se".split()},
    "half": "4-alinhadas/half.png",
    "closed": "4-alinhadas/closed.png",
}

WEB = RAIZ / "web"          # versões leves usadas pelo site online
WEB.mkdir(exist_ok=True)
linhas = []
for nome, caminho in IMAGENS.items():
    arq = RAIZ / caminho
    if not arq.exists():
        print(f"(pulei {caminho}: ainda não existe)")
        continue
    img = Image.open(arq).convert("RGBA").resize((1024, 1024), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=92, method=6)
    (WEB / f"{nome}.webp").write_bytes(buf.getvalue())
    linhas.append(f'  {nome}: "data:image/webp;base64,{base64.b64encode(buf.getvalue()).decode()}",')
    print(f"{nome}: {buf.tell() // 1024} KB")

saida = RAIZ / "imagens.js"
saida.write_text("// gerado por embutir.py, não editar\nwindow.RETRATO_IMGS = {\n" + "\n".join(linhas) + "\n};\n", encoding="utf-8")
print(f"salvo em {saida} ({saida.stat().st_size // 1024} KB)")
