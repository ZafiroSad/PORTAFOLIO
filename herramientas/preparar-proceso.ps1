# Prepara la secuencia de la seccion PROCESO a partir del video fuente.
#
# La escena NO se monta con <video>: un <video> obliga a mover currentTime
# en cada cuadro del desplazamiento, y un salto pedido antes de que el
# anterior resuelva se descarta — medido en Chrome, el video se quedaba
# clavado con `seeking` en true para siempre. Dibujar el fotograma que
# toca en un canvas no depende del decodificador y va igual en movil.
#
#   .\herramientas\preparar-proceso.ps1  [-Fuente fuentes\proceso-original.mp4]

param(
  [string]$Fuente = "fuentes\proceso-original.mp4"
)

$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

if (-not (Test-Path $Fuente)) {
  Write-Host "No encuentro el video fuente: $Fuente" -ForegroundColor Red
  exit 1
}

$grandes = "assets\proceso\g"
$chicos  = "assets\proceso\p"
foreach ($d in @($grandes, $chicos)) {
  if (Test-Path $d) { Remove-Item $d -Recurse -Force }
  New-Item -ItemType Directory -Force $d | Out-Null
}

# Escritorio: uno de cada dos cuadros (120 de 240), 1040 px de ancho
ffmpeg -y -v error -i $Fuente `
  -vf "select='not(mod(n\,2))',scale=1040:-2" -vsync vfr `
  -c:v libwebp -quality 68 -compression_level 6 "$grandes\%03d.webp"

# Movil: uno de cada cuatro, 720 px
ffmpeg -y -v error -i $Fuente `
  -vf "select='not(mod(n\,4))',scale=720:-2" -vsync vfr `
  -c:v libwebp -quality 68 -compression_level 6 "$chicos\%03d.webp"

$ng = (Get-ChildItem $grandes).Count
$np = (Get-ChildItem $chicos).Count
$pg = [math]::Round(((Get-ChildItem $grandes | Measure-Object Length -Sum).Sum / 1MB), 1)
$pp = [math]::Round(((Get-ChildItem $chicos  | Measure-Object Length -Sum).Sum / 1MB), 1)

Write-Host "Escritorio: $ng cuadros - $pg MB"
Write-Host "Movil:      $np cuadros - $pp MB"
Write-Host ""
Write-Host "Si cambia el numero de cuadros, actualizar TOTAL en index.html" -ForegroundColor Yellow
