# PORTAFOLIO — Kevin Gil

CV interactiva y portafolio de visualización arquitectónica.

> No busca vender: busca **mostrar el trabajo**. Es la carta de presentación
> de Kevin Gil como ingeniero civil y visualizador.

## Estado actual

**v13.0 — PUBLICADO en https://zafirosad.github.io/PORTAFOLIO/**
Repositorio público `ZafiroSad/PORTAFOLIO`. Verificado en escritorio
(1600 px) y en móvil (412 px, densidad 3) contra el sitio en vivo.

Pendientes:
1. Verificar en un **teléfono real** (lo automatizado cubre el encuadre, no
   el tacto ni el rendimiento en gama media)
2. Identidad gráfica propia — la entrada sigue diciendo **STICK INDUSTRIES**
   y la barra ya dice **KEVIN GIL**: falta decidir cuál manda
3. El teléfono y el correo están en claro en el HTML de un repo público:
   los rastreadores los leen. Se avisó; queda a decisión de Kevin

Lo que más subiría el nivel, y depende de material de Kevin:
**fotos de obra construida en el mismo encuadre del render.**

## Arquitectura

Un solo `index.html` autónomo: HTML, CSS y JavaScript en el mismo archivo,
sin dependencias ni framework.

```
PORTAFOLIO/
├── index.html                   el sitio completo
├── CLAUDE.md                    este archivo
├── propuestas/                  variantes que se compararon y se descartaron
├── fuentes/                     material pesado de origen (fuera del repo)
├── assets/
│   ├── marca/                   favicon
│   ├── logos/                   logos de software y escudos de formación
│   ├── renders/                 imágenes en 1600 y 2560 px
│   ├── video/                   6 recorridos (1280x720) + fotogramas de portada
│   ├── proceso/g · proceso/p    la obra levantándose: 80 y 60 cuadros
│   ├── datos/tierra.json        silueta de continentes para el globo (13 KB)
│   └── paletas.json             color dominante por proyecto
└── herramientas/
    ├── optimizar-imagenes.ps1   extrae y convierte los renders del archivo
    ├── optimizar-videos.ps1     comprime los recorridos
    ├── extraer-paletas.ps1      saca el color dominante de cada portada
    ├── preparar-proceso.ps1     saca los cuadros de la escena de Proceso
    └── preparar-tierra.py       adelgaza el GeoJSON de Natural Earth
```

### Recorrido

Todo se recorre desplazando. El menú salta con un desplazamiento animado.

0. **Proceso** — entre Inicio y Proyectos. Sección de 340 vh con el contenido
   pegado: el desplazamiento hace de línea de tiempo y **la obra se levanta**
   —cimentación, estructura, entrepiso, cubierta, cerramiento— hasta el render
   final a color. Es el argumento del portafolio dicho en imagen: *la imagen
   no se dibuja, se levanta*. La escena la generó Kevin con OmniFlash.
1. **Inicio** — render de fachada a pantalla completa y la palabra
   **PORTAFOLIO** recortando ese mismo render. El botón *Inicio*
   vuelve a tocar la entrada de STICK INDUSTRIES **con un render distinto
   cada vez**, tomado de la lista `FACHADAS`.
2. **Proyectos** — cuatro hojas verticales a sangre, de borde a borde de la
   ventana. Botón *Ver todos los proyectos* → índice con filtros por grupo.
3. **Sobre mí** — biografía; el trayecto como **rueda** —el hito del centro
   va entero, con luz propia, y los vecinos se reducen según su distancia—;
   y abajo las herramientas **por etapa**: Modelo, Representación, Apoyo.
4. **Contacto** — cuatro accesos en vidrio: WhatsApp, Gmail y los dos
   Instagram. Sin texto de venta.

### Lenguaje visual

**No hay color de fondo: hay un campo.** Cuatro masas de luz desenfocadas
derivan muy despacio detrás de todo, con grano de película encima y una base
grafito (`#15161b`) que nunca llega a negro. El negro plano de la v8 hacía
que la página se leyera básica, y los azules y violetas saturados de la v9
le daban aire de portada de IA: ahora el campo se mueve en tonos de piedra,
hormigón y luz de tarde. **El mismo campo en todas las capas** — archivo y
fichas incluidos, sin tintes por proyecto.

**Vidrio líquido.** El contenido no se apoya en paneles opacos sino en
superficies translúcidas con filo especular (`inset` claro arriba, oscuro
abajo) y un reflejo que sigue al cursor. La clase `.vidrio` lo concentra todo.

El render sigue siendo lo más brillante de la pantalla: el vidrio solo lo
enmarca. Se conservan las reglas del `STICK_UI_SYSTEM`: mono para todo dato
técnico, un solo CTA por bloque, bordes con opacidad y radios.

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
- **Los logos de software van a color siempre.** El gris que se revelaba al
  señalar escondía justo lo que hay que mostrar.
- **Marca de agua propia: se elimina recortando 12% del encuadre**, no con
  `delogo` de ffmpeg, que deja borrón sobre líneas rectas.
- **En la portada las letras no se animan con `transform`**: rompe el recorte
  de `background-clip:text`. Se animan `opacity` y `filter`.
- **El rótulo vertical se desplaza en el contenedor, no en el texto**: dentro
  de `writing-mode` vertical con `rotate(180deg)` los ejes quedan girados.
