# PORTAFOLIO — STICK INDUSTRIES · Kevin Gil

CV interactiva y portafolio de visualización arquitectónica.

> No busca vender: busca **mostrar el trabajo**. Es la carta de presentación
> de Kevin Gil como ingeniero civil y visualizador, bajo la marca
> **STICK INDUSTRIES**.

## Estado actual

**v20 — LA STICK SUITE, sección propia con las siete apps en tarjeta cuadrada.**
Publicado en https://zafirosad.github.io/PORTAFOLIO/, repositorio público
`ZafiroSad/PORTAFOLIO`.

### v20 — 2026-09-15

El Señor Stick vio la v19.3 publicada y pidió lo contrario de lo que había
pedido el día antes: «una sección que se llame la Stick Suite donde las apps
se vean con más protagonismo, en tarjetas cuadradas… las otras apps resáltalas
todas iguales pero las 3 principales primero, con un efecto de brillo».

- **Sección propia, con entrada en el menú.** Sale de dentro de Sobre mí y
  pasa a ser `#suite`, entre Sobre mí y Contacto. Ese orden es deliberado:
  primero el trabajo, luego quién lo hace, y entonces las herramientas que se
  escribió para hacerlo. Puesta antes se leería como un catálogo de software.
- **Las siete miden IGUAL, en tarjeta cuadrada** (`aspect-ratio:1`). La v19.3
  tenía dos pesos —tarjeta contra tira— y eso decía que cuatro de ellas
  importaban menos. Ahora lo único que separa a las de obra es **el orden y el
  brillo**: se leen primero y se encienden, pero ninguna se encoge.
- **El brillo son tres capas que no cambian el tamaño**: halo radial detrás
  del icono, filo más claro, y un `box-shadow` que respira cada 6,5 s. Se hace
  con `box-shadow` y un pseudoelemento y **no** con `filter` sobre la tarjeta,
  porque el filtro emborronaría también el texto.
- **Flex y no rejilla.** Con cuatro columnas y siete piezas sobraba una celda.
  Con `flex-wrap`, las dos filas —tres arriba, cuatro abajo— arrancan del
  mismo borde y no hay hueco. El corte que las separa es un elemento de verdad
  (`.suite-corte`), porque un `::after` no puede ser hijo flex; por debajo de
  700 px se apaga, que ahí caben dos por fila y forzarlo dejaría una colgando.
- **TODO A LA IZQUIERDA, como el titular.** La primera versión centró la
  entrada y las tarjetas mientras la cabecera de la sección seguía a la
  izquierda —como en todas las demás—, y el bloque quedaba colgando de un
  título que no lo sostenía: el «La STICK SUITE.» en el margen y las siete
  tarjetas flotando en mitad de la página. Se ve en cuanto se mira la sección
  entera, y no se veía mirando solo la rejilla.
- **La descripción reserva dos líneas aunque ocupe una.** La tarjeta centra su
  contenido, así que «Finanzas personales.» subía menos y dejaba su icono y su
  nombre 7 px por debajo de los vecinos. Medido y corregido con `min-height`.
- El menú pasa de cinco entradas a seis. Medido: a 520 px la marca son 121 px
  y el menú 307, sobre 481 disponibles — cabe sin desbordar.

**Ojo al medir con pantallazos en este contenedor:** el Chrome headless captura
**antes de que los WebP de los iconos decodifiquen**, y la sección sale con las
tarjetas vacías. Pasó tres veces y las tres eran falsa alarma — medidos, los
`<img>` daban `naturalWidth` 512 y `complete:true`. Para ver la sección de
verdad hay que incrustar los iconos como `data:` URI en una copia de prueba.

### v19.4 — 2026-09-14 (cuadre del PC con la sesión remota)

Ese día se trabajó por dos lados sin verse: la sesión remota subió la v19.2
(textos) y la v19.3 (suite) a la rama `claude/perfil-profesional-arquitectura-00ml0t`,
y en el PC se hizo en `main` otro commit rotulado también «v19.2»: el sufijo
`?v=4.1` en las rutas del reel y su póster para saltar la caché del navegador.
Se fusionó la rama en `main` sin conflictos; **ese arreglo de caché es la
v19.4** aunque su commit diga v19.2 (el historial publicado no se reescribe).

- **Los tres iconos que faltaban ya están**: `preparar-suite.py` corrido en el
  PC escribió los seis; los tres recuperados de Drive salieron idénticos byte a
  byte. Verificado con captura: ATLAS con su «A», AROS y QUANTITY arriba, y la
  tira de cuatro al 70 %.
