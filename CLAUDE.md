# PORTAFOLIO — STICK INDUSTRIES · Kevin Gil

CV interactiva y portafolio de visualización arquitectónica.

> No busca vender: busca **mostrar el trabajo**. Es la carta de presentación
> de Kevin Gil como ingeniero civil y visualizador, bajo la marca
> **STICK INDUSTRIES**.

## Estado actual

**v17.2 — identidad propia, reel, enlaces que se comparten y hoja de vida.**
Publicado en https://zafirosad.github.io/PORTAFOLIO/, repositorio público
`ZafiroSad/PORTAFOLIO`.

Lo que trae la v17 sobre la v16.4:

- **El reel**, sección propia entre Proyectos y Sobre mí: 40 s con los cinco
  proyectos principales, apertura y cierre de marca.
- **Una página de compartir por proyecto** (`p/<slug>/`), con su propio título
  e imagen: pegar el enlace de un proyecto en WhatsApp ya no muestra la tarjeta
  del sitio entero, sino esa casa.
- **Botón Compartir** en la ficha de cada proyecto.
- **Hoja de vida en PDF**, una hoja, generada desde los datos del propio sitio.
- **Cifras del archivo** en Sobre mí, contadas del catálogo, no escritas a mano.
- **`sitemap.xml`, `robots.txt` y datos estructurados** (`schema.org`): antes un
  buscador solo veía la portada y no sabía de quién era el sitio.
- Corregido un fallo que dejaba la capa de bienvenida **tragándose todos los
  clics** si su animación no llegaba a correr.
- El **logo de STICK INDUSTRIES vectorizado** desde su único PNG de origen,
  y usado como marca del sitio: barra, entrada, favicon e imagen de compartir.
- La **entrada dibuja el logo** en vez de escribir la palabra con la
  tipografía del sitio.
- **VISUAL 3D STUDIO retirado** de portada y contacto. Se conserva en el
  trayecto de Sobre mí, que es donde es cierto: cerró en agosto de 2026.
- **Imagen de compartir propia** (`og:image`) — antes el enlace pegado en
  WhatsApp salía sin marca.
- **Tarjeta de contacto** (`.vcf`) como cuarto acceso de Contacto.

Pendientes:
1. Verificar en un **teléfono real** (lo automatizado cubre el encuadre, no
   el tacto ni el rendimiento en gama media)
2. El teléfono y el correo siguen en claro en el HTML de un repo público:
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
│   └── logos-originales/        los 11 PNG de partida de los logos
├── p/<slug>/                    una página de compartir por proyecto (generada)
├── compartir/                   tarjeta .vcf, QR, hoja de vida y reel vertical
├── assets/
│   ├── marca/                   logo, isotipo, favicons e imagen de compartir
│   ├── logos/                   logos de software y escudos de formación
│   ├── renders/                 imágenes en 1600 y 2560 px
│   ├── video/                   6 recorridos, el reel y sus fotogramas de portada
│   ├── datos/tierra.json        silueta de continentes para el globo (13 KB)
│   └── paletas.json             color dominante por proyecto
└── herramientas/
    ├── vectorizar-logo.py       traza el logo desde su PNG y escribe el SVG
    ├── preparar-marca.py        deriva isotipo y favicons del SVG maestro
    ├── preparar-og.py           compone las imágenes de compartir 1200x630
    ├── preparar-enlaces.mjs     escribe p/<slug>/ desde el catálogo
    ├── preparar-cv.mjs          imprime la hoja de vida en PDF
    ├── optimizar-imagenes.ps1   extrae y convierte los renders del archivo
    ├── optimizar-videos.ps1     comprime los recorridos
    ├── extraer-paletas.ps1      saca el color dominante de cada portada
    └── preparar-tierra.py       adelgaza el GeoJSON de Natural Earth
