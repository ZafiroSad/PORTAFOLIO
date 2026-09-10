/**
 * Genera una pagina de compartir por proyecto: `p/<slug>/index.html` y su `og.jpg`.
 *
 * POR QUE EXISTE. El sitio es un solo `index.html` y los proyectos se abren con
 * `#slug`. Eso basta para un navegador, pero NO para quien pega el enlace en
 * WhatsApp, LinkedIn o un correo: el rastreador que hace la vista previa no
 * ejecuta JavaScript ni lee el fragmento, asi que todos los proyectos salian con
 * la misma imagen y el mismo titulo — el del sitio entero.
 *
 * Con esto, `…/PORTAFOLIO/p/cantabria-23/` es una URL de verdad, con el titulo
 * de ESE proyecto y una imagen de ESE proyecto, y al abrirla el visitante
 * aterriza en la ficha ya abierta.
 *
 * Se ejecuta cuando cambia el catalogo:
 *   node herramientas/preparar-enlaces.mjs
 */
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, rmSync, writeFileSync, existsSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITIO = 'https://zafirosad.github.io/PORTAFOLIO';
const DESTINO = resolve(RAIZ, 'p');

/** Lee los dos arreglos del catalogo del propio index.html. */
function catalogo() {
  const html = readFileSync(resolve(RAIZ, 'index.html'), 'utf8');
  const arreglo = (nombre) => {
    const ini = html.indexOf('[', html.indexOf(`const ${nombre} = [`));
    let n = 0, j = ini;
    for (; j < html.length; j++) {
      if (html[j] === '[') n++;
      else if (html[j] === ']' && --n === 0) break;
    }
    return eval(html.slice(ini, j + 1));
  };
  return [...arreglo('PRINCIPALES'), ...arreglo('SECUNDARIOS')];
}

const escapar = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Primera frase del texto del proyecto: la descripcion de la vista previa. */
function resumen(p) {
  const frase = p.texto.split(/(?<=\.)\s/)[0].trim();
  return frase.length > 180 ? frase.slice(0, 177).trimEnd() + '…' : frase;
}

function pagina(p) {
  const url = `${SITIO}/p/${p.slug}/`;
  const titulo = `${p.titulo} · STICK INDUSTRIES`;
  const desc = resumen(p);
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(titulo)}</title>
<meta name="description" content="${escapar(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${escapar(titulo)}">
<meta property="og:description" content="${escapar(desc)}">
<meta property="og:image" content="${url}og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#15161b">
<link rel="icon" href="../../assets/marca/favicon.svg" type="image/svg+xml">
<link rel="icon" href="../../assets/marca/favicon-32.png" sizes="32x32">
<!-- El rastreador que hace la vista previa se queda con lo de arriba y no
     sigue leyendo. Una persona salta al sitio, con la ficha ya abierta. -->
<meta http-equiv="refresh" content="0; url=../../index.html#${p.slug}">
<style>
  :root { color-scheme: dark }
  body { margin:0; min-height:100vh; display:grid; place-items:center;
         background:#15161b; color:#f7f8fa; text-align:center;
         font-family:ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  a { color:#f7f8fa; }
  img { width:min(88vw, 620px); border-radius:14px; display:block; margin:0 auto 1.6rem; }
  p { font-family:ui-monospace, Consolas, monospace; font-size:.72rem;
      letter-spacing:.2em; text-transform:uppercase; color:#adb0bb; }
</style>
</head>
<body>
  <main>
    <img src="og.jpg" alt="${escapar(p.titulo)}">
    <p><a href="../../index.html#${p.slug}">Abrir en el portafolio</a></p>
  </main>
  <script>location.replace('../../index.html#${p.slug}');</script>
</body>
</html>
`;
}

function main() {
  const proyectos = catalogo();
  rmSync(DESTINO, {recursive: true, force: true});

  for (const p of proyectos) {
    const carpeta = resolve(DESTINO, p.slug);
    mkdirSync(carpeta, {recursive: true});
    writeFileSync(resolve(carpeta, 'index.html'), pagina(p), 'utf8');

    // La imagen la compone el mismo script que hace la del sitio, para que
    // todas las vistas previas se vean como la misma marca.
    const render = `${p.arch}-${String(p.portada).padStart(2, '0')}@2x.webp`;
    if (!existsSync(resolve(RAIZ, 'assets/renders', render))) {
      throw new Error(`falta el render de portada: ${render}`);
    }
    execFileSync('python', [
      resolve(RAIZ, 'herramientas/preparar-og.py'),
      '--render', render,
      '--titulo', p.titulo,
      // Tipo, año y estado: el lugar ya suele venir en el título del proyecto
      // y repetirlo debajo no añade nada.
      '--pie', [p.tipo, p.anio, p.estado].filter(Boolean).join(' · '),
      '--salida', resolve(carpeta, 'og.jpg'),
    ], {stdio: 'inherit'});
  }

  mapaDelSitio(proyectos);

  console.log(`\n${proyectos.length} paginas en p/, mas sitemap.xml y robots.txt`);
  console.log(proyectos.map((p) => `  ${SITIO}/p/${p.slug}/`).join('\n'));
}

/**
 * Mapa del sitio y robots.txt.
 *
 * Sin esto un buscador solo conoce la portada: las paginas de proyecto no
 * estan enlazadas desde ninguna parte —el sitio los abre con JavaScript— y por
 * tanto no existen para el. Con el mapa, cada proyecto es una pagina indexable
 * con su propio titulo y su propia imagen.
 */
function mapaDelSitio(proyectos) {
  const urls = [`${SITIO}/`, ...proyectos.map((p) => `${SITIO}/p/${p.slug}/`)];
  const entradas = urls.map((u, i) => [
    '  <url>',
    `    <loc>${u}</loc>`,
    '    <changefreq>monthly</changefreq>',
    `    <priority>${i === 0 ? '1.0' : '0.8'}</priority>`,
    '  </url>',
  ].join('\n')).join('\n');

  writeFileSync(resolve(RAIZ, 'sitemap.xml'), [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entradas,
    '</urlset>',
    '',
  ].join('\n'), 'utf8');

  writeFileSync(resolve(RAIZ, 'robots.txt'),
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITIO}/sitemap.xml`, ''].join('\n'), 'utf8');
}

main();
