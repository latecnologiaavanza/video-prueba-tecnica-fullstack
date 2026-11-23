# 02 — Modelos, servicio HTTP y manejo de errores

**Tipo:** prompt para Codex.

## Objetivo

Definir los datos de productos, comunicar Angular con `/api/v1/products` mediante `HttpClient`, mostrar alertas y manejar errores HTTP.

## Requisitos de partida

Fase 01 completada. Ya existe `features/products/services/product-api.service.ts` generado por Angular CLI y `app.config.ts` en la plantilla inicial.

## Prompt para Codex

```text
Implementa la comunicación HTTP del frontend Angular 18 existente en inventory-web/. No modifiques el backend, Docker ni los componentes visuales.

1. Crear features/products/models/product.model.ts:
export interface Product con id:number, name:string, description:string|null, quantity:number, price:number, createdAt:string y updatedAt:string.

2. Crear features/products/models/product-request.model.ts:
export interface ProductRequest con name:string, description:string|null, quantity:number y price:number.

3. Crear features/products/models/api-error.model.ts:
export interface ApiError con propiedades opcionales timestamp?:string, status?:number, error?:string, message?:string, path?:string y fieldErrors?:Record<string,string>.

4. Completar features/products/services/product-api.service.ts:
- @Injectable({providedIn:'root'}), inject(HttpClient) y Observable.
- URL base '/api/v1/products' (ruta relativa, NO http://localhost:8081).
- getAll(name?:string): Observable<Product[]>; usar HttpParams; agregar name únicamente cuando name?.trim() tenga contenido.
- create(request:ProductRequest): POST y Observable<Product>.
- update(id:number, request:ProductRequest): PUT y Observable<Product>.
- delete(id:number): DELETE y Observable<void>.
- No crear un método getById ni métodos adicionales.

5. Crear core/services/notification.service.ts usando @Injectable({providedIn:'root'}) y SweetAlert2:
- success(message,title='Operación exitosa'): icon success, botón 'Aceptar', confirmButtonColor '#2563eb'.
- error(message,title='Ocurrió un error'): icon error, botón 'Aceptar', confirmButtonColor '#dc2626'.
- confirm(message,title='¿Deseas continuar?'): Promise<boolean>, icon warning, showCancelButton:true, confirmButtonText:'Sí, continuar', cancelButtonText:'Cancelar', confirmButtonColor:'#dc2626', cancelButtonColor:'#64748b', reverseButtons:true; devolver result.isConfirmed.

6. Crear core/interceptors/api-error.interceptor.ts como HttpInterceptorFn con inject(NotificationService), catchError y throwError:
- HTTP 0: 'No se pudo conectar con el servidor.'
- HTTP 400 sin fieldErrors: mensaje de API o 'La solicitud no es válida.'
- HTTP 400 con fieldErrors: no mostrar alerta general; los campos mostrarán sus errores.
- HTTP 404: mensaje de API o 'El recurso solicitado no existe.'
- HTTP 409: mensaje de API o 'La operación genera un conflicto.'
- HTTP 429: 'Has realizado demasiadas solicitudes. Inténtalo nuevamente.'
- HTTP 500 o superior: 'Ocurrió un error interno en el servidor.'
- Propagar siempre el HttpErrorResponse original mediante throwError.

7. Actualizar app.config.ts conservando provideZoneChangeDetection y provideRouter:
- Añadir provideHttpClient(withInterceptors([apiErrorInterceptor])).
- Añadir provideAnimationsAsync() desde @angular/platform-browser/animations/async.

No instalar Axios, crear NgModules ni agregar endpoints.

Ejecutar npm run build e informar el resultado. Detenerse.
```

## Qué se aprende

- **`Product`** representa una respuesta con ID y fechas; **`ProductRequest`** representa los datos enviados por POST/PUT.
- **`HttpClient`** consume el backend usando una URL relativa. En desarrollo la resuelve el proxy de Angular; en Docker, Nginx.
- **`HttpInterceptorFn`** permite manejar errores comunes en un solo lugar.
- **`provideAnimationsAsync()`** habilita las animaciones utilizadas por Angular Material, incluidos los diálogos.

## Verificación manual

```cmd
npm run build
```

Debe compilar sin errores. Aún no es posible verificar el CRUD visual; se implementará en las fases 03 y 04.

**Siguiente:** `03-modal-productos.md`.
