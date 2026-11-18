# Guion para video público — duración objetivo: 2:00

**Formato recomendado:** YouTube público, horizontal 16:9, 1080p. Usar grabación de pantalla con voz de ambos integrantes. Duración máxima permitida por la consigna: 5 minutos; esta versión dura aproximadamente 2 minutos.

| Tiempo | Imagen en pantalla | Locución |
|---|---|---|
| 0:00–0:12 | Título, nombres y códigos | “Somos Gabriela Estefania Cohaila Alvarado, código 2022075746, y Jhony Vargas Luque, código 2022075754. Presentamos SecureTaskboard y nuestro proceso de escaneo de vulnerabilidades.” |
| 0:12–0:30 | Aplicación publicada; agregar y completar una tarea | “La aplicación es un tablero de tareas estático. No tiene backend: conserva los datos solo en el navegador. Además, usamos `textContent` para que un título ingresado por el usuario no se interprete como HTML.” |
| 0:30–0:47 | Repositorio público y árbol de archivos | “El repositorio es público e incluye el código, la documentación y los workflows de GitHub Actions. Con cada cambio en main se ejecuta seguridad y se despliega automáticamente.” |
| 0:47–1:08 | Workflow Security scans en GitHub | “La primera capa es Semgrep, un análisis estático con reglas de OWASP Top Ten. Busca patrones inseguros directamente en el código antes de publicar.” |
| 1:08–1:27 | Job de Trivy y luego Gitleaks | “La segunda capa es Trivy, que revisa vulnerabilidades conocidas, configuraciones y secretos. La tercera es Gitleaks, que busca credenciales expuestas también en el historial Git.” |
| 1:27–1:43 | Workflows exitosos; pestaña Environments/Pages | “Si los controles pasan, el workflow de Pages publica la versión estática. Los permisos son mínimos: los escaneos solo leen el repositorio y el despliegue solo tiene los permisos que necesita.” |
| 1:43–1:55 | Sitio público y artículo | “Publicamos el código y la aplicación; el artículo explica por qué usamos varias herramientas: ninguna cubre por sí sola código, dependencias, secretos y configuración.” |
| 1:55–2:00 | Diapositiva final con enlaces | “Gracias. Los enlaces al repositorio, despliegue, artículo y video están en la entrega.” |

## Lista de grabación y publicación

1. Abrir en pestañas el sitio desplegado, el repositorio, la pestaña **Actions** con los tres jobs verdes y el artículo publicado.
2. Grabar la pantalla a 1080p con las intervenciones alternadas de Gabriela y Jhony según la tabla.
3. Exportar a MP4, revisar que dure entre 1:55 y 2:10 y subirlo como **Público** a YouTube.
4. Usar este título: `Escaneo de vulnerabilidades con Semgrep, Trivy y Gitleaks | SecureTaskboard`.
5. Añadir en la descripción los enlaces definitivos de repositorio, despliegue y artículo.
