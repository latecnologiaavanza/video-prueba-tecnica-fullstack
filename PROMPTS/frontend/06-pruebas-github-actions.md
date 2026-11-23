# 06 — Prueba del servicio HTTP y GitHub Actions

**Tipo:** prompt para Codex.

## Objetivo

Probar la normalización del parámetro `name` en `ProductApiService`, ejecutar pruebas Angular en Chrome Headless y automatizar el build del frontend y de su imagen Docker con GitHub Actions.

## Requisitos de partida

Fases 01–05 completadas. Deben existir `product-api.service.ts`, su archivo `.spec.ts`, `package-lock.json` y `inventory-web/Dockerfile`.

## Prompt para Codex

```text
Finaliza el frontend Angular 18 con su prueba de servicio HTTP y GitHub Actions.

No modificar backend, backend-ci.yml, Docker Compose ni otras funcionalidades existentes.

1. Completar el archivo existente:
inventory-web/src/app/features/products/services/product-api.service.spec.ts

Usar Jasmine, TestBed, provideHttpClient(), provideHttpClientTesting() y HttpTestingController.

Crear exactamente una prueba:
"should request products filtered by name".

La prueba debe:
- Invocar ProductApiService.getAll(' laptop ').
- Esperar una petición GET a /api/v1/products?name=laptop.
- Verificar el método HTTP GET.
- Responder mediante request.flush([]).
- Verificar que el resultado sea una lista vacía.
- Utilizar http.verify() dentro de afterEach.

2. Crear .github/workflows/frontend-ci.yml en la raíz del repositorio (NO dentro de inventory-web).

Nombre: Frontend CI.

Eventos:
- push a main y develop.
- pull_request hacia main.

permissions:
  contents: read

Job test-and-build:
- name: Frontend tests and build
- runs-on: ubuntu-latest
- defaults.run.working-directory: inventory-web
- actions/checkout@v4
- actions/setup-node@v4 con node-version "20", cache: npm y cache-dependency-path: inventory-web/package-lock.json
- Ejecutar npm ci
- Ejecutar npx ng test --watch=false --browsers=ChromeHeadless
- Ejecutar npm run build

Job docker:
- name: Frontend Docker build
- runs-on: ubuntu-latest
- needs: test-and-build
- actions/checkout@v4
- Ejecutar docker build -f inventory-web/Dockerfile -t inventory-web:${{ github.sha }} inventory-web

No agregar jobs, no publicar imágenes en Docker Hub y no desplegar en ningún proveedor.

Ejecutar las verificaciones posibles, informar los resultados efectivamente obtenidos y detenerse.
```

## Qué se aprende

- **`HttpTestingController`** permite verificar la URL y el método HTTP sin llamar a un backend real.
- **`request.flush([])`** simula una respuesta del servidor con lista vacía.
- **`http.verify()`** comprueba que no quedaron solicitudes HTTP pendientes.
- **GitHub Actions:** ejecuta las pruebas y el build en servidores de GitHub al recibir un `push` o un pull request según las ramas configuradas.
- **CI, no despliegue:** el job Docker **construye** la imagen, pero no la publica ni ejecuta en producción.

## Verificación manual

Dentro de `inventory-web/`:

```cmd
npx ng test --watch=false --browsers=ChromeHeadless
npm run build
```

- `--watch=false` termina tras ejecutar las pruebas, en vez de esperar modificaciones.
- `--browsers=ChromeHeadless` utiliza Chrome en modo sin ventana. Debe estar instalado y accesible en Windows; si Karma no lo encuentra, se debe revisar la configuración local de Chrome.
- `npm run build` verifica la compilación del frontend.

Publica cambios únicamente después de revisar `git status`; consulta `07-comandos-y-verificaciones.md` para los comandos y su explicación.

**Resultado esperado:** prueba HTTP aprobada y jobs `Frontend tests and build` y `Frontend Docker build` correctos en GitHub. Esto debe verificarse con los resultados de la propia ejecución.
