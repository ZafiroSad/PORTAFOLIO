"""
Recortes de las laminas estructurales para la seccion Estructuras.

POR QUE EXISTE. Las laminas emitidas llevan el rotulo de la oficina y el nombre
del ingeniero revisor. El portafolio es publico y muestra el trabajo de Kevin,
asi que (decision del Señor Stick, 2026-11-25) van RECORTADAS sin rotulo y con
cualquier linea de texto que nombre a terceros tapada en blanco ANTES de
rasterizar. Cada recorte se escribe a 2560 px (@2x) y 1600 px (base), con el
mismo nombre que usan los renders: assets/renders/<arch>-NN.webp.

Despues correr `python herramientas/preparar-tallas.py` para la talla de 900.

    python herramientas/preparar-laminas.py
"""
import os
import fitz, sys, io
from PIL import Image
R=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),"assets","renders")
G=r"C:\Users\kevin\Documents\KEVIN\02. WORK\01. PROYECTOS\02. EST\03. GAMBITA\02_STR\99_PRO\GAMBITA - EST - REV-11.pdf"
L=r"C:\Users\kevin\Documents\KEVIN\02. WORK\01. PROYECTOS\02. EST\02. LOTE 132 - LOMA RESERVA\99_OTROS\ENTREGABLES\REV-4\LOTE 132 - LOMA RESERVA - EST - REV-4.pdf"
F=(.015,.025,.985,.862)
lista=[('gambita',G,[(1,(.585,.30,.865,.68)),(2,F),(3,F),(5,F),(8,F),(9,(.015,.025,.985,.62)),(10,F),(11,F),(9,(.01,.025,.37,.62)),(10,(.57,.40,.90,.86))]),
       ('lote132',L,[(5,F),(4,F),(2,F),(6,F),(3,F),(7,(.02,.2,.6,.72)),(8,F),(4,(.2,.12,.72,.80))])]
for arch,pdf,cs in lista:
    d=fitz.open(pdf)
    for pg_ in d:
        for b in pg_.get_text('dict')['blocks']:
            for l in b.get('lines',[]):
                t=''.join(sp['text'] for sp in l['spans'])
                if any(w in t for w in ('Nicol','Moreno','Acevedo')):
                    pg_.add_redact_annot(fitz.Rect(l['bbox']),fill=(1,1,1))
        pg_.apply_redactions(images=0,graphics=0)
    for n,(pg,(x0,y0,x1,y1)) in enumerate(cs,1):
        p=d[pg-1]; r=p.rect
        clip=fitz.Rect(r.width*x0,r.height*y0,r.width*x1,r.height*y1)
        dpi=2560/(clip.width/72)*1.0
        pix=p.get_pixmap(dpi=int(dpi)+1,clip=clip,alpha=False)
        im=Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
        im=im.resize((2560,round(im.height*2560/im.width)),Image.LANCZOS)
        k=f"{R}/{arch}-{n:02d}"
        im.save(k+'@2x.webp','WEBP',quality=88,method=6)
        im.resize((1600,round(im.height*1600/2560)),Image.LANCZOS).save(k+'.webp','WEBP',quality=86,method=6)
        print(k.split('/')[-1],im.size)
