#!/usr/bin/env python3
"""
Tercera talla de los renders, y el `srcset` dice la verdad.

POR QUE EXISTE. El sitio declaraba `1600w` y `2560w` para TODAS las imagenes
sin mirar cuanto miden de verdad, y dos cosas salian mal:

1. Solo habia dos tallas y ninguna por debajo de 1600. Un telefono de 390 px
   que necesita 780 se llevaba la de 1600 igual. Medido a 390 px: 2,21 MB
   hasta que la pagina esta lista.
2. En 13 imagenes el archivo `@2x` mide LOS MISMOS PIXELES que la base y pesa
   mas (ruitoque-01: las dos a 1536 px, 347 KB contra 424). Al declararlas
   como `2560w`, cualquier pantalla densa se llevaba la pesada sin ganar un
   solo pixel. Son 2 MB regalados.

QUE HACE. Escribe una talla de 900 px por imagen, mide las tres de verdad y
reescribe el mapa `TALLAS` dentro de `index.html`, que es de donde el sitio
arma cada `srcset`. Asi el navegador elige con datos ciertos y una talla que
no aporta nada deja de ofrecerse.

    python herramientas/preparar-tallas.py
"""
import glob, json, os, re, sys
from PIL import Image

RAIZ    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RENDERS = os.path.join(RAIZ, 'assets', 'renders')
HTML    = os.path.join(RAIZ, 'index.html')
ANCHO_SM = 900
CALIDAD  = 82

def main():
    bases = sorted(f for f in glob.glob(os.path.join(RENDERS, '*.webp'))
                   if '@2x' not in f and '@sm' not in f)
    if not bases:
        sys.exit('No hay renders en assets/renders')

    tallas, escritas, saltadas, sin2x = {}, 0, 0, 0
    for base in bases:
        clave = os.path.basename(base)[:-5]
        dos   = base.replace('.webp', '@2x.webp')
        sm    = base.replace('.webp', '@sm.webp')

        with Image.open(base) as im:
            w_base = im.size[0]
        w_2x = 0
        if os.path.exists(dos):
            with Image.open(dos) as im:
                w_2x = im.size[0]
        # Una talla que no es MAS ANCHA que la anterior no se ofrece: solo
        # pesaria mas. Es el caso de las 13 que estaban duplicadas.
        if w_2x <= w_base:
            w_2x = 0
            sin2x += 1

        # La pequeña se saca de la mas grande que haya, para no reescalar dos
        # veces la misma perdida.
        origen = dos if w_2x else base
        if w_base <= ANCHO_SM * 1.15:
            # Ya es casi tan pequeña como la que ibamos a escribir: no vale la
            # pena un archivo mas.
            w_sm = 0
            saltadas += 1
            if os.path.exists(sm):
                os.remove(sm)
        else:
            with Image.open(origen) as im:
                alto = round(im.size[1] * ANCHO_SM / im.size[0])
                im.convert('RGB').resize((ANCHO_SM, alto), Image.LANCZOS) \
                  .save(sm, 'WEBP', quality=CALIDAD, method=6)
            w_sm = ANCHO_SM
            escritas += 1

        tallas[clave] = [w_sm, w_base, w_2x]

    # El mapa se escribe DENTRO del index.html: el sitio es un solo archivo y
    # un JSON aparte seria una peticion mas justo antes de poder elegir imagen.
    compacto = '{' + ','.join(f'"{k}":[{a},{b},{c}]' for k, (a, b, c) in tallas.items()) + '}'
    html = open(HTML, encoding='utf-8').read()
    nuevo, n = re.subn(r'const TALLAS = \{.*?\};',
                       f'const TALLAS = {compacto};', html, count=1, flags=re.S)
    if not n:
        sys.exit('No se encontro `const TALLAS = {...};` en index.html')
    open(HTML, 'w', encoding='utf-8').write(nuevo)

    peso = sum(os.path.getsize(f) for f in glob.glob(os.path.join(RENDERS, '*@sm.webp')))
    print(f'{escritas} tallas de {ANCHO_SM} px escritas ({peso/1048576:.1f} MB)')
    print(f'{saltadas} imagenes ya eran pequeñas y no la necesitan')
    print(f'{sin2x} imagenes dejan de ofrecer @2x porque no era mas ancha que la base')
    print(f'mapa TALLAS reescrito en index.html ({len(compacto)/1024:.1f} KB)')

if __name__ == '__main__':
    main()
