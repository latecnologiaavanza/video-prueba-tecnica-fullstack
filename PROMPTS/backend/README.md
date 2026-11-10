# Backend — Instrucciones para estudiantes

Esta sección guía la implementación progresiva de una API REST para administrar productos.

## Tecnologías y límites

| Elemento | Valor utilizado |
|---|---|
| Lenguaje | Java 8 |
| Framework | Spring Boot 2.7.18 |
| Construcción | Maven |
| Paquete principal y `groupId` | `com.latecnologiaavanza` |
| Base de datos | MySQL 8 |
| Persistencia | Spring Data JPA + Flyway |
| Puerto del backend | `8081` |
| Puerto MySQL desde Windows | `3307` |
| Ruta principal | `/api/v1/products` |
| Pruebas | JUnit 5, Mockito, MockMvc, H2 |
| CI | GitHub Actions |

## ¿Qué debe existir antes de cada fase?

- **01 — Contexto:** un proyecto Maven/Spring Boot en `inventory-api/` y la carpeta `inventory-web/` separada.
- **02 — Docker y MySQL:** el proyecto `inventory-api/` con su `pom.xml` y estructura de código. La configuración del frontend permanece intacta.
- **03 — Ajustes:** `entity/Product.java`, `dto/ProductRequest.java` y `pom.xml` ya creados. Este paso no los genera desde cero.
- **04 — CRUD:** entidad, DTO de solicitud y respuesta, `ProductRepository`, interfaz `ProductService`, `ResourceNotFoundException`, migración Flyway y configuración de la aplicación ya disponibles. `ProductServiceImpl` se completa y se crea `ProductController`.
- **05 — Configuración web:** aplicación CRUD y las propiedades `app.cors.*` y `app.rate-limit.*` presentes en `application.yml`.
- **06 — Pruebas:** los endpoints y servicios ya implementados.
- **07 — CI:** proyecto que compila y pasa las pruebas localmente.

> **Importante:** la rama `main` del repositorio publicado ya tiene la solución terminada. Los prompts fueron escritos para seguirse durante la construcción por etapas, no para introducir cambios redundantes en una copia final.

## Cómo seguir un documento

1. Comprueba el apartado **Requisitos de partida** del archivo.
2. Copia el bloque **Prompt para Codex** completo.
3. Revisa los archivos que Codex haya cambiado.
4. Ejecuta la **comprobación manual** de esa fase y corrige los errores reales antes de continuar.

## Orden recomendado

1. `01-contexto-proyecto.md` — identificar el proyecto, sin cambios.
2. `02-docker-mysql.md` — configurar imágenes, Compose y variables.
3. `03-ajustes-iniciales.md` — ajustar entidad, versión JAR y descripción OpenAPI.
4. `04-crud-productos.md` — servicio y controlador REST.
5. `05-cors-rate-limit.md` — CORS y límite de solicitudes.
6. `06-pruebas-automatizadas.md` — pruebas automatizadas.
7. `07-github-actions.md` — integración continua.
8. `08-comandos-y-verificaciones.md` — guía auxiliar; no se envía como prompt.

## Qué aprenderás al finalizar

A separar responsabilidades entre Controller, Service, Repository, DTO y Entity; validar peticiones; gestionar errores HTTP; ejecutar MySQL con Docker; probar el CRUD y automatizar la compilación y los tests. **No se necesita modificar Angular** para completar esta sección.

**Nota editorial:** las instrucciones 01 y 02 se documentaron a partir de los requisitos y del código resultante; las 03–07 provienen de los prompts completos de implementación. La documentación evita depender del acceso a otro repositorio o ZIP para entender cada fase.
