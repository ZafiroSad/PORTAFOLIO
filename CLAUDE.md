# PORTAFOLIO — Kevin Gil

CV interactiva y portafolio de visualización arquitectónica.

> No busca vender: busca **mostrar el trabajo**. Es la carta de presentación
> de Kevin Gil como ingeniero civil y visualizador.

## Estado actual

**v7.2 — funcional, verificado en escritorio. Sin publicar.**

Pendientes antes de publicar:
1. Los dos usuarios de **Instagram** (hoy `PENDIENTE` en la constante `CONTACTO`)
2. Confirmar que el **315 630 7424** de la hoja de vida es el número para clientes
3. El logo de **Claude** (falta; los otros diez están puestos)
4. Verificar la vista **móvil** en un teléfono real
5. Decidir **qué proyectos y qué renders** quedan (siguen siendo provisionales)
6. Publicar en GitHub Pages o dominio propio

## Arquitectura

Un solo `index.html` autónomo: HTML, CSS y JavaScript en el mismo archivo,
sin dependencias ni framework.

```
PORTAFOLIO/
├── index.html                   el sitio completo
├── CLAUDE.md                    este archivo
├── propuestas/                  las tres portadas que se compararon
├── assets/
│   ├── marca/                   logo y favicon (V3S, por decisión explícita)
│   ├── logos/                   logos de software y escudos de formación
│   ├── renders/                 210 archivos: 105 imágenes en 1600 y 2560 px
│   ├── video/                   6 recorridos + fotogramas de portada
│   └── paletas.json             color dominante por proyecto
└── herramientas/
    ├── optimizar-imagenes.ps1   extrae y convierte los renders del archivo
    ├── optimizar-videos.ps1     comprime los recorridos
    └── extraer-paletas.ps1      saca el color dominante de cada portada
```

### Recorrido

Todo se recorre **desplazando**; el menú superior salta con corte plano (wipe).

1. **Inicio** — máscara tipográfica: el render se ve por dentro de las letras
   de STICK INDUSTRIES. El botón *Inicio* del menú vuelve a tocarla entera.
2. **Proyectos** — cuatro hojas verticales a pantalla completa. En reposo el
   nombre va en vertical; al señalar, la hoja crece y las demás ceden.
   Botón *Ver todos los proyectos* → índice con los once.
3. **Sobre mí** — biografía, herramientas en tira desaturada y trayecto como
   línea de tiempo con hilo continuo.
4. **Contacto** — solo título y botones.

### Lenguaje visual

Sigue `STICK_UI_SYSTEM.md` con la **escala zinc invertida**. El documento
rector declara *dark-first absoluto* y dice que no se contemplan variantes
light: esta pieza es la excepción pedida expresamente, y conviene actualizar
el rector. Se conservan sus demás reglas: mono para todo dato técnico, un solo
CTA por bloque, bordes con opacidad, radios, microinteracciones.

## Decisiones tomadas

- **Un solo archivo HTML.** El sitio no tiene estado ni datos dinámicos.
- **Paleta clara.** El render brilla porque el papel es blanco.
- **Al abrir un proyecto la página se tiñe** con el color dominante de su
  render, mezclado en proporción baja para no comprometer la lectura.
- **Dos resoluciones por render** (1600 y 2560 px) servidas con `srcset`.
- **Los logos de software van en gris al 55%** y solo toman color al señalarlos:
  encerrados en tarjetas iguales, sus formas y paletas dispares se notaban.
- **Marca de agua propia: se elimina recortando 12% del encuadre**, no con
  `delogo` de ffmpeg, que deja borrón sobre líneas rectas (`cazadores-12`).
- **En la portada las letras no se animan con `transform`**: rompe el recorte
  de `background-clip:text`. Se animan `opacity` y `filter`.
- **El rótulo vertical se desplaza en el contenedor, no en el texto**: dentro
  de `writing-mode` vertical con `rotate(180deg)` los ejes quedan girados.
- **La ficha se funde mientras el clon viaja**, no al aterrizar: si no, se ve
  la página anterior por detrás durante todo el vuelo.

## Decisiones abiertas

1. **Marcas de BELVAL** incrustadas en los recorridos de LOTE 23 y CAZADORES
   (la oficina donde hace prácticas). No se quitan sin rehacer el render.
2. **Nombres de menores** en los rótulos del recorrido de LA PUNTA
   ("CUARTO JUAN ANGEL", "CUARTO LUCIANA").
3. **Identidad gráfica propia**: hoy se usa el logo de V3S por decisión
   explícita del Señor Stick.

## Qué falta aportar para que sea más inmersivo

En orden de impacto:
1. **Fotos de obra construida en el mismo encuadre del render** — es el
   argumento más fuerte de su perfil: no solo visualiza, construye.
2. Capturas del modelo en Revit (alambres o clay) para mostrar el paso previo.
3. Un retrato suyo.
4. Fechas reales y cliente de cada proyecto.
5. Videos originales sin comprimir, si se quieren a 1080p.

## Cómo verlo

```powershell
cd C:\Users\kevin\Downloads\PORTAFOLIO
python -m http.server 8899
```