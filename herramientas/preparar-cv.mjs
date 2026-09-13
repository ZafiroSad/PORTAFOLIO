/**
 * Compone la hoja de vida en PDF a partir de los datos que ya estan en el sitio.
 *
 * POR QUE EXISTE. Un portafolio se mira; una hoja de vida se pide, se adjunta a
 * un correo y se imprime. Cualquier proceso —una practica, una oficina, una
 * licitacion— la pide en PDF, y hasta ahora habia que escribirla aparte y
 * mantenerla sincronizada a mano con el sitio.
 *
 * Aqui el CV NO tiene datos propios: lee el trayecto, las herramientas, el
 * catalogo y el contacto del `index.html`. Si el sitio cambia, se vuelve a
 * correr esto y el PDF cuenta lo mismo que el sitio, sin desviarse.
 *
 *   node herramientas/preparar-cv.mjs
 *
 * Se imprime con el Chrome que ya esta instalado (`--print-to-pdf`) porque es
 * el unico motor de esta maquina que respeta CSS de verdad: tipografia,
 * cuadricula y color salen como se disenaron, no aproximados.
 */
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync, unlinkSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = resolve(RAIZ, 'compartir', 'kevin-gil-cv.pdf');
const SITIO = 'https://zafirosad.github.io/PORTAFOLIO';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find(existsSync);

