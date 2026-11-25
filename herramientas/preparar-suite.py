"""
Saca los iconos de las aplicaciones para la seccion Herramientas.

DE DONDE SALEN. Cada app guarda su LOGO.png a 2000x2000 en su propia carpeta:
un icono blanco sobre gris 31 (#1F1F1F). Es el mismo archivo que la app lleva
instalada, no una version redibujada aparte.

QUE SE LES HACE. Tres cosas, y las tres importan:
  1. El gris de fondo se convierte en transparencia calculando el alfa como
     cuanto se aleja cada pixel del fondo. Asi se conserva el antialiasing del
     borde; un umbral duro dejaria el contorno dentado.
  2. Se recorta al contenido real. Los seis vienen con distinto aire alrededor,
     y sin igualarlo unos se ven grandes y otros pequenos en la misma rejilla.
  3. Se deja el pixel en blanco puro con ese alfa, de modo que el color lo
     pueda poner el CSS por encima.

    python herramientas/preparar-suite.py
"""
from pathlib import Path
import numpy as np
from PIL import Image

SUITE = Path(r"C:\Users\kevin\Documents\KEVIN\02. WORK\03. STICK INDUSTRIES\01. STICK SUITE")
DESTINO = Path(__file__).resolve().parent.parent / "assets" / "suite"

INDUSTRIES = SUITE.parent

# ATLAS, VIAS y DLI no estan: no tienen icono dibujado y en el sitio van con
# su inicial. Las apps viven en carpetas numeradas (`01. STICK AROS`...), asi
# que la ruta va completa. STICK PRO no tiene LOGO.png: su isotipo blanco sobre
# transparente sale de su carpeta de marca y da el mismo alfa.
APPS = {
    "aros":     SUITE / "01. STICK AROS" / "LOGO.png",
    "assets":   SUITE / "02. STICK ASSETS" / "LOGO.png",
    "budgets":  SUITE / "04. STICK BUDGETS" / "LOGO.png",
    "life":     SUITE / "05. STICK LIFE" / "LOGO.png",
    "projects": SUITE / "06. STICK PROJECTS" / "LOGO.png",
    "quantity": SUITE / "07. STICK QUANTITY" / "LOGO.png",
    "receipt":  INDUSTRIES / "05. APPS" / "03. STICK RECEIPT" / "LOGO.png",
    "stickpro": INDUSTRIES / "02. STICK REVIT PRO" / "03. MARCA" / "01-logo" / "png"
                / "stickpro-isotipo-para-fondo-grafito.png",
}

FONDO, MARCA = 31.0, 255.0   # los dos niveles del PNG de origen
LADO = 512                   # lado del lienzo final, en pixeles
LADO_EQUIV = 0.62            # lado del cuadrado de igual area que cada icono
TOPE = 0.84                  # ningun icono pasa de esta fraccion del lienzo


def preparar(origen: Path, salida: Path) -> str:
    im = Image.open(origen)
    if im.mode in ("RGBA", "LA") or "transparency" in im.info:
        # Un PNG con transparencia ya trae el alfa: su color puede ser gris
        # (el isotipo de STICK PRO lo es) y medirlo por luminancia lo apagaria.
        alfa = np.array(im.convert("RGBA"))[..., 3].astype(np.float32) / 255
    else:
        L = np.array(im.convert("L")).astype(np.float32)
        alfa = np.clip((L - FONDO) / (MARCA - FONDO), 0, 1)
    a8 = (alfa * 255).round().astype(np.uint8)

    ys, xs = np.where(a8 > 8)
    if len(ys) == 0:
        raise ValueError(f"{origen.name} salio vacio")
    recorte = Image.fromarray(a8[ys.min():ys.max() + 1, xs.min():xs.max() + 1], mode="L")

    # Escalar por AREA de la caja, no por el lado mayor. Normalizando por el
    # lado, un icono apaisado como la mancuerna de FIT queda con menos de la
    # mitad de altura que los demas y desaparece en la rejilla; igualando el
    # area, cada uno ocupa la misma superficie y el conjunto pesa parejo.
    w, h = recorte.size
    k = ((LADO * LADO_EQUIV) ** 2 / (w * h)) ** 0.5
    tope = LADO * TOPE                     # ninguno se sale del lienzo
    k = min(k, tope / w, tope / h)
    recorte = recorte.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)

    lienzo = Image.new("L", (LADO, LADO), 0)
    lienzo.paste(recorte, ((LADO - recorte.width) // 2, (LADO - recorte.height) // 2))

    blanco = Image.new("L", (LADO, LADO), 255)
    Image.merge("RGBA", [blanco, blanco, blanco, lienzo]).save(
        salida, "WEBP", quality=92, method=6
    )
    return f"{w}x{h} -> {salida.stat().st_size // 1024} KB"


if __name__ == "__main__":
    DESTINO.mkdir(parents=True, exist_ok=True)
    for clave, origen in APPS.items():
        if not origen.exists():
            print(f"{clave:9s} FALTA {origen}")
            continue
        print(f"{clave:9s} {preparar(origen, DESTINO / f'{clave}.webp')}")
