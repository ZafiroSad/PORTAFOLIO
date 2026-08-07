# optimizar-imagenes.ps1
# Extrae los renders publicables de VISUAL 3D STUDIO y los convierte a WebP
# redimensionados a 1920 px de ancho maximo, listos para la web.
#
# Que hace, en corto:
#   1. Recorre la lista de carpetas fuente definida en $PROYECTOS
#   2. Por cada imagen, llama a ffmpeg para reescalarla y comprimirla a WebP
#   3. La guarda en assets\renders con el nombre  proyecto-01.webp, proyecto-02.webp, ...
#
# WebP pesa entre 5 y 10 veces menos que un PNG con calidad visualmente identica.
# Eso es lo que permite que el portafolio cargue rapido en datos moviles.

$ErrorActionPreference = 'Stop'

$RAIZ    = Split-Path -Parent $PSScriptRoot
$DESTINO = Join-Path $RAIZ 'assets\renders'
$BASE    = 'C:\Users\kevin\Documents\KEVIN\VISUAL 3D STUDIO'

# Dos tamanos por imagen. El navegador elige segun el ancho real que va a
# ocupar y segun la densidad de la pantalla: en un portatil normal baja la
# de 1600, en un monitor grande o una pantalla retina baja la de 2560.
# Servir una sola imagen obliga a elegir entre castigar el movil o
# desperdiciar la pantalla buena.
$ANCHO_MAX = 1600
$CALIDAD   = 86

$ANCHO_ALTA = 2560
$CALIDAD_ALTA = 90

# Los renders generados con IA (Whisk / Gemini) traen una marca de agua fija en la
# esquina superior izquierda, que ocupa hasta el 6% del ancho y el 11% del alto.
#
# Se descarto borrarla con el filtro delogo: ese filtro reconstruye la zona
# interpolando desde los bordes, y cuando la marca cae sobre una linea recta (el
# marco negro de una ventana, por ejemplo) deja un borron perfectamente visible.
#
# En su lugar se recorta un 12% desde el borde superior izquierdo, conservando la
# proporcion original. No inventa pixeles: solo reencuadra un poco mas cerrado.
$RECORTE = 'crop=iw*0.88:ih*0.88:iw*0.12:ih*0.12'

# slug  = nombre del archivo de salida
# rutas = carpetas fuente de ese proyecto
# marca = $true si sus imagenes llevan la marca de agua a borrar
$PROYECTOS = @(
    @{ slug = 'coincafex'; rutas = @(
        "$BASE\02. PROYECTOS TERMINADOS\07. COINCAFEX\03. RENDERS IA",
        "$BASE\02. PROYECTOS TERMINADOS\07. COINCAFEX\05. ENTREGABLE COINCAFEX\RENDERS",
        "$BASE\02. PROYECTOS TERMINADOS\07. COINCAFEX\05. ENTREGABLE COINCAFEX\FACHADA") }

    @{ slug = 'cazadores'; marca = $true; rutas = @(
        "$BASE\03. PROYECTOS EN CURSO\02. LOTE 1 CAZADORES\03. RENDERS IA",
        "$BASE\03. PROYECTOS EN CURSO\02. LOTE 1 CAZADORES\06. ENTREGABLE CAZADORES") }

    @{ slug = 'cantabria-1'; marca = $true; rutas = @(
        "$BASE\03. PROYECTOS EN CURSO\03. LOTE 1 CANTABRIA\03. RENDERS IA",
        "$BASE\03. PROYECTOS EN CURSO\03. LOTE 1 CANTABRIA\06. ENTREGABLE CANTABRIA") }

    @{ slug = 'cantabria-23'; rutas = @(
        "$BASE\03. PROYECTOS EN CURSO\01. LOTE 23 CANTABRIA\03. RENDERS IA") }

    @{ slug = 'punta'; rutas = @(
        "$BASE\02. PROYECTOS TERMINADOS\03. PUNTA\RENDERS PUNTA") }

    @{ slug = 'lebrija'; rutas = @(
        "$BASE\02. PROYECTOS TERMINADOS\01. LEBRIJA\01. CLOSETS\ENTREGABLE",
        "$BASE\02. PROYECTOS TERMINADOS\01. LEBRIJA\02. COCINA\RENDERS") }

    @{ slug = 'snacks'; rutas = @(
        "$BASE\02. PROYECTOS TERMINADOS\02. SNACKS\ENTREGABLE") }

    @{ slug = 'ruitoque'; rutas = @(
        "$BASE\04. OTROS\01. RENDERS X\CASA 34 RUITOQUE") }

    @{ slug = 'casa-will'; rutas = @(
        "$BASE\04. OTROS\01. RENDERS X\CASA WILL") }

    @{ slug = 'cocina-comedor'; rutas = @(
        "$BASE\04. OTROS\01. RENDERS X\COCINA COMEDOR") }

    @{ slug = 'estudio-solar'; rutas = @(
        "$BASE\04. OTROS\01. RENDERS X\U") }
)

