# 01 — Contexto del backend para Codex

> **Origen: RECONSTRUCCIÓN DOCUMENTAL.** Se sabe que este fue el primer prompt de contexto enviado a Codex, pero no se recuperó el texto literal. Este texto reproduce los requisitos confirmados, no afirma ser una transcripción.

## Propósito

Dar a Codex las tecnologías, estructura y restricciones **sin autorizar cambios**. De esta forma, los siguientes prompts se pueden ejecutar por fases durante el tutorial.

## Prompt para Codex

```text
Estamos trabajando en una prueba técnica de mantenimiento de productos llamada inventory-api, como parte de un proyecto fullstack.

Contexto del backend:
- Carpeta: inventory-api/.
- Java 8 y Spring Boot 2.7.18.
- Maven y estructura por capas.
- groupId y paquete Java principal: com.latecnologiaavanza. Conserva exactamente el paquete real del proyecto; no lo renombres ni crees com.mifact.
- Spring Web, Spring Data JPA, Bean Validation y Flyway.
- MySQL 8 como base de datos de ejecución.
- API REST de productos, puerto 8081.
- Puerto MySQL en el equipo: 3307; dentro de Docker: 3306.
- Frontend Angular 18 ya existe en inventory-web/ y debe permanecer intacto.

Estructura que utilizaremos, sin añadir módulos ni capas innecesarias:
controller/, dto/, entity/, exception/, repository/, service/, service/impl/, config/ y resources/db/migration/.

Reglas de trabajo:
1. Inspecciona primero el proyecto tal como está.
2. Resume únicamente qué archivos y tecnologías encuentras y qué falta para tener el backend terminado.
3. No modifiques nada todavía.
4. No crees frontend, dashboard, autenticación, paginación ni endpoints fuera del CRUD.
5. Cuando te autorice, implementarás una fase por prompt y te detendrás al terminarla.
6. No elimines ni reestructures archivos que ya están implementados.

En esta fase solo confirma el contexto; no ejecutes cambios.
```

## Explicación

El primer mensaje **orienta a Codex**. No modifica archivos, no necesita levantar contenedores y reduce el riesgo de que use nombres de paquetes o tecnologías distintas.

## Verificación

Codex debe reconocer `inventory-api/`, `com.latecnologiaavanza` y que **no está autorizado a editar** en esta fase.
