/**
 * Compone la hoja de vida en PDF (A4, dos hojas) para enviar a empleadores.
 *
 * POR QUE EXISTE. Un portafolio se mira; una hoja de vida se pide, se adjunta
 * a un correo y se imprime. Esta version (2026-11-25) se reescribio para
 * buscar empleo: lidera con lo estructural y el software propio, y lleva una
 * franja de imagenes para que se recuerde.
 *
 * DE DONDE SALEN LOS DATOS. Lo que el sitio ya cuenta se LEE del index.html
 * —contacto, catalogo, aplicaciones— para que el PDF no se desvie del sitio.
 * Lo que una hoja de vida necesita y el sitio no dice (logros por cargo,
 * certificados con su entidad, competencias) se escribe AQUI, en `CV`.
 *
 *   node herramientas/preparar-cv.mjs              PDF en compartir/
 *   node herramientas/preparar-cv.mjs --conservar  deja el HTML para medirlo
 *
 * Se imprime con el Chrome instalado (`--print-to-pdf`): es el unico motor de
 * esta maquina que respeta el CSS de verdad.
 */
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync, unlinkSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = resolve(RAIZ, 'compartir', 'kevin-gil-cv.pdf');
const SITIO = 'zafirosad.github.io/PORTAFOLIO';

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
    PROYECTOS: [...arreglo('PRINCIPALES'), ...arreglo('SECUNDARIOS')],
    ESTRUCTURALES: arreglo('ESTRUCTURALES'),
    APPS: arreglo('APPS'),
    CONTACTO: objeto('CONTACTO'),
  };
}

/* ---------------------------------------------------------------------
   Lo que solo dice la hoja de vida. Cada afirmacion sale de la bitacora de
   su proyecto: nada de cifras redondas ni de logros que no se puedan
   mostrar en una entrevista.
   --------------------------------------------------------------------- */
