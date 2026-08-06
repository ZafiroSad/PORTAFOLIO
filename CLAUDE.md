# PORTAFOLIO — STICK INDUSTRIES

Sitio de portafolio para mostrar el trabajo de visualización arquitectónica a clientes.

> VISUAL 3D STUDIO quedó en pausa. La marca del sitio es **STICK INDUSTRIES**.
> Por decisión del Señor Stick, el **logo y el favicon siguen siendo los de V3S
> hasta nuevo aviso**.

## Objetivo

Un enlace que se manda por WhatsApp y abre en dos segundos. Muestra poco y lo
muestra grande: cuatro proyectos en la pantalla principal, seis imágenes dentro
de cada uno. Todo lo demás vive en un índice de texto.

## Estado actual

**v2.0 — funcional, verificado en escritorio. Sin publicar.**

Pendiente antes de publicar:
1. Cargar el número de WhatsApp real (constante `CONTACTO` en `index.html`)
2. Decidir sobre las marcas de terceros en los recorridos (ver *Decisiones abiertas*)
3. Verificar la vista móvil en un teléfono real
4. Publicar en GitHub Pages o dominio propio

## Arquitectura

Un solo `index.html` autónomo: HTML, CSS y JavaScript en el mismo archivo, sin
dependencias ni framework.

```
portafolio-v3s/
├── index.html                   el sitio completo
├── CLAUDE.md                    este archivo
├── propuestas/                  las tres portadas que se compararon
│   ├── index.html               índice comparativo
│   ├── a-cortinas.html
│   ├── b-secuencia.html
│   └── c-tipografia.html        ← la elegida, ya integrada en index.html
├── assets/
│   ├── marca/                   logo blanco y favicon (V3S)
│   ├── renders/                 105 imágenes WebP (16,6 MB)
│   ├── producto/                4 piezas de PINDI
│   └── video/                   6 recorridos + fotogramas de portada (65,8 MB)
└── herramientas/
    ├── optimizar-imagenes.ps1   extrae y convierte los renders desde el archivo
    └── optimizar-videos.ps1     comprime los recorridos para web
```

### Recorrido del sitio

1. **Portada** — máscara tipográfica: el render se ve por dentro de las letras
   de STICK INDUSTRIES, que entran desenfocadas y toman foco una a una. Luego el
   encuadre se abre y la imagen toma la pantalla completa.
2. **Obra** — cuatro proyectos en rejilla 2×2. Al pasar el cursor, la tarjeta
   revela resumen, ficha de datos y la llamada a ver el proyecto.
3. **Ficha de proyecto** — capa a pantalla completa con portada, datos, galería
   editorial, recorrido en video y navegación al proyecto anterior o siguiente.
4. **Archivo** — índice de texto de los siete proyectos restantes. La miniatura
   flota siguiendo el cursor, con retraso.
5. **Técnica**, **Software**, **Contacto**.

### El catálogo vive en el JavaScript

Al final de `index.html`, `DESTACADOS` y `ARCHIVO` describen cada proyecto:
`slug`, `titulo`, `tipo`, `portada`, `piezas` (los números de imagen ya curados,
en orden), `anchas` (cuáles ocupan todo el ancho de la galería), `resumen`,
`datos`, `texto` y `video`.

Para añadir un proyecto: agregar sus rutas en `optimizar-imagenes.ps1`,
ejecutarlo, y añadir una entrada al arreglo. El HTML no se toca.

### Los scripts son la fuente de verdad

`assets/` es material derivado: se regenera completo ejecutando los dos scripts.
El archivo original nunca se modifica; solo se lee desde
`Documents\KEVIN\VISUAL 3D STUDIO`.

## Decisiones tomadas

- **Un solo archivo HTML**, no React. El sitio no tiene estado ni datos dinámicos.
- **Portada tipográfica** (propuesta C) sobre las otras dos: STICK INDUSTRIES es
  un nombre nuevo, y esta portada lo planta a pantalla completa en el primer
  segundo asociándolo de inmediato al trabajo.
- **Curaduría fuerte:** de 105 imágenes disponibles, la pantalla principal
  muestra 4. Un portafolio se juzga por su peor imagen, no por la mejor.
- **Una sola curva de animación** para todo el sitio: `cubic-bezier(.16,1,.3,1)`.
  Arranca rápido y frena largo.
- **Los videos no se precargan.** Solo el fotograma de portada; el video baja al
  pulsar play. Sin esto la página costaría 65 MB al abrirse.
- **Marca de agua propia: se elimina recortando 12% del encuadre**, no con el
  filtro `delogo` de ffmpeg — `delogo` interpola desde los bordes y deja un
  borrón visible cuando la marca cae sobre una línea recta (probado en
  `cazadores-12`).
- **En la portada, las letras no se animan con `transform`.** Al mover un
  elemento recortado con `background-clip:text`, el recorte se rompe y el texto
  sale negro. Se animan `opacity` y `filter`, y el fondo va con
  `background-attachment:fixed` para que las letras compongan una sola imagen.

## Material descartado y por qué

- `VideoScreenShot` de las carpetas D5: capturas automáticas de viewport. Son la
  mayoría de los 3000+ archivos del archivo original.
- `CANTABRIA D5\IMAGENES` (renders `CNT_*`): salidas crudas de D5, sin decorar.
  Limpias de marca de agua pero muy inferiores a las de `RENDERS IA`.
- `LOTE 1 1.jpg` y `LAGO.png`: fotografías reales, no renders.
- Los dos JPG con nombre de código en `CASA WILL`: volumetría gris sin acabado.
- `coincafex-07`: es la lámina de propuesta, no un render de galería.
- `04. MARIO`: no son renders sino la propuesta de la app PINDI.

## Decisiones abiertas

1. **Marcas de terceros en los recorridos.** Los videos de LOTE 23 CANTABRIA y
   LOTE 1 CAZADORES llevan incrustado el logo de **BELVAL — Arq. Diego Beltrán
   Mantilla**, la oficina donde el Señor Stick hace sus prácticas. No se puede
   quitar sin rehacer el render. Hay que decidir si se publican así, se retiran,
   o se acompañan de un crédito.

2. **Nombres propios en el recorrido de LA PUNTA.** Los rótulos del video dicen
   "CUARTO JUAN ANGEL" y "CUARTO LUCIANA". Publicarlo expone los nombres de los
   hijos del cliente en una página pública.

3. **Identidad gráfica de STICK INDUSTRIES.** Hoy se usa el logo de V3S por
   decisión explícita. Cuando haya identidad propia, reemplazar
   `assets/marca/logo-blanco.webp` y `assets/marca/favicon.png`.

## Problemas conocidos

- La vista móvil no se ha verificado en un dispositivo real. El CSS tiene los
  puntos de quiebre (menú a pantalla completa y rejilla de una columna por
  debajo de 760 px) pero falta comprobarlo.
- Los anclas del menú (`#archivo`, `#tecnica`) caen desfasados cuando las
  imágenes aún no han cargado y la altura de la página todavía está creciendo.
- STICK ASSETS y el bot de WhatsApp no tienen enlace público.

## Cómo verlo

Doble clic en `index.html`, o servirlo:

```powershell
cd C:\Users\kevin\Downloads\portafolio-v3s
python -m http.server 8899
```
