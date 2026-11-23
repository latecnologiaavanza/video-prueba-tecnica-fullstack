# Frontend — Guía de prompts para estudiantes

Esta guía permite construir por fases la interfaz de **mantenimiento de productos** con **Angular 18**, conectándola a una API REST de **Spring Boot**. Contiene comandos explicados, prompts listos para usar en Codex y verificaciones para cada etapa.

**Proyecto:** https://github.com/latecnologiaavanza/video-prueba-tecnica-fullstack

## Resultado esperado

Una sola página, `/products`, que permite:

- Listar productos con nombre, descripción, cantidad y precio en soles.
- Buscar por nombre con una espera de 300 ms antes de consultar.
- Crear y editar desde **un mismo modal de Angular Material (`MatDialog`)**.
- Confirmar la eliminación y mostrar alertas mediante **SweetAlert2**.
- Visualizar mensajes de validación enviados por la API.
- Ejecutar Angular en desarrollo con `proxy.conf.json` y en Docker con `nginx.conf`.
- Ejecutar una prueba del servicio HTTP y verificar el build en **GitHub Actions**.

No incluye login, paginación, dashboard, sidebar, filtros adicionales ni publicación de imágenes Docker.

## Requisitos y punto de partida

| Elemento | Requisito |
|---|---|
| Sistema de comandos | CMD en Windows (NVM para Windows) |
| Node.js | **20.20.2** para el entorno local |
| Angular | **18.2.x**, aplicación standalone |
| Angular CLI | **18.2.x**, instalado localmente |
| Proyecto frontend | Carpeta `inventory-web/`, con `package.json`, `package-lock.json` y plantilla Angular inicial |
| Backend | API REST funcional en `http://localhost:8081` |
| Docker | Docker Desktop con Docker Compose, para las fases finales |
| Repositorio | Raíz con `inventory-api/`, `inventory-web/`, `docker-compose.yml` y `.github/` |

**Importante:** el repositorio publicado puede contener **la solución ya finalizada**. Los prompts son una secuencia educativa para un proyecto base Angular 18, **no una invitación a regenerar archivos sobre la rama terminada**. Utiliza una copia de trabajo adecuada para seguirlos desde cero. Los prompts describen por sí solos el resultado, sin requerir que Codex consulte un repositorio externo.

## Orden de estudio

| Orden | Documento | Tipo | Resultado |
|---|---|---|---|
| 00 | [`00-preparacion-manual.md`](00-preparacion-manual.md) | **Comandos manuales** | Node 20, dependencias y estructura inicial |
| 01 | [`01-configuracion-angular.md`](01-configuracion-angular.md) | **Prompt Codex** | Rutas, estilos, proxy, pantalla raíz |
| 02 | [`02-modelos-servicios-http.md`](02-modelos-servicios-http.md) | **Prompt Codex** | Tipos, servicio HTTP, alertas, interceptor |
| 03 | [`03-modal-productos.md`](03-modal-productos.md) | **Prompt Codex** | Modal para crear y editar |
| 04 | [`04-listado-crud.md`](04-listado-crud.md) | **Prompt Codex** | Tabla, búsqueda, botones y conexión funcional |
| 05 | [`05-docker-nginx.md`](05-docker-nginx.md) | **Prompt Codex** | Imagen frontend con Nginx |
| 06 | [`06-pruebas-github-actions.md`](06-pruebas-github-actions.md) | **Prompt Codex** | Prueba HTTP y CI del frontend |
| Apoyo | [`07-comandos-y-verificaciones.md`](07-comandos-y-verificaciones.md) | **Comandos manuales** | Pruebas, Docker, Git y comprobaciones |

## Cómo utilizar un prompt

1. Ejecuta primero las instrucciones de `00-preparacion-manual.md`.
2. Abre un documento numerado del **01 al 06**.
3. Revisa los **requisitos previos** y copia **solo el bloque «Prompt para Codex»**.
4. Envía el prompt a Codex abierto sobre la raíz de tu proyecto.
5. Revisa qué archivos creó o editó y ejecuta los comandos de **verificación** de esa fase.
6. No avances si hay errores de compilación, pruebas o funcionamiento.

## Estructura final de la parte relevante

```text
video-prueba-tecnica-fullstack/
├── .github/workflows/
│   ├── backend-ci.yml
│   └── frontend-ci.yml
├── docker-compose.yml
├── inventory-api/               # API existente: no se modifica
├── inventory-web/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf                # Nginx dentro de Docker
│   ├── proxy.conf.json          # Angular CLI en desarrollo
│   ├── angular.json
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── index.html
│       ├── styles.css
│       └── app/
│           ├── app.component.ts
│           ├── app.component.html
│           ├── app.component.css
│           ├── app.config.ts
│           ├── app.routes.ts
│           ├── core/
│           │   ├── interceptors/api-error.interceptor.ts
│           │   └── services/notification.service.ts
│           └── features/products/
│               ├── components/product-form/
│               │   ├── product-form.component.ts
│               │   ├── product-form.component.html
│               │   └── product-form.component.css
│               ├── pages/product-list/
│               │   ├── product-list.component.ts
│               │   ├── product-list.component.html
│               │   └── product-list.component.css
│               ├── models/
│               │   ├── product.model.ts
│               │   ├── product-request.model.ts
│               │   └── api-error.model.ts
│               └── services/
│                   ├── product-api.service.ts
│                   └── product-api.service.spec.ts
└── PROMPTS/
    ├── backend/                 # Documentación ya existente
    └── frontend/                # Esta guía
```

Los demás archivos de Angular (`main.ts`, `tsconfig`, `favicon.ico`, etc.) se conservan. El listado se ubica en `pages/product-list/` para coincidir con la estructura de la solución de referencia.

## Dos archivos de proxy, dos entornos

- `proxy.conf.json`: **no es de Nginx**; lo utiliza `ng serve` para enviar `/api` hacia `http://localhost:8081`.
- `nginx.conf`: configuración del servidor Nginx **dentro de Docker**; sirve los archivos compilados y envía `/api` a `http://inventory-api:8081`.

Solo se necesita **un `nginx.conf`** en `inventory-web/`. No crear un segundo archivo de configuración Nginx.

## Alcance de esta documentación

Esta carpeta contiene únicamente instrucciones educativas (`.md`), no cambia automáticamente el código, Docker ni los workflows. El backend debe estar implementado y comprobado antes de iniciar las pruebas funcionales de Angular. Los resultados se deben confirmar en cada entorno: que el proyecto de ejemplo compile no demuestra que una implementación nueva también compile.