const CV = {
  nombre: 'Kevin Stick Gil Arévalo',
  oficio: 'Ingeniería civil · Estructuras · BIM · Automatización',
  perfil: `Estudiante de último año de Ingeniería Civil en la UPB <b>(10 semestres, promedio 4.3/5)</b>
    con experiencia real en <b>modelado y detallado estructural en Revit</b>, análisis en <b>ETABS</b>
    y diseño bajo la <b>NSR-10</b>. Mi diferencial es que programo mis propias herramientas: escribí
    <b>ATLAS</b>, que diseña el acero de vigas y columnas a partir de ETABS, y <b>STICK PRO</b>, un
    complemento de 26 herramientas para Revit que hoy es un producto. Trabajo con autonomía,
    aprendo rápido y entrego láminas listas para revisión.`,
  cifras: [
    ['10', 'semestres'], ['4.3', 'promedio / 5'], ['11', 'revisiones emitidas · Gambita'], ['26', 'herramientas Revit'],
  ],
  experiencia: [
    { cargo: 'Practicante ingeniero residente', donde: 'Belval', cuando: '2026 · actual',
      logros: [
        'Modelado arquitectónico, estructural e hidrosanitario en <b>Revit</b>; cantidades de obra extraídas del modelo y verificadas 1:1 contra sus tablas.',
        'Diseño de un <b>mezanine metálico para un horno de 5 t</b>: modelos de ETABS 23 generados por script en Python, tres variantes comparadas (AISC 360-10 / NSR-10) y la elegida con 827 kg de acero y D/C ≤ 0,45.',
        'Cálculo y planos de cubiertas, piscina y escalera metálica del Lote 23 Villas de Cantabria; visor 3D propio para presentar la solución.',
      ] },
    { cargo: 'Modelador y detallador estructural', donde: 'Proyectos con oficina de diseño estructural', cuando: '2026',
      logros: [
        '<b>Gambita</b> — vivienda en pórticos de concreto: modelo en Revit y juego completo de láminas E01–E11 (cimentación, plantas, despieces, escaleras y mampostería), llevado por 11 revisiones con el ingeniero revisor.',
        '<b>Lote 132 · Loma Reserva</b> — predimensionamiento NSR-10 (Títulos B y C) de columnas, vigas, viguetas y riostras; modelo para ETABS y acero propuesto con ATLAS; planos 1:50 hasta REV-4.',
      ] },
    { cargo: 'Fundador', donde: 'STICK INDUSTRIES (antes VISUAL 3D STUDIO)', cuando: '2026 · actual',
      logros: [
        'Visualización arquitectónica para arquitectos y constructoras: {P} proyectos y {I} imágenes publicadas en el portafolio.',
        'Desarrollo de software propio para ingeniería y gestión (ver Software propio).',
      ] },
    { cargo: 'Representante estudiantil', donde: 'Facultad de Ingeniería Civil · UPB', cuando: '2026', logros: [] },
    { cargo: 'Ayudante de obra', donde: 'Obra de vivienda', cuando: '2023',
      logros: ['Replanteo, control de material y manejo de cuadrilla.'] },
  ],
  formacion: [
    ['Ingeniería Civil', 'Universidad Pontificia Bolivariana, Bucaramanga', '2022 – hoy · 10 semestres'],
    ['Especialización en Vías Terrestres', 'Universidad Pontificia Bolivariana', 'Cursando'],
    ['Bachiller Académico Bilingüe', 'Colegio Bilingüe San Juan de Ávila', '2021'],
  ],
  certificados: [
    ['Construcción de pavimento articulado', 'SENA · 120 h', '2026'],
    ['Claude Code in Action', 'Anthropic', '2026'],
    ['IA Práctica', 'Google', '2026'],
    ['English Certificate B2', 'EF SET', '2026'],
    ['Modelado BIM y gestión con Revit', 'ASCEIC – UIS · 50 h', '2025'],
    ['Congreso XOpen · competencia de puentes', 'Soc. Santandereana de Ingeniería', '2025'],
  ],
  software: [
    ['Diseño y BIM', 'Revit (EST · ARQ · MEP), ETABS, AutoCAD, Civil 3D, SketchUp'],
    ['Representación', 'D5 Render, Twinmotion'],
    ['Programación', 'Python (API de Revit y ETABS), HTML/JS, IA aplicada'],
    ['Oficina', 'Excel avanzado, Word, PDF técnico'],
  ],
  normas: 'NSR-10 (Títulos A, B, C, E, K) · ACI 318-19 · AISC 360-10',
  idiomas: [['Español', 'Nativo'], ['Inglés', 'B2 · EF SET 2026 · IELTS 2021']],
  competencias: ['Autonomía', 'Aprendizaje rápido', 'Pensamiento analítico', 'Comunicación técnica', 'Trabajo en equipo', 'Orden y rigor'],
  /* El software que va en la hoja: el de ingenieria. Las de finanzas y
     vida personal no le dicen nada a quien contrata un ingeniero. */
  apps: ['ATLAS', 'STICK PRO', 'QUANTITY', 'DLI', 'AROS', 'VIAS'],
  galeria: [
    ['gambita-01', 'Gambita · modelo estructural'],
    ['gambita-06', 'Gambita · escaleras E09'],
    ['mezanine-01', 'Mezanine 5 t · ETABS'],
    ['cantabria-23-09', 'Lote 23 · visualización'],
  ],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const img = (k) => pathToFileURL(resolve(RAIZ, 'assets', 'renders', `${k}@sm.webp`)).href;
const icono = (ruta) => ruta ? pathToFileURL(resolve(RAIZ, ruta)).href : null;

function hoja(d) {
  const logo = readFileSync(resolve(RAIZ, 'assets/marca/stick-industries.svg'), 'utf8')
    .replace('<svg', '<svg class="logo"');
  const qr = pathToFileURL(resolve(RAIZ, 'compartir', 'qr-portafolio.png')).href;
  const nImg = d.PROYECTOS.reduce((n, p) => n + p.piezas.length + (p.extra?.length || 0), 0);

  const experiencia = CV.experiencia.map((e) => `
    <li class="exp">
      <div class="linea"><span class="cargo">${e.cargo}</span><span class="cuando">${e.cuando}</span></div>
      <div class="donde">${e.donde}</div>
      ${e.logros.length ? `<ul class="logros">${e.logros.map((l) =>
        `<li>${l.replace('{P}', d.PROYECTOS.length).replace('{I}', nImg)}</li>`).join('')}</ul>` : ''}
    </li>`).join('');

  const apps = CV.apps.map((n) => d.APPS.find((a) => a.nombre === n)).filter(Boolean).map((a) => `
    <li class="app">
      <span class="app-ic">${a.icono ? `<img src="${icono(a.icono)}" alt="">` : `<i>${a.nombre[0]}</i>`}</span>
      <span class="app-tx"><b>${esc(a.nombre)}</b> <em>${esc(a.plataforma)}</em><br>${esc(a.que)}</span>
    </li>`).join('');

  const tri = (lista) => lista.map(([a, b, c]) => `
    <li><div class="linea"><b>${esc(a)}</b><span class="cuando">${esc(c)}</span></div><span class="sub">${esc(b)}</span></li>`).join('');

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Kevin Gil Arévalo — Hoja de vida</title>
<style>
  @page { size:A4; margin:0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --tinta:#14151a; --suave:#454852; --debil:#8a8e99; --linea:#dcdee3;
    --grafito:#15161b; --grafito-2:#22242b; --claro:#f1f2f4; --acento:#a4906a;
    --sans:"Century Gothic","Questrial",system-ui,sans-serif;
    --mono:"Consolas","Cascadia Mono",monospace;
  }
  body { font-family:var(--sans); color:var(--tinta); font-size:8.6pt; line-height:1.45;
         -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  /* DOS HOJAS EXPLICITAS, no flujo libre: cada una mide un A4 exacto y su
     contenido se reparte a mano. Asi la barra lateral oscura llega al pie y
     ninguna seccion se parte entre hojas. */
  .pagina { width:210mm; height:297mm; display:grid; grid-template-columns:66mm 1fr;
            overflow:hidden; break-after:page; position:relative; }
  .pagina:last-child { break-after:auto; }

  /* --- barra lateral --- */
  aside { background:var(--grafito); color:#e9eaee; padding:13mm 7mm 10mm 9mm;
          display:flex; flex-direction:column; gap:6mm; }
  aside .logo { width:40mm; height:auto; fill:#fff; display:block; }
  aside h3 { font-family:var(--mono); font-size:6.6pt; letter-spacing:.24em; text-transform:uppercase;
             color:var(--acento); padding-bottom:1.6mm; margin-bottom:2.4mm;
             border-bottom:.5pt solid rgba(255,255,255,.14); }
  aside ul { list-style:none; }
  aside li { margin-bottom:1.9mm; }
  .contacto li { font-family:var(--mono); font-size:7.3pt; color:#d5d7dd; display:flex; gap:2mm; }
  .contacto li span { color:var(--debil); min-width:5mm; }
  .chips { display:flex; flex-wrap:wrap; gap:1.4mm; }
  .chips span { font-size:7pt; padding:.9mm 2.2mm; border-radius:99px;
                border:.5pt solid rgba(255,255,255,.22); color:#e4e5ea; }
  .sw li b { display:block; font-size:7.6pt; color:#fff; }
  .sw li span { font-size:7.4pt; color:#b9bcc5; line-height:1.4; }
  .idioma { display:flex; justify-content:space-between; gap:2mm; font-size:7.6pt; }
  .idioma em { font-style:normal; font-family:var(--mono); font-size:6.8pt; color:#b9bcc5; text-align:right; }
  .qr { margin-top:auto; display:flex; gap:3mm; align-items:center; }
  .qr img { width:19mm; height:19mm; border-radius:2mm; background:#fff; padding:1mm; }
  .qr span { font-family:var(--mono); font-size:6.6pt; color:#b9bcc5; line-height:1.5; }
  .qr b { color:#fff; font-weight:400; }

  /* --- cuerpo --- */
  main { padding:13mm 12mm 10mm 10mm; display:flex; flex-direction:column; gap:5mm; }
  .nombre h1 { font-size:24pt; line-height:1.02; letter-spacing:-.02em; font-weight:700; }
  .oficio { margin-top:2.2mm; font-family:var(--mono); font-size:7.4pt; letter-spacing:.2em;
            text-transform:uppercase; color:var(--acento); }
  .perfil { font-size:9.2pt; line-height:1.55; color:#2a2c33; }
  .perfil b { color:var(--tinta); }
  .cifras { display:grid; grid-template-columns:repeat(4,1fr); gap:2.4mm; }
  .cifra { background:var(--claro); border-radius:2.4mm; padding:2.6mm 3mm; }
  .cifra b { display:block; font-size:16pt; line-height:1; letter-spacing:-.02em; }
  .cifra span { display:block; margin-top:1.2mm; font-family:var(--mono); font-size:6pt;
                letter-spacing:.12em; text-transform:uppercase; color:var(--suave); line-height:1.35; }
  main h2 { font-family:var(--mono); font-size:7pt; letter-spacing:.26em; text-transform:uppercase;
            color:var(--tinta); display:flex; align-items:center; gap:3mm; margin-bottom:3mm; }
  main h2::after { content:''; flex:1; height:.6pt; background:var(--linea); }
  main ul { list-style:none; }
  .linea { display:flex; align-items:baseline; gap:3mm; }
  .cuando { margin-left:auto; font-family:var(--mono); font-size:7pt; color:var(--debil); white-space:nowrap; }
  .exp { margin-bottom:3.4mm; break-inside:avoid; }
  .cargo { font-weight:700; font-size:9.6pt; }
  .donde { font-size:8pt; color:var(--acento); margin-top:.3mm; }
  .logros { margin-top:1.3mm; }
  .logros li { position:relative; padding-left:3.6mm; margin-bottom:1mm; color:#33353c; font-size:8.3pt; }
  .logros li::before { content:''; position:absolute; left:.4mm; top:1.9mm; width:1.4mm; height:1.4mm;
                       border-radius:50%; background:var(--acento); }
  .lista li { margin-bottom:2.2mm; break-inside:avoid; }
  .lista.cols { gap:0 6mm; align-items:start; }
  .lista b { font-size:8.8pt; }
  .sub { display:block; color:var(--suave); font-size:7.9pt; }

  /* --- hoja 2 --- */
  .galeria { display:grid; grid-template-columns:1fr 1fr; gap:2.4mm; }
  .galeria figure { position:relative; border-radius:2.4mm; overflow:hidden; background:#f4f4f2;
                    height:44mm; border:.5pt solid var(--linea); }
  .galeria img { width:100%; height:100%; object-fit:cover; display:block; }
  .galeria figure.dibujo img { object-fit:contain; padding:1.5mm; }
  .galeria figcaption { position:absolute; left:2mm; bottom:1.6mm; font-family:var(--mono); font-size:6.2pt;
                        letter-spacing:.08em; color:#fff; background:rgba(20,21,26,.78);
                        padding:.7mm 1.8mm; border-radius:99px; }
  .apps { display:grid; grid-template-columns:1fr 1fr; gap:2.6mm 4mm; }
  .app { display:flex; gap:2.6mm; align-items:flex-start; break-inside:avoid; }
  .app-ic { flex:none; width:8.5mm; height:8.5mm; border-radius:2.2mm; background:var(--grafito);
            display:grid; place-items:center; }
  .app-ic img { width:5.4mm; height:5.4mm; object-fit:contain; }
  .app-ic i { font-style:normal; font-family:var(--mono); color:#fff; font-size:9pt; }
  .app-tx { font-size:7.6pt; color:#33353c; line-height:1.4; }
  .app-tx b { color:var(--tinta); font-size:8.4pt; }
  .app-tx em { font-style:normal; font-family:var(--mono); font-size:6.3pt; color:var(--debil);
               letter-spacing:.06em; }
  .cols { display:grid; grid-template-columns:1fr 1fr; gap:6mm; }
  .pie { margin-top:auto; padding-top:3mm; border-top:.6pt solid var(--linea); display:flex;
         justify-content:space-between; font-family:var(--mono); font-size:6.6pt; letter-spacing:.16em;
         text-transform:uppercase; color:var(--debil); }
  .cabeza-2 { display:flex; justify-content:space-between; align-items:baseline;
              padding-bottom:3mm; border-bottom:1.4pt solid var(--tinta); }
  .cabeza-2 b { font-size:12pt; }
  .cabeza-2 span { font-family:var(--mono); font-size:7pt; letter-spacing:.18em; text-transform:uppercase; color:var(--debil); }
</style></head>
<body>

<!-- ================= HOJA 1 ================= -->
<section class="pagina">
  <aside>
    ${logo}
    <div>
      <h3>Contacto</h3>
      <ul class="contacto">
        <li><span>T</span>${esc(d.CONTACTO.telefono)}</li>
        <li><span>@</span>${esc(d.CONTACTO.correo)}</li>
        <li><span>◎</span>Bucaramanga, Colombia</li>
        <li><span>↗</span>${SITIO}</li>
      </ul>
    </div>
    <div>
      <h3>Software</h3>
      <ul class="sw">${CV.software.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join('')}</ul>
    </div>
    <div>
      <h3>Normas</h3>
      <p style="font-size:7.4pt;color:#d5d7dd;line-height:1.5">${CV.normas}</p>
    </div>
    <div>
      <h3>Idiomas</h3>
      ${CV.idiomas.map(([a, b]) => `<div class="idioma" style="margin-bottom:1.6mm"><span>${a}</span><em>${b}</em></div>`).join('')}
    </div>
    <div>
      <h3>Competencias</h3>
      <div class="chips">${CV.competencias.map((c) => `<span>${c}</span>`).join('')}</div>
    </div>
    <div class="qr">
      <img src="${qr}" alt="">
      <span><b>Portafolio</b><br>proyectos, láminas<br>y software</span>
    </div>
  </aside>

  <main>
    <div class="nombre">
      <h1>${CV.nombre}</h1>
      <div class="oficio">${CV.oficio}</div>
    </div>
    <p class="perfil">${CV.perfil}</p>
    <div class="cifras">${CV.cifras.map(([n, t]) => `<div class="cifra"><b>${n}</b><span>${t}</span></div>`).join('')}</div>
    <section>
      <h2>Experiencia</h2>
      <ul>${experiencia}</ul>
    </section>
    <section>
      <h2>Formación</h2>
      <ul class="lista">${tri(CV.formacion.map(([a, b, c]) => [a, b, c]))}</ul>
    </section>
  </main>
</section>

<!-- ================= HOJA 2 ================= -->
<section class="pagina">
  <aside>
    ${logo}
    <div>
      <h3>Proyectos estructurales</h3>
      <ul class="sw">${d.ESTRUCTURALES.map((p) => `<li><b>${esc(p.titulo)}</b><span>${esc(p.tipo)} · ${esc(p.estado)}</span></li>`).join('')}</ul>
    </div>
    <div>
      <h3>En línea</h3>
      <ul class="sw">
        <li><b>Portafolio</b><span>zafirosad.github.io/<br>PORTAFOLIO</span></li>
        <li><b>STICK PRO</b><span>zafirosad.github.io/<br>stick-pro</span></li>
      </ul>
    </div>
    <div class="qr">
      <img src="${qr}" alt="">
      <span><b>Escanee</b><br>láminas, renders<br>y modelo 3D</span>
    </div>
  </aside>

  <main>
    <div class="cabeza-2"><b>${CV.nombre}</b><span>Hoja de vida · 2 / 2</span></div>
    <section>
      <h2>Trabajo seleccionado</h2>
      <div class="galeria">${CV.galeria.map(([k, t]) => `
        <figure class="${k.startsWith('gambita') ? 'dibujo' : ''}"><img src="${img(k)}" alt=""><figcaption>${t}</figcaption></figure>`).join('')}
      </div>
    </section>
    <section>
      <h2>Software propio</h2>
      <ul class="apps">${apps}</ul>
    </section>
    <section>
      <h2>Cursos y certificados</h2>
      <ul class="lista cols">${tri(CV.certificados)}</ul>
    </section>
    <div class="pie">
      <span>Referencias disponibles a solicitud</span>
      <span>Stick Industries</span>
    </div>
  </main>
</section>
</body></html>`;
}

function main() {
  if (!CHROME) throw new Error('no encuentro chrome.exe para imprimir el PDF');
  const d = datos();
  const temporal = resolve(RAIZ, 'compartir', '_cv.html');
  writeFileSync(temporal, hoja(d), 'utf8');

  execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--no-pdf-header-footer', '--allow-file-access-from-files',
    `--print-to-pdf=${SALIDA}`,
    pathToFileURL(temporal).href,
  ], {stdio: 'pipe'});

  if (!process.argv.includes('--conservar')) unlinkSync(temporal);
  console.log(`compartir/kevin-gil-cv.pdf  ${(readFileSync(SALIDA).length / 1024).toFixed(0)} KB`);
}

main();
