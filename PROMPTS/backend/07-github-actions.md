# 07 — GitHub Actions del backend


## Requisitos de partida

Debes tener un backend que compile con `mvn -B clean verify`, un `Dockerfile` funcional y un `docker-compose.yml` que pase `docker compose config`.

## Objetivo

Crear el workflow de **integración continua (CI)**: compilar y probar Maven, guardar el JAR y validar/construir la imagen Docker. No despliega el backend en un servidor.

## Prompt para Codex

```text
Implementa CI para el backend y realiza las verificaciones finales.

Crear .github/workflows/backend-ci.yml en la raíz del proyecto, fuera de inventory-api/.

Nombre: Backend CI.

Triggers:
- Push a main y develop.
- Pull Request a main.

Permisos: contents: read.

Job test:
- Nombre Backend tests and package.
- ubuntu-latest.
- Directorio inventory-api.
- actions/checkout@v4.
- actions/setup-java@v4 con Temurin Java 8 y caché Maven.
- Ejecutar mvn -B clean verify.
- Subir target/inventory-api-1.0.0-SNAPSHOT.jar mediante actions/upload-artifact@v4.

Job docker:
- Nombre Backend Docker build.
- ubuntu-latest.
- needs: test.
- actions/checkout@v4.
- Ejecutar docker compose -f docker-compose.yml config.
- Ejecutar docker build -f inventory-api/Dockerfile -t inventory-api:${{ github.sha }} inventory-api.

Después verifica:
- Compilación Maven.
- Ocho pruebas automatizadas.
- Configuración Docker Compose.
- Construcción de imagen Docker.
- Conexión MySQL.
- Los endpoints REST.
- Validaciones HTTP 400.
- Producto inexistente HTTP 404.
- Swagger UI y Actuator.
- CORS y Rate Limit.

No modificar paquetes, groupId ni clases que ya funcionan.
No crear frontend-ci.yml.
No implementar Angular ni despliegues externos.

Entregar un informe con pruebas ejecutadas, resultados, errores y pendientes.

No afirmar que una verificación pasó si no fue ejecutada.
```

## ¿Cómo se ejecuta el workflow?

1. Subes un commit a `main` o `develop`, o abres un Pull Request a `main`.
2. GitHub ejecuta el job **test** en un equipo de GitHub: instala Java 8, ejecuta Maven y guarda el JAR.
3. Si `test` tuvo éxito, ejecuta el job **docker**, que valida Compose y construye la imagen del backend.
4. **No** inicia de forma permanente MySQL, **no** despliega en producción y **no** publica Docker Hub.

**Nombre de artefacto:** puedes utilizar `inventory-api-jar` en `actions/upload-artifact@v4`, como en el workflow de este proyecto.

## ¿Cómo verificarlo?

1. Confirma localmente que `mvn -B clean verify` finalice correctamente.
2. Sube el archivo `.github/workflows/backend-ci.yml` junto con el código a una rama que active el workflow.
3. En GitHub, abre **Actions → Backend CI** y comprueba los jobs `Backend tests and package` y `Backend Docker build`.
4. Si alguno falla, abre sus logs y corrige el problema antes de continuar.

El resultado esperado es que ambos jobs terminen correctamente y que el JAR aparezca como artefacto del job de pruebas.