- **La ficha se funde mientras el clon viaja**, no al aterrizar, y el clon
  **no se quita de golpe: se funde** sobre la imagen real ya colocada debajo.
  El contenido de la ficha arranca su entrada a los 340 ms, con el clon aún
  en vuelo. Los tres juntos son lo que quita el corte al abrir un proyecto.
- **La ficha es opaca.** Translúcida dejaba leer el texto de la página por
  detrás de los renders.
- **La ficha no lleva párrafo descriptivo ni año ni estado**: basta el título
  sobre el render. Debajo queda una sola cinta con DÓNDE y CUÁNTAS.
- **El lugar se responde girando un globo**, no escribiéndolo: canvas 2D con
  proyección ortográfica que rota hacia las coordenadas del proyecto según
  sube la cinta por la pantalla. Sin librerías. Las coordenadas son de
  MUNICIPIO, no del lote.
- **La galería reparte filas completas por JS** (`repartirFilas`): dos piezas
  iguales o una a lo ancho, y lo que sobre ocupa su fila entera. Con la
  retícula CSS de 6 columnas de la v8, un número impar dejaba hueco negro.
  La tira de material adicional usa `flex-grow`, que por definición tampoco
  puede dejar hueco.
- **El material adicional no se anuncia con texto**: un filo que se dibuja al
  entrar en pantalla y la cifra. Las piezas suben en cascada detrás.
- **El visor cambia de imagen con dos capas**, no cambiando el `src`: la que
  sale se va con desenfoque hacia un lado y la que entra llega del contrario.
- **Los logos de software van por ETAPA, no en un muro**: Modelo →
  Representación → Apoyo. Se probaron y descartaron, en este orden, la
  rejilla de placas, la órbita en monedas de vidrio y la constelación
  flotante. Lo único que sobrevivió de todas ellas es el resplandor, que
  sale de `drop-shadow` sobre el PNG y por eso toma la silueta del logo y no
  la de un contenedor.
- **La escena de Proceso es una SECUENCIA DE FOTOGRAMAS en canvas, no un
  `<video>`.** Con vídeo hay que mover `currentTime` en cada cuadro, y un
  salto pedido antes de que resuelva el anterior se descarta: medido en
  Chrome, el vídeo se quedaba clavado con `seeking` en `true` para siempre,
  con `readyState` cayendo de 4 a 1. Dibujar la imagen que toca no depende
  del decodificador. Se regenera con `herramientas/preparar-proceso.ps1`.
- **La secuencia va a 1920 px y calidad 86** — 80 cuadros, 13 MB. Se probó
  a 1040 px para ahorrar peso y el resultado fue un render blando: en un
  portafolio de visualización la imagen ES el producto, así que aquí el peso
  cede. El lienzo además limita su densidad de píxeles al ancho real de la
  fuente, porque pedirle más solo estira la imagen.
- **La secuencia no compite con la portada**: solo el primer cuadro entra
  antes, y el resto espera al evento `load`. Hasta que la página está lista
  se descargan ~2,3 MB y **un** fotograma; los otros 79 llegan después.
- **Los escudos del trayecto van sin burbuja y a 64 px.** El eje se corta con
  una sombra del color del fondo, no con un disco. Del logotipo de la UPB se
  recortó **solo el escudo**: el texto va en negro y desaparecía sobre el
  fondo oscuro.
- **Canva y Excel quedaron fuera** del listado: restan en un portafolio de
  visualización. Los logos negros (Twinmotion, ChatGPT) van invertidos.
- **`overflow:hidden` en la sección Sobre mí**: el orbital es más alto que la
  ventana y sus satélites aparecían flotando sobre Contacto — y provocaban
  desbordamiento horizontal en móvil.
- **Los bloques con `overflow:hidden` que animan texto llevan
  `padding-bottom` compensado con margen negativo**: sin eso el recorte corta
  los trazos que bajan de la línea base (la g de «Ingeniero»).
- **Las capas modales van FUERA de `.lienzo`.** Dentro, su `z-index` se mide
  contra el del lienzo y la barra fija del sitio se dibujaba encima del
  archivo. Ficha, índice y visor son hermanos del lienzo, no hijos.
- **El índice también es opaco**, por la misma razón que la ficha.
- **Las columnas del archivo las fija el JS** (`ajustarRejilla`): elige el
  número que deje la última fila llena, y cuando el filtro deja menos
  proyectos que columnas los acota a 420 px y centra la fila, en vez de
  estirarlos de borde a borde.
- **En móvil las piezas de la galería llevan `flex:none`.** Al apilar, el eje
  principal pasa a ser el vertical y `flex:1 1 0` mandaba sobre `height`: las
  imágenes colapsaban a cero y la galería era un hueco vacío.
- **Con `prefers-reduced-motion` hay que devolver el `filter`, no solo la
  opacidad.** Las letras del titular arrancan en `blur(16px)`; al matar las
  animaciones se quedaban borrosas aunque fueran opacas.

## Medido

**1,1 MB hasta que la página está lista** (medido con Chrome real, no
estimado). Bajó desde 2,26 MB al poner `content-visibility:auto` en las
secciones: las imágenes de lo que no se ve todavía ya no se descargan.

Después de `load` llegan los 3,8 MB de la secuencia de Proceso, en segunda
fila y sin bloquear nada.

Sigue pendiente, si algún día molesta: **una tercera talla de ~800 px para
las hojas de la vitrina**. Solo existen 1600 y 2560 px, así que cada hoja
descarga 1600 aunque en reposo ocupe un cuarto de pantalla. Sin hacer porque
toca la calidad de imagen y eso lo decide Kevin.

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
