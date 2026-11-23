# 05 — Ejecutar Angular con Docker y Nginx

**Tipo:** prompt para Codex.

## Objetivo

Construir Angular con Node.js 20 y servir los archivos generados con Nginx, que reenviará las peticiones `/api` al contenedor Spring Boot.

## Requisitos de partida

Fases 01–04 completadas. La aplicación funciona localmente con `npm start` y el CRUD responde. En la raíz existe `docker-compose.yml` con servicios `mysql`, `inventory-api` e `inventory-web`.

## Prompt para Codex

```text
Prepara exclusivamente el frontend Angular 18 existente en inventory-web/ para ejecución con Docker y Nginx.

El docker-compose.yml de la raíz ya declara los servicios mysql, inventory-api e inventory-web. No lo modifiques. No cambies el backend ni añadas nuevos servicios.

1. Crear inventory-web/Dockerfile multietapa:

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/inventory-web/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

2. Crear un único inventory-web/nginx.conf:
- server con listen 80, server_name _, root /usr/share/nginx/html e index index.html.
- resolver 127.0.0.11 valid=30s ipv6=off.
- location /api/ con:
  set $backend http://inventory-api:8081;
  proxy_pass $backend;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
- location / con:
  try_files $uri $uri/ /index.html;

3. Crear inventory-web/.dockerignore con estas entradas:
node_modules
dist
.angular
coverage
.git
.gitignore
Dockerfile
README.md

Conservar proxy.conf.json: se usa solo con Angular CLI durante el desarrollo local.

No generar archivos nginx.conf adicionales, no modificar Docker Compose, no crear un pipeline nuevo y no cambiar servicios ya implementados.

Ejecutar npm run build y verificar, si Docker está disponible, la construcción de la imagen del frontend. Informar los resultados reales y detenerse.
```

## Qué se aprende

- **Dockerfile multietapa:** Node.js construye Angular; Nginx sirve el resultado sin llevar todo el entorno de compilación en la imagen final.
- **`nginx.conf`:** escucha en el puerto 80 **dentro** del contenedor. Compose lo publica en el **4200 de Windows**.
- **`inventory-api:8081`:** es el nombre DNS del servicio dentro de la red Docker. En el contenedor no se utiliza `localhost:8081` para hablar con otro contenedor.
- **`try_files ... /index.html`:** permite que rutas Angular como `/products` funcionen al recargar la página.
- **`proxy.conf.json` es distinto:** solo lo utiliza Angular CLI con `npm start`.

## Verificación manual — Docker completo

Detén `npm start` mediante **Ctrl+C** para liberar el puerto 4200. Después, en la **raíz**:

```cmd
docker compose up -d --build
docker compose ps
```

El primero construye y arranca los servicios declarados; el segundo muestra su estado. Debes poder entrar en **http://localhost:4200** y utilizar el mismo CRUD, ahora servido desde Nginx.

Para revisar el frontend si falla:

```cmd
docker compose logs --tail=100 inventory-web
```

**No ejecutes `docker compose down -v`** para esta comprobación: la opción `-v` podría eliminar el volumen local de MySQL y sus datos.

**Siguiente:** `06-pruebas-github-actions.md`.
