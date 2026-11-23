# 03 — Modal para crear y editar productos

**Tipo:** prompt para Codex.

## Objetivo

Implementar **un solo componente `ProductFormComponent`** que abra un **modal Angular Material (`MatDialog`)** tanto al crear como al editar productos. Validar los datos en el navegador y mostrar errores de los campos devueltos por Spring Boot.

## Requisitos de partida

Fases 01 y 02 completadas: Material configurado, modelos, `ProductApiService`, `NotificationService` y `ApiError` disponibles. El componente `product-form` ya fue generado con Angular CLI.

## Prompt para Codex

```text
Implementa ProductFormComponent en los archivos .ts, .html y .css ya existentes dentro de features/products/components/product-form/.

Angular 18 standalone y Angular Material 18. El componente se usará como modal MatDialog para crear y editar. No crees otra pantalla ni otro formulario, no cambies el backend.

1. En product-form.component.ts:
- Importar CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule y MatProgressSpinnerModule.
- Inyectar NonNullableFormBuilder, ProductApiService, NotificationService, MatDialogRef y MAT_DIALOG_DATA.
- Exportar interface ProductFormDialogData con product?:Product.
- Crear nonBlankValidator: ValidatorFn que rechace cadenas vacías o que solo contengan espacios.
- Guardar el estado saving=false.

2. Crear un FormGroup tipado con NonNullableFormBuilder:
- name: '', required, nonBlankValidator, maxLength(100).
- description: '', maxLength(500).
- quantity: 0, required, min(0).
- price: 0, required, min(0.01), pattern(/^\d{1,10}(\.\d{1,2})?$/).
- Si data.product está presente, precargar name, description (o ''), quantity y price mediante patchValue.

3. Métodos:
- isEditing como getter que indica si data.product existe.
- save(): si el formulario no es válido, markAllAsTouched() y terminar; si es válido, construir ProductRequest con name.trim(), description.trim() o null, quantity y price.
- Llamar ProductApiService.create() para alta y ProductApiService.update(id,request) para edición.
- Durante la operación usar saving y finalize() para restablecerlo.
- Tras guardar: cerrar MatDialog con true y mostrar 'El producto fue creado correctamente.' o 'El producto fue actualizado correctamente.'.
- cancel(): cerrar diálogo con false.
- serverError(controlName): leer error 'server' del control.
- applyServerErrors(error): si es HTTP 400, leer fieldErrors y asignar mensajes a controles conocidos con setErrors({...control.errors,server:mensaje}) y markAsTouched().

4. HTML:
- h2 mat-dialog-title: 'Nuevo producto' o 'Editar producto'.
- Formulario con mat-dialog-content y mat-dialog-actions.
- Campos appearance='outline': Nombre, Descripción (textarea con rows=4), Cantidad y Precio.
- Contador de caracteres de la descripción hasta 500.
- Cantidad con type='number', min=0, step=1.
- Precio con prefijo S/, type='number', min=0.01 y step=0.01.
- Mostrar errores de validación y errores 'server' mediante mat-error.
- Botones Cancelar y Crear producto / Guardar cambios; deshabilitar mientras saving.
- Mostrar mat-spinner diámetro 20 mientras guarda.

5. CSS:
- .product-form con min-width:min(520px,70vw).
- Campos a width:100%.
- Cantidad y precio en dos columnas con gap:16px.
- Para pantallas menores a 600px, formulario en una columna.

No implementar todavía el listado ni añadir otros componentes.

Ejecutar npm run build, informar resultado y detenerse.
```

## Qué se aprende

- **MatDialog** abre una ventana modal sobre la página actual.
- **`MAT_DIALOG_DATA`** permite recibir un producto: si no hay producto, el modal crea; si lo hay, edita.
- **Reactive Forms** valida campos antes de enviar la petición.
- **`fieldErrors`** permite colocar el error del backend directamente debajo del campo correspondiente.

## Verificación manual

```cmd
npm run build
```

Este paso comprueba compilación. **Todavía no aparecerá el modal en el navegador:** el botón que lo abre estará en el listado de la fase 04.

**Siguiente:** `04-listado-crud.md`.
