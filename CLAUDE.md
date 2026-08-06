# PORTAFOLIO V3S

Sitio web de portafolio de VISUAL 3D STUDIO, para mostrar el trabajo a clientes.

## Objetivo

Un enlace que se manda por WhatsApp y abre en dos segundos, mostrando renders,
recorridos y trabajo técnico. Reemplaza el envío de carpetas de imágenes sueltas.

## Estado actual

**v1.0 — funcional, verificado en escritorio. Sin publicar.**

Pendiente antes de publicar:
1. Cargar el número de WhatsApp real (ver *Datos de contacto*)
2. Decidir sobre la marca de agua y las marcas de terceros (ver *Decisiones abiertas*)
3. Verificar la vista móvil en un teléfono real
4. Publicar en GitHub Pages o dominio propio

## Arquitectura

Un solo `index.html` autónomo: HTML, CSS y JavaScript en el mismo archivo, sin
dependencias ni framework. Se puede abrir con doble clic o servir como estático.

```
portafolio-v3s/
├── index.html                   el sitio completo
├── CLAUDE.md                    este archivo
├── assets/
│   ├── marca/                   logo blanco y favicon
│   ├── renders/                 105 imágenes WebP (16,6 MB)
│   ├── producto/                4 piezas de PINDI
│   └── video/                   6 recorridos + fotogramas de portada (65,7 MB)
└── herramientas/
    ├── optimizar-imagenes.ps1   extrae y convierte los renders desde el archivo
    └── optimizar-videos.ps1     comprime los recorridos para web
```

### El inventario vive en el JavaScript

Al final de `index.html` hay cuatro arreglos —`ARQUITECTURA`, `INTERIORISMO`,
`TECNICA`, `VIDEOS`— que describen cada proyecto: `slug`, `titulo`, `meta`,
`n` (cuántas imágenes tiene) y `portada` (cuál abre el bloque).

Las imágenes se nombran `slug-01.webp`, `slug-02.webp`… Para añadir un proyecto
basta con agregar sus rutas en `optimizar-imagenes.ps1`, ejecutarlo, y añadir una
línea al arreglo. No se toca el HTML.

### Los scripts son la fuente de verdad

`assets/` es material derivado: se regenera completo ejecutando los dos scripts.
El archivo original nunca se modifica; solo se lee desde
`Documents\KEVIN\VISUAL 3D STUDIO`.

## Datos de contacto

En `index.html`, constante `CONTACTO` al inicio del bloque `<script>`:

```js
const CONTACTO = {
  whatsapp: '573000000000',   // <-- NÚMERO DE MARCADOR, hay que reemplazarlo
  correo:   'kevingilarevalo10@gmail.com'
};
```

## Decisiones tomadas

- **Un solo archivo HTML**, no React. Coherente con STICK QUANTITY y STICK FIT,
  y suficiente: el sitio no tiene estado ni datos dinámicos.
- **Fondo oscuro y tipografía mínima.** Es el patrón de los estudios de
  visualización de referencia (The Boundary, Bloomimages, Vyonyx): el sitio
  desaparece para que mande la imagen.
- **WebP a 1920 px de ancho.** 105 renders pesan 16,6 MB en total; los originales
  PNG pesaban entre 13 y 23 MB *cada uno*.
- **Los videos no se precargan.** Solo se descarga el fotograma de portada;
  el video baja al pulsar play. Sin esto la página costaría 65 MB al abrirse.
- **Marca de agua: se elimina recortando 12% del encuadre**, no con el filtro
  `delogo` de ffmpeg. `delogo` reconstruye la zona interpolando y deja un borrón
  visible cuando la marca cae sobre una línea recta (probado en `cazadores-12`).
- **La lámina de Coincafex va en la sección técnica, completa.** Recortada a 16/9
  dentro de la galería se perdía todo su contenido.

## Material descartado y por qué

- `VideoScreenShot` de las carpetas D5: capturas automáticas de viewport, sin valor.
  Son la mayoría de los 3000+ archivos del archivo.
- `CANTABRIA D5\IMAGENES` (renders `CNT_*`): salidas crudas de D5, sin decorar.
  Están limpias de marca de agua pero son muy inferiores a las de `RENDERS IA`.
- `LOTE 1 1.jpg` y `LAGO.png`: fotografías reales, no renders.
- Los dos JPG con nombre de código en `CASA WILL`: volumetría gris sin acabado.
- `04. MARIO`: no son renders sino la propuesta de la app PINDI. Se movió a
  `assets/producto/` y aparece en la sección de software.

## Decisiones abiertas

1. **Marca de agua propia.** Los renders de CAZADORES (13 de 14) y CANTABRIA LOTE 1
   (12 de 15) llevan el logo de V3S estampado en el archivo. Hoy se elimina con el
   recorte del 12%. Si se prefiere conservarla, poner `marca = $false` en esos dos
   proyectos dentro de `optimizar-imagenes.ps1` y volver a ejecutarlo.

2. **Marcas de terceros en los recorridos.** Los videos de LOTE 23 CANTABRIA y
   LOTE 1 CAZADORES llevan incrustado el logo de **BELVAL — Arq. Diego Beltrán
   Mantilla**. No se puede quitar sin rehacer el render. Hay que decidir si esos
   recorridos se publican así, se retiran, o se acompañan de un crédito.

3. **Nombres propios en el recorrido de LA PUNTA.** Los rótulos del video dicen
   "CUARTO JUAN ANGEL" y "CUARTO LUCIANA". Publicarlo expone los nombres de los
   hijos del cliente en una página pública.

## Problemas conocidos

- La vista móvil no se ha verificado en un dispositivo real. El CSS tiene los
  puntos de quiebre (menú a pantalla completa y rejilla de una columna por debajo
  de 760 px) pero falta comprobarlo.
- Los enlaces a STICK ASSETS y al bot de WhatsApp no apuntan a ninguna URL porque
  no son públicos.

## Cómo verlo

Doble clic en `index.html`, o servirlo:

```powershell
cd C:\Users\kevin\Downloads\portafolio-v3s
python -m http.server 8899
```