- **Hoja de vida reimpresa con Century Gothic**, con 4.3 y el perfil nuevo. Salía
  en **dos hojas**: el curso de la UIS a su nombre completo ocupa tres renglones
  y la columna de Formación creció ~11 mm, lo justo para echar el pie a una
  segunda hoja. Se bajó el margen entre renglones de 2,4 a 1,8 mm y el del pie
  de 5 a 3 mm; vuelve a una hoja, comprobado contando páginas del PDF.

### v19.3 — 2026-09-14

Las apps vuelven, pero no como en la v19. Pedido del Señor Stick: «que sea
muy sutil, y solo para mostrar que yo he creado esas aplicaciones».

- **Van en Sobre mí, debajo del flujo**, no en sección propia ni en el menú.
  Sostienen una frase de la biografía —«desarrollo aplicaciones y
  herramientas propias»— y ese es todo el peso que piden.
- **Tarjeta = icono, nombre y una línea.** Sin capturas, sin enlaces, sin
  botón. La v19 ponía fichas con pantallazos de 30 KB y desenfocaba un
  portafolio de ingeniería civil.
- **Dos pesos.** ATLAS, AROS y QUANTITY abren en un renglón de tres tarjetas
  porque son las de obra; PROJECTS, ASSETS, BUDGETS y FIT van debajo en una
  tira al 70 % de opacidad que se enciende al pasar por encima.
- **El resplandor es blanco para todas.** Los logos de software de arriba
  llevan el color de cada marca porque ese color existe. Inventarle uno a
  cada app propia sería decorar con algo que no es cierto.
- **Si falta el icono, va la inicial.** Las seis declaran su ruta en
  `assets/suite/` aunque el archivo no esté, y un `onerror` las deja en su
  letra mientras tanto. ATLAS es el único con `null` de verdad: no tiene
  icono dibujado, así que su «A» no es un respaldo sino lo definitivo.

*(Resuelto en la v19.4.)* **Faltaban tres iconos: `quantity`, `budgets` y `fit`.** Los `LOGO.png` de
origen viven en el computador de Kevin (`01. STICK SUITE`), no en el
repositorio. Se recuperaron de Drive los de AROS, PROJECTS y ASSETS y se
procesaron con los mismos parámetros del script; los otros tres no se
pudieron traer íntegros desde aquí. **Se arreglan con un comando:**

```powershell
python herramientas/preparar-suite.py
```

Escribe los seis en `assets/suite/` y las tarjetas los toman solas — el
`index.html` ya apunta a esas rutas y no hay que tocar una línea.

### v19.2 — 2026-09-14

Llegó el prompt de los textos que la v19.1 dejó pendientes. Van tal cual los
escribió, y el trayecto se corrigió hito por hito.

- **La biografía es la suya, palabra por palabra.** Cuatro párrafos que abren
  con «Diseño para construir, no solo para impresionar». Sale la versión
  anterior entera, y con ella la frase del noveno semestre y la de las visitas
  a obra: lo que dice de sí mismo lo dice él.
- **El promedio sube a 4.3**, en el sitio y en la hoja de vida.
- **El curso de la UIS lleva el nombre del certificado.** Se leyó el propio
  diploma (`02. CERTIFICADOS/Kevin_Gil - ASCEIC - Curso_Revit - 2025.pdf`, en
  su Drive): «Curso de Modelado BIM y Gestión de la Construcción a través de
  Autodesk REVIT», de la **Asociación Centro de Estudios de Ingeniería Civil
  UIS**, 50 horas. El nombre del sitio era una paráfrasis.
- **Dos años corregidos, y el orden con ellos.** El certificado está expedido
  el 18 de septiembre de **2025**, no 2026; y su propia hoja de vida fecha el
  congreso XOpen en 2025. Los dos hitos pasan a 2025 y el curso se coloca
  después del congreso, como en la hoja de vida. La rueda dice que va en orden
  cronológico: con un 2026 delante de un 2025 dejaba de ser cierto.
- **Un hito puede no llevar descripción.** «Representante estudiantil» se queda
  solo con el título, por decisión suya. La rueda y la hoja de vida imprimían
  `<p>${detalle}</p>` sin mirar: con `detalle:null` habrían escrito la palabra
  **null** en la página. Las dos plantillas ahora lo comprueban.
