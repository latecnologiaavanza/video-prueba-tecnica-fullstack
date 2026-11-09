# Comandos manuales explicados — backend

Este documento acompaña los prompts 01–07. No es un nuevo prompt para Codex. Los comandos de esta guía ya se usaron o se propusieron durante la implementación. **El backend actual ya está terminado.**

## ¿Desde qué carpeta ejecuto cada comando?

Estructura:

```text
video-prueba-tecnica-fullstack/
├── .github/workflows/backend-ci.yml
├── docker-compose.yml             <-- RAÍZ
├── inventory-api/
│   ├── Dockerfile
│   ├── pom.xml                    <-- CARPETA BACKEND
│   └── src/
└── inventory-web/                 <-- NO MODIFICAR EN ESTA FASE
```

| Comando | Carpeta | Explicación |
|---|---|---|
| `mvn -B -DskipTests clean package` | `inventory-api/` | Compila y genera el JAR; no ejecuta tests |
| `mvn -B clean verify` | `inventory-api/` | Compila, ejecuta pruebas y verifica el build |
| `docker compose config` | Raíz | Comprueba el YAML y sus variables, sin iniciar contenedores |
| `docker compose up -d --build mysql inventory-api` | Raíz | Construye y arranca MySQL y API |
| `docker compose up -d --build` | Raíz | Construye y arranca los servicios declarados; requiere que el frontend tenga Dockerfile |
| `docker compose ps` | Raíz | Muestra estado de los contenedores |
| `docker compose logs --tail=100 inventory-api` | Raíz | Muestra las últimas 100 líneas del backend |
| `docker compose stop inventory-web` | Raíz | Detiene únicamente el frontend Docker |
| `docker compose up -d --build --no-deps inventory-api` | Raíz | Reconstruye solo API sin intentar levantar dependencias |
| `docker compose down` | Raíz | Detiene y elimina contenedores/red, conserva el volumen por defecto |

**Cuidado:** `docker compose down -v` elimina el volumen y puede borrar la base local de MySQL.

## Qué significan `3307:3306` y `8081:8081`

- MySQL escucha en el puerto **3306 dentro** del contenedor; desde Windows accedes por **localhost:3307**.
- Spring Boot escucha en el **8081** dentro del contenedor y está publicado como **localhost:8081**.
- Entre contenedores, la API se conecta a `mysql:3306`, no a `localhost:3307`.

## Qué revisar en el navegador

- Swagger UI: `http://localhost:8081/swagger-ui.html`.
- OpenAPI JSON: `http://localhost:8081/v3/api-docs`.
- Actuator Health: `http://localhost:8081/actuator/health`.
- API CRUD: `http://localhost:8081/api/v1/products`.

## Por qué son diferentes los códigos HTTP

| Código | Interpretación en este proyecto |
|---|---|
| 200 | Consulta o actualización exitosa |
| 201 | Producto creado |
| 204 | Producto eliminado, sin cuerpo de respuesta |
| 400 | Solicitud o validaciones incorrectas |
| 404 | Producto no encontrado |
| 409 | Conflicto de integridad de datos |
| 429 | Límite de solicitudes superado |

## Git y GitHub Actions

Desde la raíz del repositorio:

```cmd
git status
```

Lista los archivos modificados y no versionados.

```cmd
git add PROMPTS/
```

Prepara únicamente los documentos de prompts para el siguiente commit.

```cmd
git commit -m "docs: agregar prompts del backend"
```

Crea un commit local con la documentación preparada.

```cmd
git push origin main
```

Envía el commit a la rama `main` de GitHub. **Este comando solo debe usarse si estás realmente trabajando en `main` y quieres publicar la documentación.** Al hacer push, se dispararán los workflows que escuchan la rama `main`.

## Estado confirmado del backend

En la ejecución CI del 23/10/2026, hora de Perú, se verificó:

- `mvn -B clean verify`: **BUILD SUCCESS**.
- **8 tests**, 0 fallos y 0 errores.
- JAR subido como artefacto.
- `docker compose config`: correcto.
- Imagen Docker: construida correctamente.

El autor del proyecto también indicó haber levantado los contenedores y probado la aplicación y el CI.

## Alcance de esta carpeta

Los archivos aquí son **prompts y explicación**, no código que se ejecute automáticamente. No necesitas modificar Maven, Docker, Java ni CI para guardarlos.
