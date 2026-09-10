# -*- coding: utf-8 -*-
"""
Compone la imagen que sale cuando un enlace se pega en WhatsApp, LinkedIn o un
chat: 1200 x 630, un render al fondo y la marca encima.

Por que existe: sin `og:image` propia, quien recibe el enlace ve un recorte
automatico del render, sin marca y sin decir de quien es. Esta imagen es, en la
practica, la primera impresion del portafolio — se ve antes que el sitio.

Dos usos:

  # la del sitio: el logo grande y la firma de Kevin
  python herramientas/preparar-og.py

  # la de un proyecto: el titulo del proyecto y el logo pequeno de firma
  python herramientas/preparar-og.py --render cantabria-23-09@2x.webp \\
      --titulo "Lote 23 - Villas de Cantabria" \\
      --pie "Vivienda unifamiliar - Villas de Cantabria" \\
      --salida p/cantabria-23/og.jpg

Las de proyecto las encadena `preparar-enlaces.mjs`, que es quien conoce el
catalogo. Se regeneran solo si cambia el render de portada o el logo.
"""
import argparse
import io
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
RENDERS = RAIZ / "assets" / "renders"
LOGO = RAIZ / "assets" / "marca" / "stick-industries.svg"
# Consolas viene con Windows y es la mono mas cercana a la del sitio.
MONO = Path(r"C:\Windows\Fonts\consolab.ttf")
# Century Gothic es TIP-E, la tipografia de la marca.
TITULAR = Path(r"C:\Windows\Fonts\GOTHICB.TTF")

W, H = 1200, 630
GRAFITO = (21, 22, 27)
TINTA = (242, 242, 242)
TENUE = (196, 178, 140)      # arena: el acento propuesto para la marca


def fondo_encajado(archivo: Path) -> Image.Image:
    """El render recortado a 1200x630 sin deformarlo, tomando el centro."""
    im = Image.open(archivo).convert("RGB")
    escala = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    izq = (im.width - W) // 2
    arr = (im.height - H) // 2
    return im.crop((izq, arr, izq + W, arr + H))


def con_velo(base: Image.Image, arriba: int, abajo: int) -> Image.Image:
    """Oscurece de arriba a abajo en degradado, para que la letra se lea."""
    velo = Image.new("L", (1, H))
    for y in range(H):
        t = y / (H - 1)
        velo.putpixel((0, y), int(arriba + (abajo - arriba) * t ** 1.5))
    return Image.composite(Image.new("RGB", (W, H), GRAFITO), base, velo.resize((W, H)))


def logo_claro(ancho: int) -> Image.Image:
    """El logotipo rasterizado al ancho pedido, en claro y con alfa."""
    png = cairosvg.svg2png(url=str(LOGO), output_width=ancho)
    silueta = Image.open(io.BytesIO(png)).convert("RGBA")
    claro = Image.new("RGBA", silueta.size, TINTA + (0,))
    claro.putalpha(silueta.getchannel("A"))
    return claro


def pegar_con_sombra(base: Image.Image, capa: Image.Image, x: int, y: int) -> Image.Image:
    """Sombra suave debajo, para que la marca aguante sobre cualquier render."""
    sombra = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sombra.paste(Image.new("RGBA", capa.size, (0, 0, 0, 150)), (x, y + 6), capa)
    base = Image.alpha_composite(base.convert("RGBA"), sombra.filter(ImageFilter.GaussianBlur(14)))
    base.paste(capa, (x, y), capa)
    return base


def texto_espaciado(d: ImageDraw.ImageDraw, xy, texto, fuente, color, tracking):
    """PIL no tiene letter-spacing y el sitio separa todo lo tecnico."""
    x, y = xy
    for c in texto:
        d.text((x, y), c, font=fuente, fill=color)
        x += d.textlength(c, font=fuente) + tracking


def portada_del_sitio(salida: Path) -> None:
    base = con_velo(fondo_encajado(RENDERS / "cantabria-23-09@2x.webp"), 70, 235)
    ancho = int(W * 0.52)
    x, y = int(W * 0.08), int(H * 0.52)
    base = pegar_con_sombra(base, logo_claro(ancho), x, y)

    d = ImageDraw.Draw(base)
    d.line([(x, H - 78), (x + ancho, H - 78)], fill=(255, 255, 255, 46), width=1)
    texto_espaciado(d, (x, H - 56),
                    "KEVIN GIL   ·   INGENIERO CIVIL   ·   BUCARAMANGA",
                    ImageFont.truetype(str(MONO), 19), (228, 228, 232), 2.4)
    base.convert("RGB").save(salida, quality=88, optimize=True)


def portada_de_proyecto(render: str, titulo: str, pie: str, salida: Path) -> None:
    """Aqui manda el proyecto: el titulo grande y el logo reducido a firma."""
    base = con_velo(fondo_encajado(RENDERS / render), 40, 225)
    m = int(W * 0.07)

    # El logo, arriba a la izquierda y pequeno: firma, no protagonista.
    base = pegar_con_sombra(base, logo_claro(int(W * 0.20)), m, m - 6)

    d = ImageDraw.Draw(base)
    fuente_titulo = ImageFont.truetype(str(TITULAR), 62)
    fuente_pie = ImageFont.truetype(str(MONO), 20)

    # Si el titulo no cabe en una linea, se parte por la ultima palabra que quepa.
    lineas, actual = [], ""
    for palabra in titulo.split():
        prueba = f"{actual} {palabra}".strip()
        if d.textlength(prueba, font=fuente_titulo) > W - 2 * m and actual:
            lineas.append(actual)
            actual = palabra
        else:
            actual = prueba
    lineas.append(actual)

    y = H - m - 46 - len(lineas) * 74
    d.line([(m, y - 30), (m + 150, y - 30)], fill=TENUE, width=2)
    for linea in lineas:
        d.text((m, y), linea, font=fuente_titulo, fill=TINTA)
        y += 74
    texto_espaciado(d, (m, y + 12), pie.upper(), fuente_pie, (190, 192, 200), 2.6)

    salida.parent.mkdir(parents=True, exist_ok=True)
    base.convert("RGB").save(salida, quality=88, optimize=True)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--render", help="archivo dentro de assets/renders")
    ap.add_argument("--titulo")
    ap.add_argument("--pie")
    ap.add_argument("--salida", type=Path,
                    default=RAIZ / "assets" / "marca" / "og.jpg")
    a = ap.parse_args()

    if a.render:
        portada_de_proyecto(a.render, a.titulo, a.pie, a.salida)
    else:
        portada_del_sitio(a.salida)

    try:
        nombre = a.salida.relative_to(RAIZ)
    except ValueError:          # una salida fuera del sitio, al probar
        nombre = a.salida
    print(f"  {nombre}  {a.salida.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