- **XOpen, VISUAL y STICK**, reescritos: el congreso dice que participó en la
  competencia de puentes y nada más; VISUAL es estudio propio de render y
  modelado, sin la nota de su cierre; y STICK INDUSTRIES se presenta como la
  marca personal con la que continúa ese trabajo.
- **ATLAS entra en el hito de Estructuras por la razón, no de adorno**: la
  especialización es para poder ampliar el cálculo que la aplicación automatiza
  y responder por sus resultados.

*(Resuelto en la v19.4.)* **La hoja de vida en PDF hay que reimprimirla en el computador de Kevin**
(`node herramientas/preparar-cv.mjs`). Aquí no está instalada Century Gothic,
que es la tipografía de la marca, así que lo impreso desde este contenedor sale
con otra letra y con otra paginación —el PDF **sin tocar** también salía a dos
hojas—. El `compartir/kevin-gil-cv.pdf` del repositorio sigue siendo el
anterior: dice 4.2 y lleva el perfil viejo hasta que se vuelva a correr. El
párrafo de perfil nuevo es 31 caracteres **más corto** que el que sustituye,
así que la hoja única no debería estar en riesgo, pero conviene mirarlo.

### Purga del historial — 2026-09-13

Autorizada por el Señor Stick. Con `git filter-repo` se reescribieron los 46
commits conservando **solo las rutas que existen hoy**: salen del historial
las 300 rutas borradas en algún momento —los recorridos, los fotogramas de
«proceso», las familias de renders sin proyecto, `coincafex-07/08`, las
capturas de las apps y la tarjeta `kevin-gil.vcf` con el teléfono en claro—,
y además las **ocho versiones anteriores del reel** que seguían guardadas bajo
el mismo nombre. El árbol del último commit quedó idéntico (mismo hash) y
cambiaron los hashes de todos los commits; cualquier otro clon del repositorio
queda desfasado y hay que volver a clonarlo.

Respaldo previo completo en `C:\Users\kevin\Downloads\respaldo-portafolio-git\portafolio-antes-de-purga.bundle` (333 MB, verificado). Se restaura con
`git clone` sobre ese archivo.

### v19.1 — 2026-09-13

- **La sección Herramientas sale del sitio**, por decisión del Señor Stick:
  la va a replantear con un prompt propio. Se quitaron su HTML, CSS, JS, el
  enlace del menú y los iconos. **Se conserva `herramientas/preparar-suite.py`**,
  que regenera los seis iconos desde los `LOGO.png` de cada app en un segundo.
  La frase de la bio que remitía a «la sección anterior» también sale.
- **Los textos quedan como están** hasta que llegue su prompt para ellos.
- **Peso muerto borrado** (el sitio pasa de 163 a ~89 MB): los seis
  recorridos con sus pósters, las familias de renders que ningún proyecto
  usaba (`cocina-comedor`, `estudio-solar`, `snacks`), `coincafex-07` (una
  lámina, no un render) y `coincafex-08` (nombre del cliente), más las cinco
  reglas `.ficha-recorrido` y un encabezado CSS huérfano.
  **Siguen en el historial de git**: quien tenga la URL de un commit viejo
  puede verlos. Sacarlos de ahí exige reescribir el historial y forzar el
  push — no se ha hecho.
- **El reel, en dos calidades.** El master 16:9 ahora es 2560×1440 con
  fotogramas JPEG al 100 %. El sitio sirve `reel-1440.mp4` a pantallas que
  pintan 1700 px o más y `reel.mp4` (1080p) al resto; si la de 1440p falla,
  cae sola a la otra. Detalle en la decisión 25 del proyecto de video.

### v19 — la revisión del 2026-09-12

El Señor Stick rechazó la v18 entera: «Terrible todo, el video mal hecho,
menos organizado, los textos tmb genericos, lo de las apps quiero ver los
logos mejor». Las tres cosas eran ciertas y se arreglaron así:

- **Las apps se ven por su logo, no por una captura.** Cada una guarda su
  `LOGO.png` a 2000×2000 —icono blanco sobre gris 31— y `preparar-suite.py` lo
  recorta al contenido, le calcula el alfa y lo deja en WebP de 2-9 KB. Antes
  la sección mostraba tres capturas de pantalla de 30 KB donde el logo no
  aparecía por ningún lado.
- **Los iconos se igualan por ÁREA, no por lado.** Normalizando por el lado
  mayor, la mancuerna de FIT —que es 2,2 veces más ancha que alta— quedaba con
  menos de la mitad de altura que el resto y desaparecía en la rejilla.
