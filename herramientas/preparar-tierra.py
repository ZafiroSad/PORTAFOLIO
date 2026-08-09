"""
Prepara assets/datos/tierra.json: la silueta de los continentes que dibuja
el globo de la ficha de proyecto.

Toma el GeoJSON de Natural Earth (ne_110m_land) y lo adelgaza con
Douglas-Peucker hasta dejarlo en unos pocos miles de vertices, que es todo
lo que necesita un globo de 300 px. Salida: una lista de anillos, cada uno
un array plano [lon, lat, lon, lat, ...] con dos decimales.

    python herramientas/preparar-tierra.py  ruta/ne_110m_land.geojson
"""
import json, sys, os

TOLERANCIA = 0.55   # grados; sube para adelgazar mas
MINIMO     = 12     # anillos con menos vertices que esto se descartan


def distancia(p, a, b):
    """Distancia perpendicular del punto p al segmento a-b."""
    (px, py), (ax, ay), (bx, by) = p, a, b
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return ((px - ax) ** 2 + (py - ay) ** 2) ** .5
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return ((px - (ax + t * dx)) ** 2 + (py - (ay + t * dy)) ** 2) ** .5


def adelgazar(puntos, tol):
    if len(puntos) < 3:
        return puntos
    lejos, dmax = 0, 0
    for i in range(1, len(puntos) - 1):
        d = distancia(puntos[i], puntos[0], puntos[-1])
        if d > dmax:
            lejos, dmax = i, d
    if dmax > tol:
        return adelgazar(puntos[:lejos + 1], tol)[:-1] + adelgazar(puntos[lejos:], tol)
    return [puntos[0], puntos[-1]]


def anillos_de(geom):
    t = geom['type']
    if t == 'Polygon':
        return geom['coordinates']
    if t == 'MultiPolygon':
        return [anillo for poly in geom['coordinates'] for anillo in poly]
    return []


def main():
    origen = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        os.environ.get('TEMP', '.'), 'ne_land.geojson')
    with open(origen, encoding='utf-8') as f:
        datos = json.load(f)

    sys.setrecursionlimit(10000)
    salida, antes, despues = [], 0, 0

    for rasgo in datos['features']:
        for anillo in anillos_de(rasgo['geometry']):
            antes += len(anillo)
            fino = adelgazar([tuple(c[:2]) for c in anillo], TOLERANCIA)
            if len(fino) < MINIMO:
                continue
            despues += len(fino)
            plano = []
            for lon, lat in fino:
                plano.append(round(lon, 2))
                plano.append(round(lat, 2))
            salida.append(plano)

    destino = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                           'assets', 'datos', 'tierra.json')
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    with open(destino, 'w', encoding='utf-8') as f:
        json.dump(salida, f, separators=(',', ':'))

    print(f'{len(salida)} anillos · {antes} -> {despues} vertices · '
          f'{os.path.getsize(destino) / 1024:.1f} KB')


if __name__ == '__main__':
    main()
