"""
Piezas de las laminas estructurales para la seccion Estructuras.

POR QUE EXISTE. Las laminas emitidas llevan el rotulo de la oficina y el nombre
del ingeniero revisor. El portafolio es publico y muestra el trabajo de Kevin,
asi que (decision del Señor Stick, 2026-11-25) van RECORTADAS sin rotulo y con
cualquier linea de texto que nombre a terceros tapada en blanco ANTES de
rasterizar.

TRATAMIENTO (v37). El Señor Stick rechazo los recortes tal cual: «no se puede
ver como un PNG ahi encima; si no es profesional, no lo quiero». Cada pieza
lleva un modo:
  escena  la isometria de Revit sobre un fondo oscuro con luz central y sombra
          de contacto, como una toma de estudio (el blanco del papel se vuelve
          fondo; los grises del modelo se conservan).
  plano   el dibujo en negativo: trazo claro sobre el negro del sitio. El
          acero y las cotas de color conservan su tono, aclarado.
Asi la pieza se funde con la pagina en vez de flotar como una hoja blanca.

Los recortes son fracciones de la pagina TAL COMO SE VE (algunas vienen
rotadas: se renderiza entera y se recorta despues).

Se escribe a 2560 px (@2x) y 1600 px (base) en assets/renders/<arch>-NN.webp.
Despues correr `python herramientas/preparar-tallas.py`.

    python herramientas/preparar-laminas.py
"""
import io
import os

import fitz
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

R = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "renders")
G = r"C:\Users\kevin\Documents\KEVIN\02. WORK\01. PROYECTOS\02. EST\03. GAMBITA\02_STR\99_PRO\GAMBITA - EST - REV-11.pdf"
L = r"C:\Users\kevin\Documents\KEVIN\02. WORK\01. PROYECTOS\02. EST\02. LOTE 132 - LOMA RESERVA\99_OTROS\ENTREGABLES\REV-4\LOTE 132 - LOMA RESERVA - EST - REV-4.pdf"
F = (.015, .025, .985, .862)          # la hoja entera sin el rotulo
TERCEROS = ('Nicol', 'Moreno', 'Acevedo')

# (pagina, recorte, modo) en el orden en que salen: la 01 es la portada.
LISTA = [
    ('gambita', G, [
        (1, (.585, .30, .865, .68), 'escena'),   # isometria del modelo
        (10, (.585, .415, .895, .79), 'plano'),  # isometria en alambre
        (10, (.045, .555, .375, .835), 'plano'), # placa facil, isometrico
        (9, (.01, .025, .37, .62), 'plano'),     # corte de escalera
        (9, (.015, .025, .985, .62), 'plano'),   # escaleras
        (8, F, 'plano'),                         # despiece de vigas
        (5, F, 'plano'),                         # columnas
        (2, F, 'plano'),                         # cimentacion
        (3, F, 'plano'),                         # localizacion de columnas
    ]),
    ('lote132', L, [
        (4, (.2, .12, .72, .80), 'plano'),       # planta de entrepiso
        (4, F, 'plano'),
        (5, F, 'plano'),
        (2, F, 'plano'),
        (6, F, 'plano'),
        (3, F, 'plano'),
        (7, (.02, .2, .6, .72), 'plano'),
        (8, F, 'plano'),
    ]),
]

FONDO = np.array([9, 9, 11], float)       # casi el --base del sitio
TRAZO = np.array([226, 229, 234], float)


def plano(a):
    """Negativo: el papel pasa a FONDO, la tinta a TRAZO; el color se aclara."""
    lum = a @ [.299, .587, .114]
    v = np.clip((255 - lum) / 255 * 1.15, 0, 1) ** .9
    out = FONDO + v[..., None] * (TRAZO - FONDO)
    color = (a.max(2) - a.min(2)) > 45
    return np.where(color[..., None], a * .55 + 255 * .45, out)


def escena(a):
    """El papel (casi blanco) se vuelve fondo con luz central y sombra."""
    lum = a @ [.299, .587, .114]
    obj = ndimage.binary_opening(lum <= 240, iterations=1)
    h, w = lum.shape
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.sqrt(((xx - w * .5) / w) ** 2 + ((yy - h * .46) / h) ** 2)
    luz = np.clip(1 - r / .75, 0, 1) ** 1.6
    fondo = FONDO + luz[..., None] * (np.array([46, 48, 54]) - FONDO)
    sombra = Image.fromarray((obj * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(w * .02))
    sombra = np.roll(np.asarray(sombra, float) / 255, int(h * .025), 0)
    fondo *= (1 - .65 * sombra)[..., None]
    return np.where(obj[..., None], a * .93, fondo)


for arch, pdf, piezas in LISTA:
    d = fitz.open(pdf)
    for pg in d:
        for b in pg.get_text('dict')['blocks']:
            for ln in b.get('lines', []):
                if any(w in ''.join(s['text'] for s in ln['spans']) for w in TERCEROS):
                    pg.add_redact_annot(fitz.Rect(ln['bbox']), fill=(1, 1, 1))
        pg.apply_redactions(images=0, graphics=0)
    cache = {}
    for n, (num, (x0, y0, x1, y1), modo) in enumerate(piezas, 1):
        p = d[num - 1]
        ancho = p.rect.width * (x1 - x0)                 # rect ya viene rotado
        dpi = int(2560 / (ancho / 72)) + 1
        if (num, dpi) not in cache:
            pix = p.get_pixmap(dpi=dpi, alpha=False)
            cache[(num, dpi)] = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
        hoja = cache[(num, dpi)]
        W, H = hoja.size
        im = hoja.crop((round(W * x0), round(H * y0), round(W * x1), round(H * y1)))
        im = im.resize((2560, round(im.height * 2560 / im.width)), Image.LANCZOS)
        a = np.asarray(im, float)
        im = Image.fromarray((escena(a) if modo == 'escena' else plano(a)).clip(0, 255).astype('uint8'))
        k = os.path.join(R, f"{arch}-{n:02d}")
        im.save(k + '@2x.webp', 'WEBP', quality=88, method=6)
        im.resize((1600, round(im.height * 1600 / 2560)), Image.LANCZOS).save(k + '.webp', 'WEBP', quality=86, method=6)
        print(os.path.basename(k), modo, im.size)
        cache = {key: v for key, v in cache.items() if key[0] == num}
