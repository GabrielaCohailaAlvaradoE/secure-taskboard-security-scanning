# Cómo incorporé Semgrep al escaneo de vulnerabilidades de una aplicación web

**Autora:** Gabriela Estefania Cohaila Alvarado (2022075746)  
**Repositorio público:** https://github.com/GabrielaCohailaAlvaradoE/secure-taskboard-security-scanning  
**Aplicación desplegada:** https://gabrielacohailaalvaradoe.github.io/secure-taskboard-security-scanning/  
**Video:** agregar aquí el enlace público de YouTube después de publicarlo.

## Introducción

En un proyecto web pequeño es fácil pensar que la seguridad puede dejarse para el final. Sin embargo, una vulnerabilidad no depende del tamaño de la aplicación: una entrada de usuario, una configuración débil o una dependencia vulnerable pueden aparecer desde el primer commit. En este proyecto construimos SecureTaskboard, una aplicación estática para administrar tareas, e integramos controles automáticos desde el repositorio.

Mi aporte se centró en la interfaz y en el análisis estático con **Semgrep**, una herramienta de SAST que busca patrones inseguros en el código. El objetivo no es prometer que el sistema es invulnerable, sino detectar comportamientos riesgosos antes de que lleguen a producción.

## Una decisión segura desde el código

SecureTaskboard guarda las tareas solamente en `localStorage`, por lo que no hay una base de datos ni un backend que procese datos de los usuarios. Aun así, el texto que una persona escribe debe tratarse con cuidado.

Al renderizar el título de cada tarea usamos `textContent` en vez de `innerHTML`:

```js
label.textContent = task.title;
```

Esta diferencia evita que el navegador interprete una entrada como HTML. Por ejemplo, si alguien escribe una etiqueta en el título, la aplicación la muestra como texto y no la ejecuta. Como defensa adicional incluimos una Content Security Policy en la página estática.

## Semgrep dentro de GitHub Actions

El workflow `.github/workflows/security.yml` se activa en cada `push` a `main`, en pull requests y de forma manual. Para Semgrep se ejecutan reglas relacionadas con OWASP Top Ten:

```yaml
docker run --rm -v "$PWD:/src" semgrep/semgrep:1.148.0 \
  semgrep scan --config p/owasp-top-ten --error /src
```

El parámetro `--error` hace que el job falle cuando una regla bloqueante encuentra un problema. Esto convierte el análisis en una barrera de calidad: el hallazgo aparece directamente en GitHub Actions y debe ser revisado antes de aceptar el cambio.

Durante la primera ejecución, Semgrep encontró un problema real de cadena de suministro: nuestras acciones de GitHub estaban referenciadas con etiquetas como `@v4`. Las etiquetas pueden cambiar, por lo que corregimos el workflow y fijamos cada acción a un SHA de commit inmutable. Así, el propio escáner ayudó a mejorar la automatización que ejecuta los controles.

## Por qué no basta un solo escáner

Semgrep es muy útil para el código, pero no sustituye el escaneo de dependencias, secretos ni configuraciones. Por esa razón el proyecto también utiliza Trivy y Gitleaks. La combinación da una cobertura más amplia: Semgrep busca patrones de programación; Trivy inspecciona componentes, configuraciones y secretos; Gitleaks revisa credenciales incluso en el historial Git.

La página de herramientas de escaneo de vulnerabilidades de OWASP muestra que existen alternativas para diferentes objetivos. La lección principal es que la seguridad se trabaja en capas y no con una sola herramienta.

## Resultado

El repositorio publica la aplicación automáticamente en GitHub Pages y conserva en Actions la evidencia de las ejecuciones. Los resultados limpios son una señal útil, pero no una garantía absoluta; las reglas y las bases de vulnerabilidades cambian. Por eso el valor del proyecto está en repetir el análisis con cada cambio.

## Referencias

1. OWASP Foundation. [Vulnerability Scanning Tools](https://community.owasp.org/Vulnerability_Scanning_Tools).
2. Semgrep. [Sample CI configurations](https://semgrep.dev/docs/semgrep-ci/sample-ci-configs).
3. GitHub Docs. [Deploying your website automatically](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically).
