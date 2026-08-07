# extraer-paletas.ps1
# Saca el color dominante de la imagen de portada de cada proyecto.
#
# Para que sirve: al entrar a un proyecto, la pagina se tine con el color de
# ese render. No se pinta el color crudo — se mezcla con el fondo hueso en
# una proporcion baja, lo justo para que se note el cambio de temperatura
# sin romper la legibilidad del texto.
#
# Como se obtiene: ffmpeg reduce la imagen a un solo pixel. Ese pixel es el
# promedio de toda la imagen. Como el promedio de una foto suele salir gris
# parduzco, despues se le sube la saturacion por codigo para que el tinte
# tenga caracter.

$ErrorActionPreference = 'Stop'

$RAIZ    = Split-Path -Parent $PSScriptRoot
$RENDERS = Join-Path $RAIZ 'assets\renders'
$SALIDA  = Join-Path $RAIZ 'assets\paletas.json'

# slug = prefijo del archivo | portada = numero de la imagen que abre el proyecto
$PROYECTOS = @(
    @{ slug = 'casa-will';      portada = 1  }
    @{ slug = 'coincafex';      portada = 3  }
    @{ slug = 'punta';          portada = 7  }
    @{ slug = 'cantabria-1';    portada = 6  }
    @{ slug = 'cazadores';      portada = 9  }
    @{ slug = 'cantabria-23';   portada = 7  }
    @{ slug = 'ruitoque';       portada = 1  }
    @{ slug = 'lebrija';        portada = 1  }
    @{ slug = 'cocina-comedor'; portada = 1  }
    @{ slug = 'snacks';         portada = 1  }
    @{ slug = 'estudio-solar';  portada = 1  }
)

$tmp = Join-Path $env:TEMP 'stick-paleta.rgb'
$resultado = [ordered]@{}

foreach ($p in $PROYECTOS) {
    $archivo = Join-Path $RENDERS ('{0}-{1:d2}.webp' -f $p.slug, $p.portada)
    if (-not (Test-Path $archivo)) { Write-Warning "No existe: $archivo"; continue }

    # Un solo pixel, en crudo, sin compresion de por medio
    & ffmpeg -y -loglevel error -i $archivo -vf "scale=1:1" -f rawvideo -pix_fmt rgb24 $tmp 2>&1 | Out-Null
    $bytes = [System.IO.File]::ReadAllBytes($tmp)
    $r = [double]$bytes[0]; $g = [double]$bytes[1]; $b = [double]$bytes[2]

    # RGB -> HSL, para poder subir la saturacion sin alterar el matiz
    $max = [Math]::Max($r, [Math]::Max($g, $b)) / 255
    $min = [Math]::Min($r, [Math]::Min($g, $b)) / 255
    $l = ($max + $min) / 2
    $d = $max - $min

    if ($d -eq 0) { $h = 0; $s = 0 }
    else {
        $s = if ($l -gt 0.5) { $d / (2 - $max - $min) } else { $d / ($max + $min) }
        $rn = $r/255; $gn = $g/255; $bn = $b/255
        $h = switch ($max) {
            $rn     { (($gn - $bn) / $d + $(if ($gn -lt $bn) { 6 } else { 0 })) }
            $gn     { (($bn - $rn) / $d + 2) }
            default { (($rn - $gn) / $d + 4) }
        }
        $h = $h * 60
    }

    # El promedio de una foto sale lavado: se le devuelve caracter
    $sAjustada = [Math]::Min($s * 2.4, 0.62)

    $resultado[$p.slug] = [ordered]@{
        h = [Math]::Round($h)
        s = [Math]::Round($sAjustada * 100)
        l = [Math]::Round($l * 100)
    }

    "{0,-16} h={1,3}  s={2,3}%  l={3,3}%" -f $p.slug, $resultado[$p.slug].h, $resultado[$p.slug].s, $resultado[$p.slug].l
}

Remove-Item $tmp -ErrorAction SilentlyContinue
$resultado | ConvertTo-Json -Compress | Set-Content $SALIDA -Encoding UTF8
Write-Host ""
Write-Host "Escrito: $SALIDA"
