# -*- coding: utf-8 -*-
"""
Vectoriza el logotipo STICK INDUSTRIES desde su PNG de origen y escribe un SVG.

Por que existe: del logo solo hay un PNG de 1774x887 px, y un logotipo tiene que
poder crecer sin pixelarse (portada, favicon, marca de agua de video). Aqui se
trazan los contornos de la tinta y se guardan como curvas, no como pixeles.

Como funciona, en tres pasos:
  1. `find_contours` recorre la frontera entre tinta y fondo sobre el gris
     ORIGINAL, sin ampliar. Interpola entre pixeles vecinos, asi que el borde
     queda con precision de fraccion de pixel (algoritmo de marching squares).
     Ampliar antes con Lanczos parecia mejor y era peor: los trazos finisimos de
     "INDUSTRIES" se difuminaban y cerraban la panza de la D y el ojo de la R.
  2. Cada contorno se adelgaza con Douglas-Peucker (quita puntos que no cambian
     la forma) y se escribe como un `path` de SVG.
  3. Las coordenadas se multiplican por ESCALA solo para que el viewBox tenga
     numeros comodos; la forma es la misma.

Los agujeros de las letras (la O, la R, la D) salen como contornos propios; con
fill-rule="evenodd" el SVG los interpreta como huecos sin tener que marcarlos.
"""
from pathlib import Path
import numpy as np
from PIL import Image
from skimage import measure

ORIGEN = Path(r"C:\Users\kevin\Documents\KEVIN\02. WORK\03. STICK INDUSTRIES\99. RECURSOS MARCA\LOGO BLANCO.png")
DESTINO = Path(__file__).resolve().parent.parent / "assets" / "marca" / "stick-industries.svg"

ESCALA = 4           # factor del viewBox (no se remuestrea la imagen)
TOLERANCIA = 0.22    # px del original; mas alto = menos puntos, forma mas tosca
UMBRAL = 128         # por debajo de este gris se considera tinta


def cargar_mascara() -> np.ndarray:
    # El PNG viene en RGBA. Se compone sobre blanco antes de pasar a gris:
    # convertir de RGBA a "L" directamente descarta el alfa y ensucia el borde
    # de las letras, que es justo lo que aqui hay que conservar limpio.
    rgba = Image.open(ORIGEN).convert("RGBA")
    lienzo = Image.new("RGB", rgba.size, (255, 255, 255))
    lienzo.paste(rgba, mask=rgba.getchannel("A"))
    im = lienzo.convert("L")
    a = np.array(im)
    ys, xs = np.nonzero(a < UMBRAL)
    # recorte al area util, con un margen de 2 px para que el contorno cierre
    im = im.crop((xs.min() - 2, ys.min() - 2, xs.max() + 3, ys.max() + 3))
    return 255.0 - np.array(im, dtype=float)   # tinta alta, fondo bajo


def punto(p) -> str:
    # find_contours devuelve (fila, columna); el SVG quiere (x, y)
    return f"{p[1]*ESCALA:.1f} {p[0]*ESCALA:.1f}"


def main() -> None:
    campo = cargar_mascara()
    alto, ancho = (d * ESCALA for d in campo.shape)

    # Las tres partes del logo se separan por la banda de altura que ocupan:
    # la flecha cruza de arriba abajo, "STICK" vive en la franja media y
    # "INDUSTRIES" en la de abajo. Se parten para poder animarlas por separado
    # en la entrada del sitio (la flecha vuela, las letras se revelan).
    partes: dict[str, list[str]] = {"flecha": [], "stick": [], "industries": []}
    for c in measure.find_contours(campo, 255 - UMBRAL):
        c = measure.approximate_polygon(c, tolerance=TOLERANCIA)
        if len(c) < 3:
            continue
        arriba = c[:, 0].min() / campo.shape[0]
        ancho_rel = (c[:, 1].max() - c[:, 1].min()) / campo.shape[1]
        if ancho_rel > 0.8:
            clave = "flecha"                    # lo unico que cruza el logo entero
        elif arriba > 0.6:
            clave = "industries"
        else:
            clave = "stick"
        partes[clave].append("M " + " L ".join(punto(p) for p in c) + " Z")

    # Cada parte va en UN solo path y con fill-rule declarado EN el path:
    #  - en un solo path, un contorno encerrado en otro se lee como agujero (la
    #    panza de la D, el ojo de la R); en paths separados no hay a quien
    #    agujerear y esas letras salen macizas;
    #  - declarado en el path y no heredado del <svg>, porque hay renderizadores
    #    que no lo heredan.
    cuerpo = "\n  ".join(
        f'<path id="logo-{k}" fill-rule="evenodd" d="{" ".join(v)}"/>'
        for k, v in partes.items() if v
    )
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ancho} {alto}" '
        f'fill="currentColor">\n  {cuerpo}\n</svg>\n'
    )
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text(svg, encoding="utf-8")
    print(" · ".join(f"{k}: {len(v)}" for k, v in partes.items()))
    print(f"-> {DESTINO}  ({DESTINO.stat().st_size/1024:.1f} KB)   viewBox 0 0 {ancho} {alto}")


if __name__ == "__main__":
    main()