- **Son siete apps, no tres.** Cuatro de obra con ficha completa (ATLAS, AROS,
  QUANTITY, PROJECTS) y tres de fuera en una tira compacta (BUDGETS, ASSETS,
  FIT). ATLAS va con su inicial hasta que tenga icono.
- **Los textos pierden el tic.** El problema no era cliché frase a frase: era
  que **todos** cerraban con una sentencia ingeniosa — «Medir en el sitio lo
  que otro dibujó en el escritorio», «Revit como herramienta de coordinación,
  no de dibujo», «Lo que hoy resuelvo con tablas, entenderlo desde donde
  sale». Diez hitos, diez aforismos. Cuando todo suena a frase de autor, nada
  informa. Reescritos la bio, seis hitos del trayecto, las tres etapas del
  flujo y el título de la sección.
- **El reel, rehecho entero** (V4, 44 s). Los seis defectos y su arreglo están
  en el `CLAUDE.md` del proyecto de video.
- **`coincafex-08` fuera de la galería**: lleva quemado el nombre propio del
  cliente bajo el logo del local. El archivo sigue en el repositorio aunque ya
  no se enlaza — ver pendientes. El archivo total del sitio pasa de 97 a **96
  imágenes**, y la cifra se recalcula sola porque se cuenta del catálogo.
- **Tres reglas CSS muertas corregidas**: `.util h3`, `.util p` y
  `.suite.visible .util:nth-child(3)` habían quedado con el nombre viejo tras
  un renombrado, así que no aplicaban a nada.
- **`servir.py`**, el servidor local con soporte de Range. Existía en la
  sesión anterior pero se había quedado fuera del repositorio, y sin él ningún
  `<video>` reproduce en local.

Lo que trae la v18 sobre la v16.4:

- **Los seis recorridos salen de las fichas.** Todos llevaban quemada la
  marca de BELVAL o la de VISUAL 3D STUDIO, y los de La Punta iban rotulados
  con nombres propios de los clientes.
- **El teléfono y el correo dejan de estar en claro** en el HTML, y la tarjeta
  `.vcf` se arma en el navegador en vez de vivir como archivo en el repo.
- **El reel**, sección propia entre Proyectos y Sobre mí: **45 s** con los
  cinco proyectos, cada uno abierto por su cartela y con una cifra
  sobreimpresa (rehecho en la v19), y doce imágenes armándose en mosaico antes del cierre. Con
  música compuesta sobre el propio corte.
- **Herramientas**, sección nueva: las tres apps de la suite que resuelven
  obra, con capturas reales de cada una corriendo.
- **Logo actualizado** en todo: barra, entrada, favicon, imagen de compartir,
  hoja de vida y las dos piezas del reel.
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
1. ~~Correr `preparar-suite.py` y `preparar-cv.mjs` en el computador de
   Kevin~~ — hecho en la v19.4: los seis iconos están y el CV cabe en una hoja.
2. Verificar en un **teléfono real** (lo automatizado cubre el encuadre, no
   el tacto ni el rendimiento en gama media).
3. **Copias en caché de GitHub.** El historial se purgó el 2026-09-13 (ver
   abajo), pero GitHub sigue sirviendo los commits viejos a quien tenga su
   hash exacto, hasta que su recolector los elimine. Para forzarlo hay que
   pedirlo a GitHub Support citando los hashes, o borrar y recrear el
   repositorio.
4. La hoja de vida en PDF **sí** lleva el teléfono y el correo en claro, y
   vive en un repositorio público. Es su función —una hoja de vida sin
   teléfono no sirve—, pero conviene saberlo.

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
│   ├── suite/                   iconos de las apps (los escribe preparar-suite.py)
│   ├── logos/                   logos de software y escudos de formación
│   ├── renders/                 imágenes en 1600 y 2560 px
│   ├── video/                   6 recorridos, el reel y sus fotogramas de portada
│   ├── producto/                4 WebP (`pindi-*`) que NO enlaza nadie — ver abiertas
│   ├── datos/tierra.json        silueta de continentes para el globo (13 KB)
│   └── paletas.json             color dominante por proyecto
└── herramientas/
    ├── vectorizar-logo.py       traza el logo desde su PNG y escribe el SVG
    ├── preparar-marca.py        deriva isotipo y favicons del SVG maestro
    ├── preparar-og.py           compone las imágenes de compartir 1200x630
    ├── preparar-enlaces.mjs     escribe p/<slug>/ desde el catálogo
    ├── preparar-cv.mjs          imprime la hoja de vida en PDF
    ├── preparar-suite.py        iconos de las apps desde sus LOGO.png
    ├── servir.py                servidor local con Range (sin el, ningun video)
    ├── optimizar-imagenes.ps1   extrae y convierte los renders del archivo
    ├── optimizar-videos.ps1     comprime los recorridos
    ├── extraer-paletas.ps1      saca el color dominante de cada portada
    └── preparar-tierra.py       adelgaza el GeoJSON de Natural Earth
