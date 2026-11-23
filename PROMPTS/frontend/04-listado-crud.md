# 04 — Listado de productos y CRUD visual

**Tipo:** prompt para Codex.

## Objetivo

Crear la página `/products` con búsqueda, tabla, botones de edición y eliminación, y comunicación con el formulario modal. Esta fase completa el CRUD visible del frontend.

## Requisitos de partida

Fases 01–03 completadas y `ProductListComponent` generado dentro de `features/products/pages/product-list/`.

## Prompt para Codex

```text
Implementa ProductListComponent usando sus archivos .ts, .html y .css existentes en features/products/pages/product-list/.

Angular 18 standalone; utilizar Angular Material, Bootstrap Icons, ProductApiService, ProductFormComponent y NotificationService ya existentes.

No crear nuevos componentes, servicios, rutas, paginación, dashboard, sidebar, autenticación ni filtros adicionales.

1. Vista:
- Sección principal con h1 'Productos'.
- Subtítulo 'Administra los productos disponibles en tu inventario.'.
- Botón 'Nuevo producto' con ícono bi bi-plus-lg.
- MatCard appearance='outlined', título 'Listado de productos'.
- MatFormField appearance='outline': etiqueta 'Buscar producto', placeholder 'Escribe un nombre...', ícono bi-search, input con searchControl y botón para limpiar cuando haya texto.
- MatProgressBar indeterminate durante loading.
- MatTable con displayedColumns ['name','description','quantity','price','actions'].
- Encabezados: Nombre, Descripción, Cantidad, Precio, Acciones.
- En descripción vacía/null mostrar 'Sin descripción'.
- Para precio usar CurrencyPipe con moneda 'PEN', 'symbol', '1.2-2'.
- Acciones con íconos bi-pencil-square y bi-trash3, tooltip Editar y Eliminar.
- Si no hay productos y no carga: icono bi-box-seam, título 'No se encontraron productos' y texto 'Prueba con otro término de búsqueda o registra un producto nuevo.'.

2. Lógica:
- Inyectar ProductApiService, MatDialog, NotificationService y DestroyRef.
- readonly searchControl = new FormControl('',{nonNullable:true}).
- readonly displayedColumns = ['name','description','quantity','price','actions'].
- private readonly refresh$ = new Subject<void>().
- products:Product[]=[], loading=false, deletingId:number|null=null.
- ngOnInit: combinar searchControl.valueChanges con debounceTime(300) y distinctUntilChanged(), y refresh$ transformado con map(() => searchControl.value); usar merge(), startWith(), switchMap() y takeUntilDestroyed(destroyRef) para actualizar products.
- private loadProducts(name:string):Observable<Product[]>: marcar loading, llamar getAll(name), catchError(() => of([])), finalize(() => loading=false).

3. Acciones:
- openCreate(): dialog.open(ProductFormComponent,{width:'600px',maxWidth:'95vw',autoFocus:'first-tabbable',data:{}}). En afterClosed(), recargar mediante refresh$.next() solo cuando el resultado sea true.
- openEdit(product): mismo modal con data:{product}; recargar solo si se guardó.
- confirmDelete(product): solicitar confirmación mediante NotificationService.confirm('¿Seguro que deseas eliminar “NOMBRE”? Esta acción no se puede deshacer.','Eliminar producto').
- Si se confirma, llamar delete(product.id); usar deletingId y finalize() para controlar el estado, mostrar 'El producto fue eliminado correctamente.' y recargar el listado.
- No borrar si el usuario cancela.

4. CSS:
- .products-page con disposición vertical y gap:24px.
- Encabezado horizontal y responsive debajo de 650px (columna y botón al 100%).
- Buscador con max-width:460px.
- Contenedor de tabla con overflow-x:auto; tabla min-width:680px.
- Columna Acciones con ancho 132px, contenido centrado.
- Botones de acciones circulares de 40px, editar azul #2563eb y eliminar rojo #dc2626.
- Estado vacío centrado con icono grande; espaciado coherente con estilos globales.

Ejecutar npm run build. No implementar nada fuera del listado. Detenerse.
```

## Qué se aprende

- **`MatTable`** permite mostrar datos con columnas configuradas.
- **`debounceTime(300)`** espera 300 ms para no consultar la API inmediatamente con cada pulsación.
- **`switchMap`** atiende la búsqueda más reciente y cancela la suscripción anterior.
- **`afterClosed()`** permite actualizar el listado solo si el modal guardó realmente.
- **SweetAlert2** solicita confirmación antes de llamar al DELETE.

## Verificación manual — Primera prueba integral

**Terminal 1 — Raíz del repositorio:**

```cmd
docker compose up -d mysql inventory-api
```

Arranca solo MySQL y Spring Boot. Deben existir las imágenes o los servicios disponibles; no arranca todavía el frontend Docker.

**Terminal 2 — `inventory-web/`:**

```cmd
npm start
```

Inicia `ng serve` utilizando `proxy.conf.json` para que `/api` se reenvíe a Spring Boot. Abre **http://localhost:4200**.

| Acción | Comprobación |
|---|---|
| Acceder a `/products` | Aparece la página de productos y su tabla. |
| Pulsar Nuevo producto | Se abre `MatDialog` con formulario vacío. |
| Guardar producto válido | Se ejecuta POST; aparece en la tabla. |
| Buscar por nombre | Se envía GET con `?name=...`. |
| Pulsar Editar | Se abre el **mismo** modal con valores precargados. |
| Guardar cambios | Se ejecuta PUT y se actualiza la lista. |
| Pulsar Eliminar | SweetAlert2 confirma antes de ejecutar DELETE. |
| Cancelar la eliminación | El producto permanece. |
| Enviar campos inválidos | Se muestran los errores, sin guardar. |

**Si el puerto 4200 está ocupado por el contenedor `inventory-web`, detén solamente ese servicio desde la raíz con `docker compose stop inventory-web` antes de ejecutar `npm start`.** No borres los volúmenes de MySQL.

**Siguiente:** `05-docker-nginx.md`, solo después de completar el CRUD local.