/** Lee del index.html los mismos arreglos que usa el sitio. */
function datos() {
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
  const objeto = (nombre) => {
    const ini = html.indexOf('{', html.indexOf(`const ${nombre} = {`));
    const fin = html.indexOf('};', ini);
    return eval('(' + html.slice(ini, fin + 1) + ')');
  };
  return {
    HITOS: arreglo('HITOS'),
    UTILES: arreglo('UTILES'),
    ETAPAS: arreglo('ETAPAS'),
    PROYECTOS: [...arreglo('PRINCIPALES'), ...arreglo('SECUNDARIOS')],
    CONTACTO: objeto('CONTACTO'),
  };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Los hitos que son formacion y los que son trabajo, en dos columnas. */
const ES_TRABAJO = new Set(['Ayudante de obra', 'VISUAL 3D STUDIO', 'STICK INDUSTRIES',
                            'Representante estudiantil']);

function hoja(d) {
  const logo = readFileSync(resolve(RAIZ, 'assets/marca/stick-industries.svg'), 'utf8')
    .replace('<svg', '<svg class="logo"');

  const trabajo = d.HITOS.filter((h) => ES_TRABAJO.has(h.titulo)).reverse();
  const formacion = d.HITOS.filter((h) => !ES_TRABAJO.has(h.titulo)).reverse();

  const bloque = (h) => `
      <li>
        <div class="linea">
          <span class="titulo">${esc(h.titulo)}</span>
          ${h.estado ? `<span class="estado">${esc(h.estado)}</span>` : ''}
          <span class="anio">${esc(h.anio)}</span>
        </div>
        <p>${esc(h.detalle)}</p>
      </li>`;

  const porEtapa = d.ETAPAS.map((e, i) => `
      <li>
        <span class="etapa">${esc(e.t)}</span>
        <span class="lista">${d.UTILES.filter((u) => u.etapa === i).map((u) => esc(u.nombre)).join(' · ')}</span>
      </li>`).join('');

  // Solo los cuatro que abren la vitrina del sitio. Una hoja de vida no es un
  // inventario: lista lo que sostiene el argumento y remite al resto.
  const destacados = d.PROYECTOS.slice(0, 4);
  const obra = destacados.map((p) => `
      <li>
        <span class="titulo">${esc(p.titulo)}</span>
        <span class="meta">${esc([p.tipo, p.lugar, p.anio].join(' · '))}</span>
      </li>`).join('')
    + `<li class="resto">y ${d.PROYECTOS.length - destacados.length} proyectos más en el portafolio</li>`;

  const totalPiezas = d.PROYECTOS.reduce((n, p) => n + p.piezas.length + (p.extra?.length || 0), 0);

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Kevin Gil — Hoja de vida</title>
<style>
  @page { size: A4; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }

  /* Century Gothic es la tipografia de la marca; llega con Windows. La mono
     del sitio no tiene equivalente impreso, asi que el dato tecnico va en
     Consolas, que es la que usa el resto del material de marca. */
  :root {
    --tinta:#15161b; --suave:#4a4d57; --debil:#8b8f9a;
    --arena:#a4906a; --linea:#d9dbe0;
    --sans:"Century Gothic", "Questrial", system-ui, sans-serif;
    --mono:"Consolas", "Cascadia Mono", monospace;
  }
  /* ALTURA EXACTA, no minima: con min-height mas el relleno el cuerpo medía
     325 mm y Chrome partia el CV en dos hojas. Una hoja de vida que se desborda
     a una segunda pagina casi vacia se lee como un descuido.
     (Sin comillas invertidas en estos comentarios: todo este bloque vive
     dentro de un template string y una sola lo cerraria antes de tiempo.) */
  /* Sin altura fija. Con height + padding el cuerpo desbordaba y Chrome
     sacaba una segunda hoja casi vacia; midiendolo con el cuerpo a 150 mm
     seguian saliendo dos, asi que el problema no era la altura sino fijarla.
     Fluyendo, el numero de hojas lo decide el contenido, que es lo correcto.
     (Sin comillas invertidas en estos comentarios: este bloque vive dentro
     de un template string y una sola lo cerraria antes de tiempo.) */
  body { width:210mm; padding:12mm 15mm 8mm;
         font-family:var(--sans); color:var(--tinta); font-size:9.1pt; line-height:1.5;
         -webkit-print-color-adjust:exact; print-color-adjust:exact; }

  header { display:flex; justify-content:space-between; align-items:flex-start;
           gap:10mm; padding-bottom:4mm; border-bottom:1.6pt solid var(--tinta); }
  .logo { width:44mm; height:auto; fill:var(--tinta); display:block; }
  h1 { font-size:21pt; letter-spacing:-.01em; line-height:1.05; margin-top:3mm; }
  .oficio { font-family:var(--mono); font-size:7.6pt; letter-spacing:.22em;
            text-transform:uppercase; color:var(--suave); margin-top:1.6mm; }
  .contacto { font-family:var(--mono); font-size:7.6pt; line-height:2; text-align:right;
              color:var(--suave); white-space:nowrap; }
  .contacto b { color:var(--tinta); font-weight:400; }

  .perfil { margin:3.2mm 0 3.2mm; font-size:10.4pt; line-height:1.55; max-width:158mm; }
  .perfil strong { font-weight:700; }

  /* SIN break-inside aqui. Con el, el segundo bloque no cabia entero en lo
     que quedaba de hoja y saltaba completo a una segunda, dejando un tercio
     de la primera en blanco. Lo que no debe partirse es cada seccion. */
  .rejilla { display:grid; grid-template-columns:1fr 1fr; gap:9mm; align-items:start; }
  .columna { display:flex; flex-direction:column; gap:4mm; }
  section { break-inside:avoid; }
  h2 { font-family:var(--mono); font-size:7.4pt; letter-spacing:.26em; text-transform:uppercase;
       color:var(--arena); padding-bottom:1.6mm; margin-bottom:3.4mm;
       border-bottom:.6pt solid var(--linea); }

  ul { list-style:none; }
  li { margin-bottom:2.4mm; break-inside:avoid; }
  .linea { display:flex; align-items:baseline; gap:2.4mm; }
  .titulo { font-weight:700; font-size:9.6pt; }
  .estado { font-family:var(--mono); font-size:6.6pt; letter-spacing:.14em; text-transform:uppercase;
            color:var(--suave); border:.5pt solid var(--linea); border-radius:99px; padding:.4mm 1.6mm; }
  .anio { margin-left:auto; font-family:var(--mono); font-size:7.4pt; color:var(--debil); }
  li p { color:var(--suave); font-size:8.5pt; line-height:1.45; margin-top:.6mm; }

  .oficio-lista li { display:flex; gap:3mm; align-items:baseline; margin-bottom:2.4mm; }
  .etapa { font-weight:700; min-width:26mm; }
  .lista { color:var(--suave); }

  .obra li { display:flex; flex-direction:column; margin-bottom:2.1mm; }
  .obra .resto { font-family:var(--mono); font-size:7.2pt; color:var(--arena);
                 letter-spacing:.12em; margin-top:1mm; }
  .obra .meta { font-family:var(--mono); font-size:7.2pt; color:var(--debil); letter-spacing:.05em; }

  .cifras { display:flex; gap:8mm; margin:1mm 0 0; }
  .cifra b { display:block; font-size:17pt; line-height:1.1; }
  .cifra span { font-family:var(--mono); font-size:6.8pt; letter-spacing:.18em;
                text-transform:uppercase; color:var(--debil); }

  footer { margin-top:5mm; padding-top:4mm; border-top:.6pt solid var(--linea);
           display:flex; justify-content:space-between; align-items:center;
           font-family:var(--mono); font-size:7.2pt; letter-spacing:.16em;
           text-transform:uppercase; color:var(--debil); }
  .pie-marco { display:block; }
</style></head>
<body>
<div class="pie-marco">
  <header>
    <div>
      ${logo}
      <h1>Kevin Stick Gil Arévalo</h1>
      <div class="oficio">Ingeniero civil · Visualización arquitectónica</div>
    </div>
    <div class="contacto">
      <b>${esc(d.CONTACTO.telefono)}</b><br>
      ${esc(d.CONTACTO.correo)}<br>
      Bucaramanga, Colombia<br>
      ${SITIO.replace('https://', '')}
    </div>
  </header>

  <p class="perfil">Un render no empieza en la imagen: empieza en el modelo. Los espesores y los
     apoyos que se ven en pantalla son los mismos que después se replantean en obra, y
     <strong>varias visitas a obra por semana</strong> son las que enseñan dónde se separan.</p>

  <div class="cifras">
    <div class="cifra"><b>${d.PROYECTOS.length}</b><span>Proyectos</span></div>
    <div class="cifra"><b>${totalPiezas}</b><span>Imágenes</span></div>
    <div class="cifra"><b>9</b><span>Semestres</span></div>
    <div class="cifra"><b>4.2</b><span>Promedio / 5</span></div>
  </div>

  <!-- DOS COLUMNAS, no dos rejillas apiladas. Trayectoria es mas corta que
       Formacion, y con dos rejillas ese desnivel dejaba un hueco muerto que
       empujaba el segundo bloque a una hoja nueva. Asi cada columna sigue
       hacia abajo con lo suyo y el hueco desaparece. -->
  <div class="rejilla" style="margin-top:6mm">
    <div class="columna">
      <section>
        <h2>Trayectoria</h2>
        <ul>${trabajo.map(bloque).join('')}</ul>
      </section>
      <section>
        <h2>Herramientas</h2>
        <ul class="oficio-lista">${porEtapa}</ul>
      </section>
    </div>
    <div class="columna">
      <section>
        <h2>Formación</h2>
        <ul>${formacion.map(bloque).join('')}</ul>
      </section>
      <section>
        <h2>Obra representada</h2>
        <ul class="obra">${obra}</ul>
      </section>
    </div>
  </div>

  <footer>
    <span>Portafolio completo · ${SITIO.replace('https://', '')}</span>
    <span>Stick Industries</span>
  </footer>
</div>
</body></html>`;
}

function main() {
  if (!CHROME) throw new Error('no encuentro chrome.exe para imprimir el PDF');
  const d = datos();
  const temporal = resolve(RAIZ, 'compartir', '_cv.html');
  writeFileSync(temporal, hoja(d), 'utf8');

  execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--no-pdf-header-footer',
    `--print-to-pdf=${SALIDA}`,
    'file:///' + temporal.replace(/\\/g, '/'),
  ], {stdio: 'pipe'});

  // `--conservar` deja el HTML al lado del PDF para poder medirlo en un
  // navegador cuando la paginacion no sale como se espera.
  if (!process.argv.includes('--conservar')) unlinkSync(temporal);
  console.log(`compartir/kevin-gil-cv.pdf  ${(readFileSync(SALIDA).length / 1024).toFixed(0)} KB`);
}

main();
