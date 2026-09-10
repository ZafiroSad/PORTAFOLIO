# -*- coding: utf-8 -*-
"""
Compone la imagen que sale cuando el enlace se pega en WhatsApp, LinkedIn o
un chat: 1200 x 630, el render de portada al fondo y el logo encima.

Por que existe: sin `og:image` propia, quien recibe el enlace ve un recorte
automatico del render, sin marca y sin decir de quien es. Esta imagen es, en
la practica, la primera impresion del portafolio — se ve antes que el sitio.

Se genera una sola vez y queda versionada; solo hay que volver a correrlo si
cambia el render de portada o el logo.
"""
from pathlib import Path
import io

import cairosvg
from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FONDO = RAIZ / "assets" / "renders" / "cantabria-23-09@2x.webp"
LOGO = RAIZ / "assets" / "marca" / "stick-industries.svg"
DESTINO = RAIZ / "assets" / "marca" / "og.jpg"
# Consolas viene con Windows y es la mono mas cercana a la del sitio.
FUENTE_MONO = Path(r"C:\Windows\Fonts\consolab.ttf")

W, H = 1200, 630
GRAFITO = (21, 22, 27)


def fondo_encajado() -> Image.Image:
    """El render recortado a 1200x630 sin deformarlo, tomando el centro."""
    im = Image.open(FONDO).convert("RGB")
    escala = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    izq = (im.width - W) // 2
    arr = (im.height - H) // 2
    return im.crop((izq, arr, izq + W, arr + H))


def main() -> None:
    base = fondo_encajado()

    # Un velo que baja de casi transparente arriba a casi opaco abajo: el
    # render se sigue viendo y el logo se lee sin pelear con la imagen.
    velo = Image.new("L", (1, H))
    for y in range(H):
        t = y / (H - 1)
        velo.putpixel((0, y), int(70 + 165 * t ** 1.5))
    velo = velo.resize((W, H))
    base = Image.composite(Image.new("RGB", (W, H), GRAFITO), base, velo)

    # El logo, blanco, a poco mas de la mitad del ancho.
    ancho_logo = int(W * 0.52)
    png = cairosvg.svg2png(url=str(LOGO), output_width=ancho_logo)
    logo = Image.open(io.BytesIO(png)).convert("RGBA")
    blanco = Image.new("RGBA", logo.size, (242, 242, 242, 0))
    blanco.putalpha(logo.getchannel("A"))

    # Sombra suave debajo, para que aguante sobre cualquier zona del render.
    sombra = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    x, y = int(W * 0.08), int(H * 0.52)
    sombra.paste(Image.new("RGBA", logo.size, (0, 0, 0, 150)).convert("RGBA"),
                 (x, y + 6), blanco)
    sombra = sombra.filter(ImageFilter.GaussianBlur(14))
    base = Image.alpha_composite(base.convert("RGBA"), sombra)
    base.paste(blanco, (x, y), blanco)

    # Filo y firma al pie: el logo dice la marca, esta linea dice quien es.
    d = ImageDraw.Draw(base)
    d.line([(x, H - 78), (x + ancho_logo, H - 78)], fill=(255, 255, 255, 46), width=1)
    fuente = ImageFont.truetype(str(FUENTE_MONO), 19)
    firma = "KEVIN GIL   ·   INGENIERO CIVIL   ·   BUCARAMANGA"
    # El tracking se hace a mano: PIL no tiene letter-spacing, y sin el la
    # linea no casa con la retorica del sitio, que separa todo lo tecnico.
    cursor = x
    for c in firma:
        d.text((cursor, H - 56), c, font=fuente, fill=(228, 228, 232))
        cursor += d.textlength(c, font=fuente) + 2.4

    base.convert("RGB").save(DESTINO, quality=88, optimize=True)
    print(f"{DESTINO.name}  {DESTINO.stat().st_size/1024:.0f} KB  {W}x{H}")


if __name__ == "__main__":
    main()
