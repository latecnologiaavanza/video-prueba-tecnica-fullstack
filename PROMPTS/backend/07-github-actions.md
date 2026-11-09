# 07 — GitHub Actions del backend

> **Origen: prompt posterior proporcionado en la conversación.** La configuración final del repositorio utiliza `inventory-api-jar` como nombre del artefacto.

## Propósito

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

## Qué ocurre realmente

1. Subes un commit a `main` o `develop`, o abres un Pull Request a `main`.
2. GitHub ejecuta el job **test** en un equipo de GitHub: instala Java 8, ejecuta Maven y guarda el JAR.
3. Si `test` tuvo éxito, ejecuta el job **docker**, que valida Compose y construye la imagen del backend.
4. **No** inicia de forma permanente MySQL, **no** despliega en producción y **no** publica Docker Hub.

**Diferencia documental:** el prompt indicaba subir el JAR sin especificar un nombre de artefacto; el workflow real usa `inventory-api-jar`, lo cual es correcto.

## Comprobación real registrada

GitHub Actions: https://github.com/latecnologiaavanza/video-prueba-tecnica-fullstack/actions/runs/40049573981

- `Backend tests and package` — **success**.
- `Backend Docker build` — **success**.
- 8 pruebas exitosas.
- Artefacto `inventory-api-jar` generado.

GitHub Actions es la ejecución automática del workflow que Codex creó; Codex no es quien ejecuta el job remoto.