```

### La marca

De STICK INDUSTRIES solo existía un PNG de 1774 x 887 px, sin vector. Todo lo
demás sale de ahí, en dos pasos encadenados:

```powershell
python herramientas/vectorizar-logo.py    # PNG -> assets/marca/stick-industries.svg
python herramientas/preparar-marca.py     # SVG -> isotipo y favicons
python herramientas/preparar-og.py        # SVG + render -> og.jpg
```

| Archivo | Qué es | Dónde se usa |
|---|---|---|
| `stick-industries.svg` | logotipo completo, 10 KB, tres partes con `id` | entrada del sitio |
| `isotipo.svg` | la flecha sola, en `currentColor` | barra |
| `isotipo-claro.svg` | la misma con el color escrito | escudo del trayecto |
| `favicon.svg` + `favicon-32/180/512.png` | isotipo sobre tarjeta grafito | pestaña, iOS, PWA |
| `og.jpg` | render + logo + firma, 1200x630 | enlace compartido |
| `v3s.png` | el cubo de VISUAL 3D STUDIO | escudo de ese hito |

El SVG del logotipo va **incrustado en el HTML**, no como `<img>`: la entrada
anima la flecha, STICK e INDUSTRIES por separado, y desde un `<img>` el
interior del SVG es inalcanzable para el CSS. Si el logo cambia, se re-ejecuta
`vectorizar-logo.py` y se vuelve a pegar el `d=` de cada parte en `index.html`.

### Recorrido

Todo se recorre desplazando. El menú salta con un desplazamiento animado.

1. **Inicio** — render de fachada a pantalla completa y la palabra
   **PORTAFOLIO** en sólido, con las letras asentándose una a una y un
   brillo que las recorre al final. El botón *Inicio* sube a la portada
   con el mismo desplazamiento animado que el resto del menú.
2. **Proyectos** — cuatro hojas verticales a sangre, de borde a borde de la
   ventana. Botón *Ver todos los proyectos* → índice con filtros por grupo.
3. **El reel** — un cartel a lo ancho con el fotograma más vendedor; al
   pulsarlo, el video se abre en una capa. El `<video>` **no existe** hasta ese
   momento: lo crea el JS y lo destruye al cerrar.
4. **Sobre mí** — biografía; el trayecto como **rueda** —el hito del centro
   va entero, con luz propia, y los vecinos se reducen según su distancia—;
   y abajo las herramientas **por etapa**: Modelo, Representación, Apoyo.
5. **Contacto** — cuatro accesos en vidrio: WhatsApp, Gmail, Instagram y la
   tarjeta `.vcf`. Sin texto de venta.

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

### Lo que se genera, y cuándo

Tres cosas del sitio no se escriben a mano: se derivan de lo que ya está en
`index.html`. Si cambia el catálogo o el trayecto, se vuelven a correr.

```powershell
node herramientas/preparar-enlaces.mjs   # catálogo -> p/<slug>/, og.jpg, sitemap.xml, robots.txt
node herramientas/preparar-cv.mjs        # trayecto + catálogo -> hoja de vida en PDF
python herramientas/preparar-og.py       # render + logo -> assets/marca/og.jpg
```

**Las páginas de compartir** existen porque el sitio es un solo `index.html` y
los proyectos se abren con `#slug`: eso basta para un navegador, pero el
rastreador que hace la vista previa de WhatsApp o LinkedIn no ejecuta
JavaScript ni lee el fragmento, así que todos los proyectos salían con la misma
tarjeta. Ahora `…/p/cantabria-23/` es una URL de verdad, con su título y su
imagen, y al abrirla la persona aterriza en la ficha ya abierta.

**La hoja de vida** no tiene datos propios: lee `HITOS`, `UTILES`, el catálogo y
`CONTACTO` del `index.html`, así que el PDF nunca puede desviarse de lo que
cuenta el sitio. Se imprime con el Chrome instalado (`--print-to-pdf`).

## Decisiones tomadas

- **Las cifras se cuentan, no se escriben.** `10 proyectos · 97 imágenes ·
  6 recorridos · 8 ubicaciones` sale del catálogo en cada carga. Una cifra
  escrita a mano se queda vieja el día que entra un proyecto, y en un
  portafolio una cifra vieja es peor que ninguna.
- **La capa de bienvenida NUNCA recibe el puntero.** Cubre la ventana entera
  con `z-index:400`, y si su animación no llega a correr se queda tragándose
  todos los clics del sitio. Pasa de verdad: Chrome congela las animaciones de
  una pestaña en segundo plano, y medido en una pestaña de fondo seguía opaca e
  interceptando el puntero **78 s después de cargar**. Va con
  `pointer-events:none` y además el JS la retira cuando su animación termina —
  o pasado un plazo si no termina, contado desde que la página se ve.
- **Copiar al portapapeles necesita un plazo, no solo un `catch`.** Cuando el
  navegador no reconoce la llamada como gesto del usuario, la promesa de
  `navigator.clipboard.writeText` **no rechaza: se queda pendiente para
  siempre**, y el botón se quedaba sin decir nada. Hay tres caminos: la API
  moderna con `Promise.race`, `execCommand` sobre un textarea, y abrir la
  página para que el enlace quede en la barra de direcciones.
