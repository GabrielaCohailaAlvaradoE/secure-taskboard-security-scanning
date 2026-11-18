# Escaneo de vulnerabilidades de una aplicación web con Semgrep, Trivy y Gitleaks

**Autores:** Gabriela Estefania Cohaila Alvarado (2022075746) y Jhony Vargas Luque (2022075754)  
**Repositorio:** https://github.com/GabrielaCohailaAlvaradoE/secure-taskboard-security-scanning  
**Aplicación publicada:** https://gabrielacohailaalvaradoe.github.io/secure-taskboard-security-scanning/  
**Video demostrativo:** se añadirá después de la publicación en YouTube.

## Resumen

Publicar una aplicación no es el último paso de seguridad: es el comienzo de una responsabilidad continua. En este proyecto construimos **SecureTaskboard**, una aplicación estática de tareas, y agregamos escaneo automatizado a cada cambio. Elegimos herramientas diferentes para cubrir superficies distintas: Semgrep para el código, Trivy para dependencias y configuración, y Gitleaks para secretos.

El objetivo no fue afirmar que una aplicación es “invulnerable”, sino integrar evidencia repetible antes del despliegue. El repositorio es público y el despliegue se realiza automáticamente mediante GitHub Actions y GitHub Pages.

## La aplicación evaluada

SecureTaskboard permite crear, completar y eliminar tareas. Es deliberadamente simple: no requiere cuentas, no envía datos a un backend y almacena el estado solo en `localStorage`. Esta arquitectura disminuye la superficie expuesta para el prototipo, pero no reemplaza los controles necesarios para una aplicación real.

Un detalle relevante es cómo se muestra el texto ingresado por el usuario. En lugar de insertar cadenas usando `innerHTML`, el código usa `textContent`. De ese modo, una entrada que contenga etiquetas HTML se muestra como texto y no se ejecuta. También añadimos una Content Security Policy mediante meta etiqueta como defensa adicional para este sitio estático.

## Enfoque: defensas complementarias

La página de herramientas de escaneo de vulnerabilidades de OWASP reúne alternativas de distintos tipos. Nuestra selección sigue el principio de cobertura complementaria: una misma herramienta no puede detectar con la misma calidad errores de código, componentes vulnerables, secretos y problemas de configuración.

### 1. Semgrep: análisis estático de código

Semgrep analiza el código fuente buscando patrones. En el workflow ejecutamos reglas `p/owasp-top-ten` y hacemos fallar el job si se detecta una regla de severidad relevante. Es una capa temprana: ayuda a encontrar construcciones inseguras antes de que la aplicación se despliegue.

Comando reproducible:

```bash
docker run --rm -v "$PWD:/src" semgrep/semgrep:1.148.0 semgrep scan --config p/owasp-top-ten --error /src
```

### 2. Trivy: vulnerabilidades, secretos y configuración

Trivy revisa el sistema de archivos del repositorio. La configuración usa los escáneres `vuln`, `misconfig` y `secret`, limita el bloqueo a severidades HIGH y CRITICAL e ignora vulnerabilidades sin corrección disponible. Así se evita mezclar una observación informativa con una condición que debe detener el despliegue.

La revisión abarca tanto dependencias futuras como archivos de infraestructura o configuraciones que se agreguen al proyecto.

### 3. Gitleaks: credenciales en el historial

Un archivo puede ser eliminado, pero un secreto que llegó a un commit puede continuar en el historial. Por eso Gitleaks se ejecuta con el checkout completo (`fetch-depth: 0`). Detectar una credencial requiere respuesta: revocarla o rotarla; simplemente borrarla del archivo actual no basta.

## Automatización y despliegue público

El archivo `.github/workflows/security.yml` se activa con `push`, pull request y ejecución manual. Sus tres jobs funcionan de manera independiente: si cualquiera detecta un hallazgo bloqueante, el resultado queda visible en GitHub Actions para revisión del equipo.

En paralelo, `.github/workflows/deploy-pages.yml` publica la aplicación en GitHub Pages cuando se actualiza la rama `main`. GitHub documenta este flujo como un mecanismo de despliegue automatizado que entrega la URL publicada como salida del job. Configuramos permisos mínimos: `contents: read` para los escaneos y, únicamente para la publicación, `pages: write` e `id-token: write`. Además, las acciones de terceros se fijan a un SHA de commit inmutable en vez de una etiqueta móvil.

## Resultados y límites

En la versión presentada esperamos jobs sin hallazgos HIGH/CRITICAL ni secretos. Ese resultado es evidencia puntual de una configuración concreta, no un certificado definitivo de seguridad. Los resultados cambian cuando se incorporan dependencias, cambia la base de vulnerabilidades o aparece una nueva regla.

Por ello el valor principal es el proceso: escanear automáticamente cada cambio, revisar las alertas con contexto, corregir, volver a ejecutar y conservar el historial de ejecución en el repositorio.

## Conclusión

Semgrep, Trivy y Gitleaks cubren problemas diferentes y juntos dan una señal de seguridad más útil que un único escáner. Al conectarlos con GitHub Actions y GitHub Pages, la seguridad deja de ser una tarea aislada al final del proyecto y pasa a ser parte del ciclo de entrega.

## Referencias

1. OWASP Foundation. [Vulnerability Scanning Tools](https://community.owasp.org/Vulnerability_Scanning_Tools).
2. Semgrep. [Documentación de configuraciones CI](https://semgrep.dev/docs/semgrep-ci/sample-ci-configs).
3. Trivy. [Integraciones CI/CD](https://trivy.dev/docs/latest/ecosystem/cicd/).
4. GitHub Docs. [Deploying your website automatically](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically).
