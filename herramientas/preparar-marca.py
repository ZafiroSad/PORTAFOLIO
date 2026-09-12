# -*- coding: utf-8 -*-
"""
Deriva del logotipo maestro todas las piezas de marca que usa el sitio.

Entra `assets/marca/stick-industries.svg` (lo produce vectorizar-logo.py) y salen:

  isotipo.svg        la flecha sola, sin fondo, en currentColor
  favicon.svg        el isotipo en claro sobre una tarjeta grafito redondeada
  favicon-32.png     para pestanas viejas que no leen SVG
  favicon-180.png    icono de pantalla de inicio en iOS
  favicon-512.png    icono de instalacion (PWA / Android)

Por que un isotipo aparte: el logotipo entero mide 4176 x 1150 y a 32 px se
convierte en un pelo horizontal ilegible. El isotipo es la flecha con la cola
CORTADA — no recortada por el borde del cuadro, que se lee como accidente, sino
cortada de verdad en el poligono (algoritmo de Sutherland-Hodgman) para que
termine en un canto recto dentro del encuadre.
"""
from pathlib import Path
import re

import cairosvg

BASE = Path(__file__).resolve().parent.parent / "assets" / "marca"
MAESTRO = BASE / "stick-industries.svg"

# Donde se corta la cola, en FRACCION del ancho del logo — no en pixeles.
# Asi el isotipo sigue saliendo igual si el logotipo cambia de proporciones,
# que es exactamente lo que paso al actualizarlo.
CORTE_REL = 0.77
MARGEN = 1.26           # aire alrededor del isotipo dentro del cuadrado
GRAFITO = "#15161b"     # la base del sitio; el favicon es una tarjeta de ese tono
CLARO = "#f2f2f2"


def flecha() -> list[tuple[float, float]]:
    """Puntos del path `logo-flecha` del maestro."""
    # El espacio antes de la d importa: sin el, el patron encaja tambien dentro
    # de id="logo-flecha" y devuelve ese texto como si fuera geometria.
    texto = MAESTRO.read_text(encoding="utf-8")
    d = re.search(r'id="logo-flecha"[^>]*\sd="([^"]+)"', texto).group(1)
    ancho = float(re.search(r'viewBox="0 0 ([\d.]+)', texto).group(1))
    puntos = [(float(a), float(b)) for a, b in re.findall(r"(-?[\d.]+) (-?[\d.]+)", d)]
    return puntos, ancho * CORTE_REL


def recorta_izquierda(poly, x_corte):
    """Deja del poligono solo lo que queda a la derecha de x_corte."""
    salida = []
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        da, db = a[0] - x_corte, b[0] - x_corte
        if da >= 0:
            salida.append(a)
        if (da >= 0) != (db >= 0):          # la arista cruza la linea de corte
            t = da / (da - db)
            salida.append((x_corte, a[1] + t * (b[1] - a[1])))
    return salida


def main() -> None:
    puntos, corte = flecha()
    p = recorta_izquierda(puntos, corte)
    xs = [q[0] for q in p]
    ys = [q[1] for q in p]
    lado = max(max(xs) - min(xs), max(ys) - min(ys)) * MARGEN
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    x0, y0 = cx - lado / 2, cy - lado / 2
    vb = f"{x0:.0f} {y0:.0f} {lado:.0f} {lado:.0f}"
    d = "M " + " L ".join(f"{a:.1f} {b:.1f}" for a, b in p) + " Z"

    iso = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="currentColor">'
           f'<path d="{d}"/></svg>\n')
    (BASE / "isotipo.svg").write_text(iso, encoding="utf-8")

    # Version con el color escrito: dentro de un <img> el SVG es un documento
    # aparte y `currentColor` no hereda nada, asi que saldria negro.
    (BASE / "isotipo-claro.svg").write_text(
        iso.replace('fill="currentColor"', f'fill="{CLARO}"'), encoding="utf-8")

    favi = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">'
            f'<rect x="{x0:.0f}" y="{y0:.0f}" width="{lado:.0f}" height="{lado:.0f}" '
            f'rx="{lado * 0.19:.0f}" fill="{GRAFITO}"/>'
            f'<path fill="{CLARO}" d="{d}"/></svg>\n')
    (BASE / "favicon.svg").write_text(favi, encoding="utf-8")

    for px in (32, 180, 512):
        cairosvg.svg2png(bytestring=favi.encode(), write_to=str(BASE / f"favicon-{px}.png"),
                         output_width=px, output_height=px)

    for f in sorted(BASE.glob("favicon*")) + sorted(BASE.glob("isotipo*")):
        print(f"{f.name:22s} {f.stat().st_size / 1024:6.1f} KB")


if __name__ == "__main__":
    main()