```

### La marca

Del logo solo existe un PNG de 1774 x 887 px, sin vector — y ya se ha
actualizado una vez, así que esto se vuelve a correr cuando llegue otro. Todo
lo demás sale de ahí, en tres pasos encadenados:

```powershell
python herramientas/vectorizar-logo.py    # PNG -> assets/marca/stick-industries.svg
python herramientas/preparar-marca.py     # SVG -> isotipo y favicons
python herramientas/preparar-og.py        # SVG + render -> og.jpg
```

| Archivo | Qué es | Dónde se usa |
|---|---|---|
| `stick-industries.svg` | logotipo completo, 9 KB, tres partes con `id` | entrada del sitio |
| `isotipo.svg` | la flecha sola, en `currentColor` | barra |
| `isotipo-claro.svg` | la misma con el color escrito | escudo del trayecto |
| `favicon.svg` + `favicon-32/180/512.png` | isotipo sobre tarjeta grafito | pestaña, iOS, PWA |
| `og.jpg` | render + logo + firma, 1200x630 | enlace compartido |
| `v3s.png` | el cubo de VISUAL 3D STUDIO | escudo de ese hito |

El SVG del logotipo va **incrustado en el HTML**, no como `<img>`: la entrada
anima la flecha, STICK e INDUSTRIES por separado, y desde un `<img>` el
interior del SVG es inalcanzable para el CSS. Si el logo cambia, se re-ejecuta
`vectorizar-logo.py` y se vuelve a pegar el `d=` de cada parte —y el `viewBox`—
en `index.html`, y lo mismo en las dos piezas del reel.

**El isotipo se corta por una FRACCIÓN del ancho, no por un píxel fijo.** Con
el corte en píxeles, la actualización del logo lo habría partido por otro
sitio; con la fracción, sale igual aunque cambien las proporciones.

### Recorrido

Todo se recorre desplazando. El menú salta con un desplazamiento animado.

1. **Inicio** — render de fachada a pantalla completa y la palabra
   **PORTAFOLIO** en sólido, con las letras asentándose una a una y un
   brillo que las recorre al final. El botón *Inicio* sube a la portada
   con el mismo desplazamiento animado que el resto del menú.
2. **Proyectos** — cuatro hojas verticales a sangre, de borde a borde de la
   ventana. Botón *Ver todos los proyectos* → índice con filtros por grupo.
3. **El reel** — un cartel a lo ancho con el fotograma más vendedor; al
   pulsarlo, el video se abre en una capa **y arranca con sonido**. El
   `<video>` **no existe** hasta ese momento: lo crea el JS y lo destruye al
   cerrar.
4. **Sobre mí** — biografía; el trayecto como **rueda** —el hito del centro
   va entero, con luz propia, y los vecinos se reducen según su distancia—;
   y las herramientas **por etapa**: Modelo, Representación, Apoyo.
5. **La STICK SUITE** — las siete aplicaciones propias en tarjeta cuadrada,
   todas del mismo tamaño. Las tres de obra van primero y con brillo.
6. **Contacto** — cuatro accesos en vidrio: WhatsApp, Gmail, Instagram y la
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

- **Las apps se muestran por su ICONO, nunca por una captura.** La v18 ponía
  pantallazos de 30 KB donde el logo no salía por ningún lado; la v19 los
  cambió por el icono de cada app, y la v19.3 quitó del todo la idea de
  enseñar la interfaz. `capturar-suite.mjs` —el script de puppeteer que tomaba
  esas capturas— ya no existe en el repositorio.
- **Entran las siete y TODAS MIDEN IGUAL.** Esto ha ido y venido: la v19 solo
  dejaba entrar a las de obra, la v19.3 las puso todas pero en dos pesos, y la
  v20 las iguala. Lo que distingue a ATLAS, AROS y QUANTITY es que van
  **primero y con brillo**, no que sean más grandes — una tarjeta más pequeña
  decía que esas cuatro importaban menos, y no es lo que se quiere decir.
- **Un icono que falta no deja un hueco: deja su inicial.** Los `LOGO.png` de
  origen viven fuera del repositorio, así que el sitio declara la ruta de los
  seis aunque el archivo no esté y un `onerror` pone la letra mientras tanto.
  Cuesta un 404 por icono ausente —desde la v19.4, ninguno— y a cambio el día
  que se corra `preparar-suite.py` aparecen solos sin tocar el `index.html`.
  Con los seis, la suite entera pesa **26 KB**.
- **El texto de Sobre mí dice lo que pasa, no lo que suena bien.** La versión
  anterior afirmaba que «los espesores, los apoyos y **la luz** se replantean
  en obra». La luz no se replantea: era una enumeración bonita y falsa. Una
  frase de portafolio que un ingeniero puede desmontar en dos segundos cuesta
  más de lo que aporta.
- **Un recorrido con marca ajena no entra en el portafolio.** Los seis que
  había llevan quemado en el cuadro el logo de BELVAL o el de VISUAL 3D
  STUDIO —en Ruitoque y en el Lote 23, a pantalla completa— y los de La Punta
  rotulan las habitaciones con **nombres propios de los clientes**. Un
  portafolio que enseña el trabajo de Kevin firmado por otra oficina se
  contradice a sí mismo, y los nombres de terceros no se publican. Se
  descartó recortar el encuadre: haría falta un 15-18 % por lado, y esos
  vídeos ya se ven blandos a 720p. **Los archivos siguen en el repositorio**;
  lo que se quitó es el campo `video` del catálogo, así que devolverlos es
  una línea el día que existan recorridos limpios.
- **El contacto va codificado en el fuente, no en claro.** El repositorio es
  público y los rastreadores buscan justo cadenas con forma de correo o de
  teléfono; en base64 no hay nada que reconocer, y los enlaces se arman en el
  navegador. No es cifrado: detiene al que barre en masa, no al que mira. Por
  lo mismo la tarjeta `.vcf` se genera al vuelo — un vCard útil lleva los
  datos en claro y no debe existir como archivo en el repo.
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
- **El reel arranca CON sonido, y cae a mudo solo si el navegador lo
  bloquea.** Arrancar muteado era lo correcto cuando el reel no llevaba
  música; ahora sería esconder la mitad de la pieza. Y se puede intentar:
  quien llega a la capa acaba de pulsar el cartel, y ese gesto es justo lo que
  los navegadores exigen para dejar sonar un video solo. Si aun así `play()`
  es rechazado, se reintenta en silencio y un aviso dice dónde está el
  control de volumen. Verificado: con un clic real, `muted` es `false`.
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
- **La escena de Proceso YA NO ESTÁ EN EL SITIO** — ni ella, ni sus fotogramas
  en `assets/proceso`, ni `preparar-proceso.ps1`. Las tres notas que siguen se
  conservan porque la lección vale para cualquier reproducción cuadro a cuadro
  que se intente después, no porque describan algo que hoy se pueda abrir.
- **La escena de Proceso era una SECUENCIA DE FOTOGRAMAS en canvas, no un
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

~~Después de `load` llegan los 3,8 MB de la secuencia de Proceso~~ — eso dejó
de pasar cuando la escena salió del sitio: hoy no se pide ningún fotograma.

**Medido de nuevo el 2026-09-16**, con la v20 puesta y los seis iconos en su
sitio, servido en local: **33 peticiones y 2,33 MB** con todo cargado
—incluidas las hojas de la vitrina, que entran perezosas y no cuentan para
«la página lista»—, y de ahí la suite entera son **25,8 KB**. **Ninguna
petición falla**: los tres 404 de los iconos ausentes desaparecieron al
correr `preparar-suite.py` en la v19.4.

**Esa cifra NO se compara con los 0,59 MB de arriba**, que se midieron en
Chrome real y hasta el evento `load`. Queda pendiente repetir aquella
medición como se hizo entonces, que es la que dice lo que cuesta abrir el
sitio.

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
4. **`assets/producto/pindi-*.webp`**, 4 archivos y 256 KB, no los enlaza
   nadie: ni el `index.html`, ni un script, ni esta bitácora. Se quedan
   porque borrar material de Kevin no es una decisión de una sesión de
   limpieza — pero si no van a volver, sobran.

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