# La carpeta 04. MARIO no contiene renders sino la propuesta de la app PINDI:
# se trata aparte, en la seccion de producto digital, no en la de arquitectura.

# Archivos que se excluyen aunque esten en las carpetas fuente:
#   LOTE 1 1.jpg  fotografia del terreno tomada en sitio, no es un render
#   LAGO.png      fotografia aerea de obra construida, no es un render
#   los dos .jpg con nombre de codigo en CASA WILL son vistas del modelo sin
#   acabado (volumetria gris), no piezas terminadas
$EXCLUIR = @(
    'LOTE 1 1.jpg'
    'LAGO.png'
    '2462ecd5-425d-42a6-a6d9-93305cae095c.jpg'
    'ba8b39f0-867b-40e1-8b78-932822714a65.jpg'
)

if (-not (Test-Path $DESTINO)) { New-Item -ItemType Directory -Path $DESTINO -Force | Out-Null }

$totalOk = 0
$totalErr = 0

foreach ($proy in $PROYECTOS) {
    $slug = $proy.slug
    $archivos = @()

    foreach ($ruta in $proy.rutas) {
        if (-not (Test-Path $ruta)) {
            Write-Warning "Ruta inexistente, se omite: $ruta"
            continue
        }
        $archivos += Get-ChildItem $ruta -File -Recurse -Include *.jpg, *.jpeg, *.png, *.webp -ErrorAction SilentlyContinue |
                     Where-Object { $_.DirectoryName -notmatch 'BackUp|VideoScreenShot' -and $EXCLUIR -notcontains $_.Name }
    }

    if ($archivos.Count -eq 0) {
        Write-Warning "$slug : sin imagenes"
        continue
    }

    $i = 0
    foreach ($img in ($archivos | Sort-Object Name)) {
        $i++
        $salida = Join-Path $DESTINO ('{0}-{1:d2}.webp' -f $slug, $i)

        # scale: reduce solo si la imagen supera el ancho maximo; -2 conserva la
        # proporcion y fuerza altura par (requisito de varios codecs)
        # El recorte va antes del reescalado para que el resultado final conserve
        # el ancho maximo completo y no quede una imagen mas pequena que las demas
        $filtro = if ($proy.marca) { "$RECORTE,scale='min($ANCHO_MAX,iw)':-2" }
                  else             { "scale='min($ANCHO_MAX,iw)':-2" }

        & ffmpeg -y -loglevel error -i $img.FullName `
            -vf $filtro `
            -c:v libwebp -quality $CALIDAD -compression_level 6 `
            $salida 2>&1 | Out-Null

        # Version de alta densidad, para pantallas grandes y retina
        $salidaAlta = Join-Path $DESTINO ('{0}-{1:d2}@2x.webp' -f $slug, $i)
        $filtroAlta = if ($proy.marca) { "$RECORTE,scale='min($ANCHO_ALTA,iw)':-2" }
                      else             { "scale='min($ANCHO_ALTA,iw)':-2" }

        & ffmpeg -y -loglevel error -i $img.FullName `
            -vf $filtroAlta `
            -c:v libwebp -quality $CALIDAD_ALTA -compression_level 6 `
            $salidaAlta 2>&1 | Out-Null

        if (Test-Path $salida) { $totalOk++ } else { $totalErr++; Write-Warning "Fallo: $($img.Name)" }
    }

    Write-Host ("{0,-14} {1,3} imagenes" -f $slug, $i)
}

$peso = (Get-ChildItem $DESTINO -File | Measure-Object Length -Sum).Sum / 1MB
Write-Host ""
Write-Host ("Convertidas: {0}   Fallidas: {1}   Peso total: {2:N1} MB" -f $totalOk, $totalErr, $peso)
