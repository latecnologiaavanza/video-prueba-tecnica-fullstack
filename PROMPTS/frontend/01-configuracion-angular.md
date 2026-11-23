# 01 — Configuración de Angular, estilos y rutas

**Tipo:** prompt para Codex.

## Objetivo

Preparar una aplicación Angular 18 standalone con el tema de Angular Material, estilos Bootstrap, rutas de productos y un proxy local hacia Spring Boot.

## Requisitos de partida

Haber completado `00-preparacion-manual.md`: dependencias instaladas y componentes `ProductFormComponent`, `ProductListComponent` generados. El backend no se modifica.

## Prompt para Codex

```text
Configura el frontend de inventario existente en inventory-web/ con Angular 18 standalone.

Ya están instalados @angular/material 18.2.14, @angular/cdk, bootstrap, bootstrap-icons y sweetalert2. Ya están generados ProductFormComponent, ProductListComponent y ProductApiService.

No instales nuevas dependencias, no generes componentes ni modifiques el backend.

1. Modificar angular.json:
- En build.options.styles incluir, en este orden:
  node_modules/bootstrap/dist/css/bootstrap.min.css
  node_modules/bootstrap-icons/font/bootstrap-icons.min.css
  node_modules/@angular/material/prebuilt-themes/azure-blue.css
  src/styles.css
- Configurar allowedCommonJsDependencies: ["sweetalert2"].
- En el budget initial de producción: maximumWarning "900kB" y maximumError "1MB".
- Conservar el resto de la configuración.

2. Crear inventory-web/proxy.conf.json:
{
  "/api": {
    "target": "http://localhost:8081",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
- Cambiar solamente el script start de package.json a "ng serve --proxy-config proxy.conf.json".

3. Actualizar app.routes.ts:
- Ruta vacía redirige a "products" con pathMatch:"full".
- Ruta "products" carga mediante loadComponent el ProductListComponent de features/products/pages/product-list/.
- Ruta "**" redirige a "products".

4. Actualizar AppComponent manteniendo standalone:
- Imports: RouterOutlet y MatToolbarModule.
- app.component.html: únicamente <main class="app-content"><router-outlet /></main>.
- Eliminar todo el contenido de bienvenida y la propiedad title.
- app.component.css: .app-content con width:min(1200px,100%), margin:0 auto, padding:32px 24px 48px; bajo 600px, padding:24px 16px 40px.

5. styles.css:
- html y body con min-height:100%.
- body: margin:0, background:#f5f7fb, color:#1f2937, font-family:Roboto,"Helvetica Neue",sans-serif.
- * con box-sizing:border-box.
- Ajustar .search-field i.field-icon para un ícono de búsqueda de 16px, centrado y alineado verticalmente dentro de mat-form-field.

6. index.html:
- lang="es", título "Mantenimiento de Productos".
- Enlace a fuente Google Fonts Roboto (300, 400, 500).
- body class="mat-typography".

7. Eliminar app.component.spec.ts de la plantilla inicial; sus pruebas hacen referencia a la pantalla de bienvenida que ya no existe.

No implementar todavía modelos, HttpClient ni lógica del CRUD. No modificar app.config.ts en esta fase.

Ejecutar npm run build, informar el resultado y detenerse.
```

## Qué se aprende

- **`angular.json`** controla qué estilos globales entran en el build.
- **`app.routes.ts`** define la navegación: `/` y rutas desconocidas redirigen a `/products`.
- **`router-outlet`** es el lugar donde Angular renderiza el componente asociado a la ruta.
- **`proxy.conf.json`** lo usa `ng serve`, no Nginx. Redirige solicitudes `/api` del frontend local al backend en `localhost:8081`.

## Verificación manual

En `inventory-web/`:

```cmd
npm run build
```

Este comando ejecuta `ng build`. Debe terminar sin errores. El listado todavía no está implementado; eso es normal en esta fase.

**Siguiente:** `02-modelos-servicios-http.md`.
