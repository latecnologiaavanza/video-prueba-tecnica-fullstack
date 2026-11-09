# 04 — Servicio y controlador del CRUD

> **Origen: prompt posterior proporcionado en la conversación.** Mantener el paquete `com.latecnologiaavanza`.

## Propósito

Implementar la lógica del mantenimiento de productos y exponer sus cinco operaciones REST. DTO, repositorio, excepciones y migración ya existen al iniciar esta fase.

## Prompt para Codex

```text
Completa la implementación del CRUD de productos en inventory-api/.

Usa exclusivamente el paquete com.latecnologiaavanza, Java 8 y Spring Boot 2.7.18.

1. Implementa service/impl/ProductServiceImpl.java, que actualmente está vacío.

Debe implementar ProductService, utilizar @Service, @Transactional e inyección de ProductRepository por constructor.

Métodos:
- findAll(name): listar ordenado por nombre cuando sea null o vacío; de lo contrario, buscar usando name.trim() e ignorando mayúsculas.
- findById(id): consultar por ID.
- create(request): crear, guardar y devolver ProductResponse.
- update(id, request): buscar, actualizar, guardar y devolver respuesta.
- delete(id): buscar y eliminar.

Usar @Transactional(readOnly=true) para consultas.

Crear métodos privados findProduct(), copyRequest() y toResponse().

findProduct debe lanzar ResourceNotFoundException con "No se encontró el producto con id: " + id cuando no exista.

copyRequest debe aplicar trim() al nombre y a la descripción cuando no sea null.

2. Crear controller/ProductController.java.

Anotaciones: @RestController, @Validated, @RequestMapping("/api/v1/products") y @Tag(name="Productos", description="Operaciones de mantenimiento de productos").

Implementar:
- GET /api/v1/products, parámetro opcional name → 200.
- GET /api/v1/products/{id} → 200.
- POST /api/v1/products → 201.
- PUT /api/v1/products/{id} → 200.
- DELETE /api/v1/products/{id} → 204.

Utilizar ResponseEntity, @Valid en POST/PUT y @Positive(message="El id debe ser positivo") para los identificadores.

Documentar con @Operation: Listar productos, Obtener producto por id, Crear producto, Actualizar producto y Eliminar producto.

No recrees DTO, Repository, Entity, ProductService ni excepciones existentes.

No modifiques el frontend, Maven ni Docker. Verifica compilación y detente.
```

## Explicación breve

- **Controller:** recibe solicitudes HTTP y delega en `ProductService`.
- **ServiceImpl:** contiene reglas del CRUD, búsqueda y conversiones entre DTO y entidad.
- **Repository:** comunica con MySQL mediante Spring Data JPA.
- `@Transactional(readOnly = true)` indica una consulta; `@Valid` solicita validar el cuerpo POST/PUT.
- Los códigos 201 y 204 representan creación exitosa y eliminación sin contenido.

## Comprobación manual

Con MySQL y backend ejecutándose, probar en Swagger/Postman:

| Método | URL | Resultado |
|---|---|---|
| GET | `/api/v1/products` | 200 |
| GET | `/api/v1/products?name=laptop` | 200, filtrado |
| POST | `/api/v1/products` | 201 |
| GET | `/api/v1/products/{id}` | 200 |
| PUT | `/api/v1/products/{id}` | 200 |
| DELETE | `/api/v1/products/{id}` | 204 |
| GET | `/api/v1/products/999999` | 404, si no existe |

Ejemplo POST:

```json
{
  "name": "Laptop Lenovo",
  "description": "Laptop para oficina",
  "quantity": 10,
  "price": 2499.90
}
```

La API escucha en `http://localhost:8081`. Utiliza el ID real devuelto por POST para GET, PUT y DELETE.
