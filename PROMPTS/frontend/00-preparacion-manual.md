# 00 — Preparación manual de Angular 18

**Tipo:** comandos de terminal. **No pegues este documento completo en Codex.**

## Objetivo

Seleccionar Node.js, instalar las dependencias que utiliza la interfaz y generar con Angular CLI los dos componentes y el servicio inicial. Codex se utilizará después para implementar el contenido de esos archivos.

## Requisitos de partida

- Windows con **NVM para Windows** instalado.
- Proyecto Angular 18 existente en `inventory-web/`, con `package-lock.json`.
- Abrir **CMD** en la **raíz del repositorio**, donde existe `docker-compose.yml`.

## 1. Seleccionar Node.js 20

```cmd
nvm list
nvm use 20.20.2
node -v
npm -v
```

| Comando | Explicación |
|---|---|
| `nvm list` | Muestra las versiones de Node.js instaladas. |
| `nvm use 20.20.2` | Selecciona esa versión para utilizar Node.js y npm en el proyecto. |
| `node -v` | Comprueba la versión activa. Debe indicar `v20.20.2`. |
| `npm -v` | Comprueba que npm está disponible. |

Si `20.20.2` no aparece en `nvm list`, primero será necesario instalar esa versión de Node.js con NVM. No cambies a Node.js 22 solo por ser la versión más nueva: aquí se mantiene Node 20 para reproducir el entorno de referencia.

## 2. Entrar a Angular

```cmd
cd inventory-web
```

Este comando cambia el directorio de trabajo. **Todos los comandos `npm` y `npx ng` de este documento se ejecutan desde `inventory-web/`.**

## 3. Instalar dependencias existentes

```cmd
npm ci
```

`npm ci` instala lo descrito en `package-lock.json`, recreando `node_modules` de forma reproducible. Se utiliza antes de agregar las librerías que todavía no existan en el proyecto base.

## 4. Instalar las librerías del ejercicio

```cmd
npm install @angular/material@18.2.14 @angular/cdk@18.2.14 bootstrap@5.3.8 bootstrap-icons@1.13.1 sweetalert2@11.26.25
```

| Dependencia | Uso concreto |
|---|---|
| `@angular/material` | Tabla, campos, botones, diálogos y barras de progreso. |
| `@angular/cdk` | Soporte técnico requerido por Angular Material. |
| `bootstrap` | Hoja de estilos Bootstrap. |
| `bootstrap-icons` | Íconos de búsqueda, creación, edición y eliminación. |
| `sweetalert2` | Alertas de éxito/error y confirmación para eliminar. |

`npm install` añade las dependencias y actualiza **`package.json` y `package-lock.json`**. No edites esos dos archivos manualmente para añadir las librerías. No ejecutes además `ng add @angular/material`, porque el tema y las animaciones se configurarán en el prompt 01 y 02.

Comprueba:

```cmd
npx ng version
npm ls @angular/material @angular/cdk
```

- `npx ng version` utiliza el Angular CLI local del proyecto y debe mostrar **Angular 18.2.x**.
- `npm ls` muestra las versiones efectivamente instaladas; Material y CDK deben ser **18.2.x**.

## 5. Generar exactamente dos componentes

```cmd
npx ng generate component features/products/components/product-form --standalone --skip-tests
```

Genera `product-form.component.ts`, `.html` y `.css`. El componente será el **mismo modal** para crear y editar.

```cmd
npx ng generate component features/products/pages/product-list --standalone --skip-tests
```

Genera los tres archivos de `product-list`. Esta es la página de la tabla y la búsqueda.

**Significado de las opciones:** `generate component` crea un componente, `--standalone` evita un NgModule y `--skip-tests` omite pruebas de componentes que no están previstas en esta solución.

## 6. Generar el servicio HTTP

```cmd
npx ng generate service features/products/services/product-api
```

Genera `product-api.service.ts` y `product-api.service.spec.ts`. Aquí **sí conservamos `.spec.ts`** porque al final se ejecutará una prueba de peticiones HTTP.

## Comprobación del paso

Verifica que existan:

```text
inventory-web/src/app/features/products/
├── components/product-form/
│   ├── product-form.component.ts
│   ├── product-form.component.html
│   └── product-form.component.css
├── pages/product-list/
│   ├── product-list.component.ts
│   ├── product-list.component.html
│   └── product-list.component.css
└── services/
    ├── product-api.service.ts
    └── product-api.service.spec.ts
```

**No generes más componentes o módulos.** Continúa con `01-configuracion-angular.md`.
