# PROMPTS — Video prueba técnica Fullstack

Repositorio de trabajo: `https://github.com/latecnologiaavanza/video-prueba-tecnica-fullstack.git`

Esta carpeta reúne las instrucciones del **backend** utilizadas o documentadas durante la preparación del video. Su propósito es que puedas consultar el orden de trabajo, mostrar los prompts durante la grabación y explicar las verificaciones manuales.

## Importante

- **No vuelvas a ejecutar todos estos prompts en tu rama `main`**: el backend ya está implementado y sus 8 pruebas pasaron en GitHub Actions.
- Estos documentos están pensados como **registro/reproducción educativa** del proceso. Los pasos 01 y 02 están marcados como *reconstrucciones*: no fue posible recuperar su texto literal original, aunque sí los requisitos y archivos resultantes.
- Los pasos 03 a 07 recuperan el contenido de los prompts posteriores proporcionados en la conversación, con nombres y orden normalizados para esta carpeta.
- Todos los paquetes Java de este proyecto son `com.latecnologiaavanza`; **nunca** `com.mifact`.
- El frontend (`inventory-web/`) no forma parte de estos prompts y no se modifica.

## Índice

| Orden | Archivo | Contenido | Origen |
|---|---|---|---|
| 01 | `backend/01-contexto-proyecto.md` | Contexto, versiones y límites de Codex | Reconstrucción documental |
| 02 | `backend/02-docker-mysql.md` | Dockerfile, Compose, MySQL y variables | Reconstrucción documental |
| 03 | `backend/03-ajustes-iniciales.md` | Entidad, POM y ajuste del DTO | Prompt proporcionado |
| 04 | `backend/04-crud-productos.md` | Service y Controller del CRUD | Prompt proporcionado |
| 05 | `backend/05-cors-rate-limit.md` | CORS e interceptor de límite de solicitudes | Prompt proporcionado |
| 06 | `backend/06-pruebas-automatizadas.md` | JUnit, Mockito, MockMvc y H2 | Prompt proporcionado |
| 07 | `backend/07-github-actions.md` | Backend CI, compilación y Docker | Prompt proporcionado |
| — | `backend/08-comandos-y-verificaciones.md` | Comandos manuales explicados y resultados | Guía de acompañamiento |

Para saber dónde ejecutar cada comando y cuál es su objetivo, consulta `backend/08-comandos-y-verificaciones.md`.

## Resultado ya alcanzado

Según la ejecución de GitHub Actions del 23 de octubre de 2026 (hora de Perú):

- Job `Backend tests and package`: correcto.
- **8 pruebas aprobadas, 0 fallos, 0 errores**.
- JAR `inventory-api-1.0.0-SNAPSHOT.jar` creado y subido como artefacto.
- Job `Backend Docker build`: correcto.

Ejecución: https://github.com/latecnologiaavanza/video-prueba-tecnica-fullstack/actions/runs/40049573981

Este resultado no sustituye la verificación manual del CRUD con MySQL; esa prueba también fue confirmada por el autor del proyecto.
