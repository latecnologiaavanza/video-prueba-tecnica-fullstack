# 03 — Ajustes mínimos de compatibilidad

> **Origen: prompt posterior proporcionado en la conversación.** Esta fase corresponde al primer prompt de la serie complementaria, después de contexto y Docker.

## Propósito

Hacer que JPA reconozca la entidad, que el nombre del JAR coincida con Docker y pulir el texto del DTO, **sin reescribir el backend**.

## Prompt para Codex

```text
Realiza únicamente estas correcciones en inventory-api/:

1. En entity/Product.java agrega el import javax.persistence.Entity y la anotación @Entity encima de @Table. Conserva todos los atributos y métodos existentes.

2. En pom.xml cambia únicamente la versión del proyecto de 1.0-SNAPSHOT a 1.0.0-SNAPSHOT, ya que el Dockerfile espera ese JAR. Conserva groupId=com.latecnologiaavanza y todas las dependencias.

3. En dto/ProductRequest.java corrige la descripción @Schema del nombre a "Nombre del producto", conservando el resto de las anotaciones.

No cambies paquetes Java, Docker, Flyway, Service, DTO ni otras configuraciones.

Ejecuta mvn -B -DskipTests clean package y comunica el resultado. No avances a otra fase.
```

## Qué significa

- `@Entity`: hace que JPA trate a `Product` como entidad persistente.
- `pom.xml` con `1.0.0-SNAPSHOT`: el JAR generado debe coincidir con la ruta usada por el Dockerfile.
- `@Schema`: mejora el texto de la documentación OpenAPI; no cambia la validación de datos.

## Comprobación manual

Desde `inventory-api/`:

```cmd
mvn -B -DskipTests clean package
```

`clean` borra el resultado anterior; `package` compila y construye el JAR; `-DskipTests` omite la ejecución de tests, **no la compilación de test**; `-B` usa modo no interactivo de Maven. Debe terminar en `BUILD SUCCESS` y crear `target/inventory-api-1.0.0-SNAPSHOT.jar`.

**Estado en el repositorio actual:** JAR y entidad presentes; no es necesario ejecutar esta corrección otra vez.