- **La hoja del sistema (`navigator.share`) solo en pantallas táctiles.** Chrome
  de escritorio también la expone, pero ahí abre el diálogo de Windows, que es
  un rodeo para algo que en un computador se resuelve pegando el enlace. Se
  mira `pointer: coarse`, no si la API existe.
- **El CV se mide, no se tantea.** Salía en dos hojas y cada ajuste a ojo fallaba;
  medido en el navegador, el documento pesaba **300,3 mm contra los 297 de un
  A4** — sobraban 3,3. Y el `break-inside:avoid` en la rejilla empeoraba las
  cosas: hacía saltar de hoja un bloque entero teniendo sitio.
- **El reel se monta aparte, no en este repositorio.** Vive como proyecto de
  video propio en `01. PROYECTOS` → `06. VIDEO - REEL STICK INDUSTRIES`,
  con su bitácora; aquí solo entra el MP4 comprimido. El sitio no es el sitio
  donde se edita video.
- **El `<video>` del reel se CREA al abrirlo y se DESTRUYE al cerrarlo.**
  Dejarlo en el HTML —aunque sea con `preload="none"`— basta para que algunos
  navegadores pidan los primeros bytes al montar la página, y son 12,6 MB que
  nadie ha pedido. Medido: con el cartel, la página está lista con **0,59 MB y
  ningún MP4 solicitado**.
- **El cartel del reel es un `<button>` con una imagen, no un `<video
  poster=…>`.** Un `<video>`, aunque no reproduzca, reserva decodificador y
  negocia el archivo.
- **En pantallas de menos de 400 px el rótulo de la barra se va, el isotipo se
  queda.** Antes desaparecía la marca entera y el teléfono se quedaba sin firma
  fija; la flecha sola cabe de sobra.
- **Manda STICK INDUSTRIES, firma Kevin Gil.** La barra y la entrada llevan
  el logo; el nombre propio vive en la portada, en el pie y en Sobre mí.
  Decidido por Kevin el 2026-09-10, cerrando el pendiente que arrastraba
  la v13.
- **VISUAL 3D STUDIO solo en el trayecto.** Cerró el 2026-08-29: presentarlo
  en portada o en contacto sería falso. Como hito de trayectoria es cierto y
  suma, así que ahí se queda, y al lado va el hito de STICK INDUSTRIES.
- **El logo se vectorizó, no se reescribió con una fuente.** Buscar una
  tipografía parecida habría dado un logo *casi* igual, que es peor que uno
  igual: se traza el original con marching squares y queda exacto.
- **Los contadores de la D y la R obligan a un solo `path`.** Un contorno
  encerrado en otro solo se lee como agujero si comparten `path` y hay
  `fill-rule="evenodd"` declarado EN el path, no heredado del `<svg>`.
- **El logo NO se traza sobre la imagen ampliada.** Ampliar con Lanczos antes
  de buscar contornos parecía más preciso y era lo contrario: los trazos
  finísimos de INDUSTRIES se difuminaban y cerraban esos mismos contadores.
- **La entrada anima el SVG, no reproduce un video.** Un sting renderizado
  obligaría a descargar megabytes antes del primer cuadro, en el momento más
  sensible de la carga; el SVG pesa 10 KB, es nítido a cualquier tamaño y
  `prefers-reduced-motion` lo apaga sin más.
- **El favicon es la flecha con la cola CORTADA**, no la flecha entera
  reducida —que a 32 px es un pelo horizontal— ni recortada contra el borde
  del cuadro, que se lee como un accidente de encuadre.
- **Un solo archivo HTML.** El sitio no tiene estado ni datos dinámicos.
- **El catálogo espeja la carpeta** `02. WORK\03. STICK INDUSTRIES\99. RECURSOS MARCA\
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

**0,59 MB y 8 peticiones hasta que la página está lista** (Chrome real,
2026-09-10, con el reel ya publicado). **Ningún MP4 se solicita**: los 12,6 MB
del reel solo se descargan si alguien pulsa el cartel.

Antes fueron 1,1 MB, y antes de eso 2,26 MB.

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
cd "C:\Users\kevin\Documents\KEVIN\02. WORK\03. STICK INDUSTRIES\99. RECURSOS MARCA\PORTAFOLIO"
python -m http.server 8899
```

**Ojo con el vídeo.** `python -m http.server` no soporta *Range requests*, y
sin eso NINGÚN `<video>` reproduce en local — ni el reel ni los recorridos de
las fichas. No es un fallo del sitio: en GitHub Pages funcionan. Para probarlos
en local hace falta un servidor que responda 206.

Desde el teléfono, con el PC en la misma red Wi-Fi: `http://192.168.0.103:8899`
