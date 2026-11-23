# Comandos manuales y comprobaciones — frontend

Este documento reúne los comandos de las fases 00–06 y explica cuándo usarlos. **No es un prompt para Codex**.

## ¿Desde qué carpeta ejecutar cada comando?

```text
video-prueba-tecnica-fullstack/     <-- RAÍZ
├── docker-compose.yml
├── .github/workflows/
├── inventory-api/
└── inventory-web/                  <-- CARPETA ANGULAR
    ├── package.json
    ├── package-lock.json
    ├── angular.json
    ├── Dockerfile
    ├── nginx.conf
    └── proxy.conf.json
```

## Comandos de Angular y npm

| Comando | Carpeta | Función |
|---|---|---|
| `nvm use 20.20.2` | Cualquiera (CMD) | Selecciona Node.js 20.20.2 en Windows. |
| `node -v` | Cualquiera | Muestra la versión activa de Node. |
| `npm ci` | `inventory-web/` | Instala versiones del `package-lock.json`. |
| `npm install ...` | `inventory-web/` | Instala las cinco dependencias del ejercicio. Véase paso 00. |
| `npx ng version` | `inventory-web/` | Muestra versiones locales de Angular CLI y Angular. |
| `npx ng generate component ...` | `inventory-web/` | Genera un componente standalone; véase paso 00. |
| `npm run build` | `inventory-web/` | Compila Angular en modo producción. |
| `npm start` | `inventory-web/` | Arranca Angular CLI y su proxy de desarrollo. |
| `npx ng test --watch=false --browsers=ChromeHeadless` | `inventory-web/` | Ejecuta Jasmine/Karma una vez con Chrome sin ventana. |

## Comandos Docker

Desde la **raíz del repositorio**:

```cmd
docker compose up -d mysql inventory-api
```

Inicia MySQL y Spring Boot para desarrollar Angular en local con `npm start`. Si no están creados y necesitas construir sus imágenes, puedes utilizar `docker compose up -d --build mysql inventory-api`.

```cmd
docker compose stop inventory-web
```

Detiene únicamente el frontend Docker si necesitas liberar el puerto `4200` antes de usar `npm start`.

```cmd
docker compose up -d --build
```

Construye y arranca los tres servicios, incluido Angular servido por Nginx. Requiere haber creado `inventory-web/Dockerfile`.

```cmd
docker compose ps
```

Muestra el estado de los contenedores.

```cmd
docker compose logs --tail=100 inventory-web
```

Muestra los últimos 100 registros del servidor Nginx del frontend.

**Evita `docker compose down -v` si deseas conservar productos:** `-v` elimina los volúmenes del proyecto, incluido el de MySQL.

## ¿Por qué hay dos archivos de configuración de proxy?

| Archivo | Ejecutado por | Destino | Entorno |
|---|---|---|---|
| `inventory-web/proxy.conf.json` | Angular CLI (`npm start`) | `http://localhost:8081` | Desarrollo local |
| `inventory-web/nginx.conf` | Nginx | `http://inventory-api:8081` | Docker |

Ambos preservan la URL relativa de API `/api/v1/products`. No es necesario poner la URL de Spring Boot en cada componente.

## Pruebas manuales del CRUD

En **http://localhost:4200** verifica:

1. Listar productos.
2. Buscar por nombre.
3. Abrir modal Nuevo producto y crear.
4. Abrir modal Editar producto y guardar.
5. Cancelar un modal sin enviar cambios.
6. Solicitar confirmación SweetAlert2 para eliminar.
7. Cancelar eliminación sin borrar.
8. Confirmar eliminación y refrescar la tabla.
9. Comprobar validaciones (nombre vacío, cantidad negativa, precio cero).
10. Revisar que los errores de campo del backend aparezcan bajo el input correspondiente.

## Publicar la documentación o el código

Desde la **raíz**:

```cmd
git status
```

Muestra archivos modificados y archivos nuevos; revísalos antes de preparar el commit.

Para agregar solo la carpeta educativa de frontend:

```cmd
git add PROMPTS/frontend/
```

Para agregar los archivos del frontend y su workflow, una vez que estén terminados:

```cmd
git add inventory-web/ .github/workflows/frontend-ci.yml
```

Después, si quieres publicar y **estás realmente en `main`**:

```cmd
git commit -m "docs: agregar prompts del frontend"
git push origin main
```

`git commit` guarda un punto de control local; `git push` envía el commit al remoto y puede activar los workflows configurados. Ajusta el mensaje si el commit contiene código, no documentación. No uses `git add .` sin revisar los cambios.

## ¿Cuándo está terminada la fase?

- `npm run build` finaliza correctamente.
- El CRUD funciona en desarrollo con Angular CLI y backend disponible.
- El CRUD funciona con Nginx dentro de Docker.
- La prueba de `ProductApiService` pasa en Chrome Headless.
- GitHub Actions muestra ambos jobs del frontend exitosos.

La disponibilidad del backend o de Docker debe verificarse en cada entorno. La documentación por sí sola no inicia servicios ni prueba el código.
