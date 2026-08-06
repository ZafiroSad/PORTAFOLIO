# optimizar-videos.ps1
# Comprime los recorridos de VISUAL 3D STUDIO a un formato apto para la web.
#
# Los originales pesan entre 125 y 170 MB cada uno: imposibles de servir en una
# pagina. Se reducen a 720p con H.264 y sin pista de audio, que es como los
# reproduce el portafolio (en silencio y bajo demanda).
#
#   -crf 26     calidad; a menor numero, mas calidad y mas peso (18 a 28 es el rango util)
#   -preset slow    comprime mas lento pero deja archivos mas livianos
#   -movflags +faststart   coloca el indice al principio para que empiece a
#                          reproducirse antes de terminar de descargar
#   -an         elimina el audio

$ErrorActionPreference = 'Stop'

$RAIZ    = Split-Path -Parent $PSScriptRoot
$DESTINO = Join-Path $RAIZ 'assets\video'
$BASE    = 'C:\Users\kevin\Documents\KEVIN\VISUAL 3D STUDIO'

$VIDEOS = @(
    # segundo = instante del que se toma el fotograma de portada. Por defecto 3,
    # pero los videos que abren con una cortinilla de marca necesitan mas.
    @{ slug = 'coincafex';    origen = "$BASE\02. PROYECTOS TERMINADOS\07. COINCAFEX\05. ENTREGABLE COINCAFEX\VIDEOS RECORRIDOS\COINCAFEX.mp4" }
    @{ slug = 'punta';        segundo = 8; origen = "$BASE\02. PROYECTOS TERMINADOS\03. PUNTA\PUNTA.mp4" }
    @{ slug = 'cazadores';    origen = "$BASE\03. PROYECTOS EN CURSO\02. LOTE 1 CAZADORES\06. ENTREGABLE CAZADORES\LOTE 1 CAZADORES - VIDEO RENDER.mp4" }
    @{ slug = 'cantabria-1';  origen = "$BASE\03. PROYECTOS EN CURSO\03. LOTE 1 CANTABRIA\06. ENTREGABLE CANTABRIA\LOTE 1 CANTABRIA - VIDEO RENDER.mp4" }
    @{ slug = 'cantabria-23'; segundo = 14; origen = "$BASE\03. PROYECTOS EN CURSO\01. LOTE 23 CANTABRIA\05. ENREGABLE 23\LOTE 23 CANTBARIA - VIDEO RENDER.mp4" }
    @{ slug = 'ruitoque';     origen = "$BASE\04. OTROS\01. RENDERS X\CASA 34 RUITOQUE\VIDEO RENDER CASA RUITOQUE.mp4" }
)

if (-not (Test-Path $DESTINO)) { New-Item -ItemType Directory -Path $DESTINO -Force | Out-Null }

foreach ($v in $VIDEOS) {
    if (-not (Test-Path $v.origen)) {
        Write-Warning "No encontrado: $($v.origen)"
        continue
    }

    $salida = Join-Path $DESTINO ($v.slug + '.mp4')
    $poster = Join-Path $DESTINO ($v.slug + '-poster.webp')

    # Comprimir un video tarda varios minutos: si ya esta hecho, no se repite
    if (Test-Path $salida) {
        Write-Host ("{0,-14} ya existe, se omite" -f $v.slug)
        continue
    }

    & ffmpeg -y -loglevel error -i $v.origen `
        -vf "scale=1280:-2" `
        -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p `
        -movflags +faststart -an `
        $salida

    # Fotograma de portada: lo que se ve antes de pulsar play
    $ss = if ($v.segundo) { $v.segundo } else { 3 }
    & ffmpeg -y -loglevel error -ss $ss -i $salida -frames:v 1 `
        -c:v libwebp -quality 80 $poster

    $mb = (Get-Item $salida).Length / 1MB
    Write-Host ("{0,-14} {1,6:N1} MB" -f $v.slug, $mb)
}

$peso = (Get-ChildItem $DESTINO -File | Measure-Object Length -Sum).Sum / 1MB
Write-Host ""
Write-Host ("Peso total video: {0:N1} MB" -f $peso)
