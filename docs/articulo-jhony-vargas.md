# Trivy, Gitleaks y GitHub Pages: seguridad automatizada antes de publicar una aplicación

**Autor:** Jhony Vargas Luque (2022075754)  
**Repositorio público:** https://github.com/GabrielaCohailaAlvaradoE/secure-taskboard-security-scanning  
**Aplicación desplegada:** https://gabrielacohailaalvaradoe.github.io/secure-taskboard-security-scanning/  
**Video:** agregar aquí el enlace público de YouTube después de publicarlo.

## Introducción

Desplegar una aplicación en Internet exige más que comprobar que funciona. También se debe revisar qué dependencias contiene, si algún archivo tiene una configuración insegura y si una credencial llegó al repositorio por error. Para demostrar este enfoque trabajamos con SecureTaskboard, una aplicación estática de tareas publicada mediante GitHub Pages.

Mi aporte se concentró en las capas de escaneo con **Trivy** y **Gitleaks**, así como en el despliegue automatizado. Las dos herramientas complementan el análisis del código porque inspeccionan riesgos que no siempre son visibles en una sola línea de JavaScript.

## Trivy: componentes, configuración y secretos

Trivy analiza el sistema de archivos del repositorio. En nuestro workflow se configura para ejecutar tres escáneres:

```yaml
uses: aquasecurity/trivy-action@SHA_INMUTABLE
with:
  scan-type: fs
  scan-ref: .
  scanners: vuln,misconfig,secret
  severity: HIGH,CRITICAL
  exit-code: '1'
  ignore-unfixed: true
```

El escáner `vuln` identifica vulnerabilidades conocidas en componentes detectados. `misconfig` busca configuraciones que puedan abrir riesgos y `secret` busca valores que parezcan credenciales. La política bloquea vulnerabilidades HIGH y CRITICAL que tienen corrección disponible, para priorizar problemas accionables.

Aunque la versión actual de SecureTaskboard no usa paquetes externos, este control queda preparado para futuras dependencias o archivos de infraestructura. De esa forma, la seguridad no depende de que alguien recuerde ejecutar un comando antes de liberar una versión.

## Gitleaks: el historial también importa

Una credencial puede seguir expuesta aun cuando se borra del archivo actual, porque Git mantiene versiones previas. Por eso Gitleaks se ejecuta con `fetch-depth: 0`, lo que permite analizar el historial completo disponible.

```yaml
- uses: gitleaks/gitleaks-action@SHA_INMUTABLE
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Si Gitleaks detecta una clave, la acción correcta no es solo eliminarla del código: debe revocarse o rotarse en el proveedor correspondiente, investigar el alcance y evitar que vuelva a incluirse. Este punto es importante porque el secreto pudo haber sido copiado por otra persona desde un commit anterior.

## Despliegue público con permisos mínimos

Después de los controles, el workflow `deploy-pages.yml` publica el contenido estático en GitHub Pages. El trabajo de despliegue tiene únicamente los permisos que necesita: `contents: read`, `pages: write` e `id-token: write`. Los jobs de seguridad, en cambio, solo leen el repositorio.

Las acciones externas también están fijadas a hashes de commit inmutables. Esta práctica reduce el riesgo de que una etiqueta de versión sea cambiada posteriormente por terceros. El primer análisis con Semgrep nos ayudó a detectar precisamente esta mejora.

## Conclusión

Trivy y Gitleaks no reemplazan la revisión humana, pero reducen errores repetitivos y hacen visible la evidencia de seguridad dentro del proceso de entrega. Al combinar estos controles con Semgrep y GitHub Pages, cada cambio del proyecto tiene un proceso reproducible: analizar, revisar, corregir si corresponde y desplegar.

## Referencias

1. OWASP Foundation. [Vulnerability Scanning Tools](https://community.owasp.org/Vulnerability_Scanning_Tools).
2. Trivy. [CI/CD integrations](https://trivy.dev/docs/latest/ecosystem/cicd/).
3. Gitleaks. [GitHub Action](https://github.com/gitleaks/gitleaks-action).
4. GitHub Docs. [Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
