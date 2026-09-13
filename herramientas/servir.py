"""
Servidor local para ver el portafolio.

POR QUE EXISTE. `python -m http.server` no soporta Range requests, y sin eso
ningun <video> reproduce: el navegador pide un trozo del MP4, recibe el archivo
entero con codigo 200 y se rinde. Ni el reel ni los recorridos se ven.
Este añade el 206 Partial Content y ya funcionan.

    python herramientas/servir.py          -> http://localhost:8899
"""
import http.server, os, re, socketserver, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PUERTO = int(sys.argv[1]) if len(sys.argv) > 1 else 8899


class Manejador(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(RAIZ), **k)

    def send_head(self):
        rango = self.headers.get("Range")
        if not rango:
            return super().send_head()

        ruta = self.translate_path(self.path)
        if os.path.isdir(ruta):
            return super().send_head()
        try:
            f = open(ruta, "rb")
        except OSError:
            self.send_error(404)
            return None

        total = os.fstat(f.fileno()).st_size
        m = re.match(r"bytes=(\d*)-(\d*)", rango.strip())
        if not m:
            f.close()
            self.send_error(400)
            return None

        ini, fin = m.group(1), m.group(2)
        if ini == "":                      # sufijo: los ultimos N bytes
            largo = int(fin or 0)
            ini = max(0, total - largo)
            fin = total - 1
        else:
            ini = int(ini)
            fin = int(fin) if fin else total - 1
        fin = min(fin, total - 1)
        if ini > fin:
            f.close()
            self.send_error(416)
            return None

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(ruta))
        self.send_header("Content-Range", f"bytes {ini}-{fin}/{total}")
        self.send_header("Content-Length", str(fin - ini + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        f.seek(ini)
        return Trozo(f, fin - ini + 1)

    def end_headers(self):
        # Sin cache: al iterar, un WebP viejo en cache confunde mas que ayuda.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *a):
        pass


class Trozo:
    """Envoltorio que deja de leer al acabar el rango pedido."""
    def __init__(self, f, restante):
        self.f, self.restante = f, restante

    def read(self, n=-1):
        if self.restante <= 0:
            return b""
        if n < 0 or n > self.restante:
            n = self.restante
        datos = self.f.read(n)
        self.restante -= len(datos)
        return datos

    def close(self):
        self.f.close()


class Servidor(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with Servidor(("127.0.0.1", PUERTO), Manejador) as s:
        print(f"http://localhost:{PUERTO}  (raiz: {RAIZ.name})")
        s.serve_forever()
