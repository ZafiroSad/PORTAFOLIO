# PORTAFOLIO — Kevin Gil

CV interactiva y portafolio de visualización arquitectónica.

> No busca vender: busca **mostrar el trabajo**. Es la carta de presentación
> de Kevin Gil como ingeniero civil y visualizador.

## Estado actual

**v8.0 — escala oscura, catálogo curado. Verificado en escritorio. Sin publicar.**

Pendientes antes de publicar:
1. Verificar la vista **móvil en un teléfono real** (no se pudo automatizar:
   la ventana de Chrome no baja de ~1500 px de ancho)
2. Identidad gráfica propia — hoy la barra dice **STICK INDUSTRIES** en texto,
   sin logotipo, por decisión explícita mientras no exista
3. Publicar en GitHub Pages o dominio propio

## Arquitectura

Un solo `index.html` autónomo: HTML, CSS y JavaScript en el mismo archivo,
sin dependencias ni framework.

```
PORTAFOLIO/
├── index.html                   el sitio completo
├── CLAUDE.md                    este archivo
├── propuestas/                  las tres portadas que se compararon
├── assets/
│   ├── marca/                   favicon
│   ├── logos/                   logos de software y escudos de formación
│   ├── renders/                 imágenes en 1600 y 2560 px
│   ├── video/                   6 recorridos (1280x720) + fotogramas de portada
│   └── paletas.json             color dominante por proyecto
└── herramientas/
    ├── optimizar-imagenes.ps1   extrae y convierte los renders del archivo
    ├── optimizar-videos.ps1     comprime los recorridos
    └── extraer-paletas.ps1      saca el color dominante de cada portada
```

### Recorrido

Todo se recorre desplazando. El menú salta con un desplazamiento animado.

1. **Inicio** — render de fachada a pantalla completa. El botón *Inicio*
   vuelve a tocar la entrada de STICK INDUSTRIES **con un render distinto
   cada vez**, tomado de la lista `FACHADAS`.
2. **Proyectos** — cuatro hojas verticales a sangre, de borde a borde de la
   ventana. Botón *Ver todos los proyectos* → índice con filtros por grupo.
3. **Sobre mí** — biografía, cifras, herramientas en placas a color y el
   trayecto como **rueda**: el hito del centro va entero y los vecinos se
   reducen según su distancia al centro.
4. **Contacto** — WhatsApp, Gmail y los dos Instagram.

### Lenguaje visual

**Escala oscura (`#09090b`)**: el render es la única fuente de luz de la
página. Todo lo demás se mantiene por debajo de él en luminosidad. Es la
convención de los estudios de visualización, y coincide con el
*dark-first* que declara `STICK_UI_SYSTEM.md`. La versión clara de la v7
quedó descartada: hacía que el sitio se leyera genérico.

## Decisiones tomadas

- **Un solo archivo HTML.** El sitio no tiene estado ni datos dinámicos.
- **El catálogo espeja la carpeta** `02. WORK\03. PROYECTOS PERSONALES\
  PROYECTOS PORTAFOLIO`: los cuatro de `PRINCIPALES` abren la vitrina y los
  de `SECUNDARIOS` completan el índice.
- **La portada de cada proyecto es su render de FACHADA**, sin excepción
  (en carpintería, el closet o la cocina que hace de tal).
- **`arch` separado de `slug`.** El identificador del proyecto y el prefijo
  de sus archivos son campos distintos: así se pudo renombrar «Casa Will» a
  «Casa Campo» o partir Lebrija en dos proyectos sin mover 200 archivos.
- **Renders no curados como material adicional**, en una tira aparte al pie
  de la ficha, más tenue que la selección.
- **El desplazamiento suave se anima por JS.** `scroll-behavior:smooth` y
  `scrollTo({behavior:'smooth'})` no llegan a ejecutarse en esta página —
  medido: el instantáneo mueve, el suave deja el scroll quieto. Los saltos
  del menú se quedaban sin encuadrar por eso.
- **`justify-content: safe center`** en el cuerpo de cada sección: con
  `center` a secas, un contenido más alto que su hueco se desborda por
  ARRIBA y la barra fija le come el título.
- **La ficha va por encima del índice** (z-index 260 contra 210). Al revés,
  abrir un proyecto desde el índice lo montaba tapado y solo aparecía al
  cerrar el índice: era el fallo de «no abre, pero al cerrar me lleva».
- **Los logos de software van a color siempre**, sobre placa oscura. El gris
  que se revelaba al señalar escondía justo lo que hay que mostrar.
- **Marca de agua propia: se elimina recortando 12% del encuadre**, no con
  `delogo` de ffmpeg, que deja borrón sobre líneas rectas.
- **En la portada las letras no se animan con `transform`**: rompe el recorte
  de `background-clip:text`. Se animan `opacity` y `filter`.
- **El rótulo vertical se desplaza en el contenedor, no en el texto**: dentro
  de `writing-mode` vertical con `rotate(180deg)` los ejes quedan girados.
- **La ficha se funde mientras el clon viaja**, no al aterrizar.

## Decisiones abiertas

1. **Marcas de BELVAL** incrustadas en los recorridos de LOTE 23 y CAZADORES
   (la oficina donde hace prácticas). No se quitan sin rehacer el render.
2. **Renders sin usar en `assets/renders`**: `snacks-*`, `estudio-solar-*` y
   `cocina-comedor-*` ya no los referencia el catálogo, porque esos tres
   proyectos no están en la carpeta curada. Siguen en disco.
3. Los nombres de menores que había en los rótulos de LA PUNTA quedaron
   resueltos solos: la ficha ya no rotula las imágenes con nombre propio.

## Qué falta aportar para que sea más inmersivo

En orden de impacto:
1. **Fotos de obra construida en el mismo encuadre del render** — es el
   argumento más fuerte de su perfil: no solo visualiza, construye.
2. **Vista 3D.** Acordado para una segunda vuelta, en este orden:
   órbita por secuencia de 36 renders (sin librerías), panorámica 360
   equirectangular, y `<model-viewer>` con un GLB solo para un proyecto
   emblema.
3. Capturas del modelo en Revit (alambres o clay) para mostrar el paso previo.
4. Un retrato suyo.
5. Fechas reales y cliente de cada proyecto.

## Cómo verlo

```powershell
cd C:\Users\kevin\Downloads\PORTAFOLIO
python -m http.server 8899
```

Desde el teléfono, con el PC en la misma red Wi-Fi: `http://192.168.0.103:8899`
