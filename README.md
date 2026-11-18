# SecureTaskboard

Aplicación estática de lista de tareas creada por **Gabriela Estefania Cohaila Alvarado (2022075746)** y **Jhony Vargas Luque (2022075754)** para demostrar escaneo de vulnerabilidades integrado al ciclo de entrega.

## Aplicación

SecureTaskboard no posee servidor ni base de datos: guarda las tareas únicamente en `localStorage` del navegador. Los títulos de las tareas se insertan con `textContent`, no con `innerHTML`, para evitar que texto introducido por el usuario se ejecute como HTML.

## Automatización

Cada `push` o pull request ejecuta tres capas:

1. **Semgrep** (`p/owasp-top-ten`) para analizar patrones de seguridad en el código.
2. **Trivy** para vulnerabilidades, secretos y configuraciones riesgosas del repositorio.
3. **Gitleaks** para detectar credenciales en el historial de Git.

El mismo `push` a `main` publica la aplicación mediante el workflow de GitHub Pages. Los permisos del workflow están restringidos por trabajo: los escaneos solo leen contenido y el despliegue recibe únicamente `pages: write` e `id-token: write`.

## Ejecución local

No se necesitan dependencias: abrir `index.html` en un navegador moderno.

## Evidencia

- Artículo preparado: [`docs/articulo-medium.md`](docs/articulo-medium.md)
- Guion de video: [`docs/guion-video-2-minutos.md`](docs/guion-video-2-minutos.md)
- Matriz de responsabilidades: [`docs/responsabilidades.md`](docs/responsabilidades.md)

## Reproducción de los escaneos

```bash
docker run --rm -v "$PWD:/src" semgrep/semgrep:1.148.0 semgrep scan --config p/owasp-top-ten --error /src
trivy fs --scanners vuln,misconfig,secret --severity HIGH,CRITICAL --ignore-unfixed .
gitleaks git .
```

Los análisis son preventivos; un resultado limpio no equivale a garantía absoluta. Toda alerta debe ser revisada, priorizada y corregida antes de promover una versión.
