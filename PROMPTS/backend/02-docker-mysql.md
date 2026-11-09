# 02 — Docker Compose y MySQL

> **Origen: RECONSTRUCCIÓN DOCUMENTAL.** El segundo prompt ya había sido utilizado con Codex antes de las fases posteriores. El texto exacto original no se recuperó; se reconstruyó contrastando el contexto acordado y los archivos existentes del repositorio de trabajo.

## Propósito

Preparar el entorno reproducible del backend con **MySQL 8 + Docker Compose**, conservando la configuración Angular ya prevista. No implementar todavía las clases del CRUD.

## Prompt para Codex

```text
Configura Docker y MySQL para el backend de inventario que ya existe en inventory-api/.

Stack obligatorio: Java 8, Spring Boot 2.7.18, Maven y MySQL 8. Conservar el groupId y paquete Java com.latecnologiaavanza. No modificar inventory-web/.

1. Crear o ajustar inventory-api/Dockerfile con dos etapas:
- Builder: maven:3.9-eclipse-temurin-8.
- WORKDIR /app.
- Copiar pom.xml y ejecutar mvn -B dependency:go-offline.
- Copiar src y ejecutar mvn -B clean package -DskipTests.
- Runtime: eclipse-temurin:8-jre-alpine.
- WORKDIR /app, TZ=America/Lima.
- Crear usuario/grupo spring no root y ejecutar con USER spring:spring.
- Copiar /app/target/inventory-api-1.0.0-SNAPSHOT.jar desde builder como app.jar.
- Exponer 8081 e iniciar Java con -Duser.timezone=America/Lima -jar app.jar.

2. Preparar inventory-api/.dockerignore para excluir artefactos y archivos locales innecesarios.

3. Configurar docker-compose.yml en la raíz del repositorio, respetando los servicios existentes:
- mysql: imagen mysql:8.0, contenedor inventory-mysql, puerto 3307:3306.
- Base de datos inventory_db, usuario inventory_user y contraseña inventory_pass por defecto; root_pass para root. Leer valores desde variables de entorno con valores de respaldo.
- Zona horaria America/Lima.
- Persistir MySQL en volumen inventory_mysql_data.
- Healthcheck con mysqladmin ping; interval 10s, timeout 5s, retries 10, start_period 20s.
- inventory-api: construir desde ./inventory-api/Dockerfile, nombre inventory-api, puerto 8081:8081, esperar a que mysql esté healthy.
- Para la conexión desde el contenedor usar jdbc:mysql://mysql:3306/inventory_db y las variables DB_URL, DB_USERNAME, DB_PASSWORD.
- Conservar configuración SERVER_PORT, CORS_ALLOWED_ORIGINS y RATE_LIMIT_ENABLED, RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_SECONDS.
- Mantener el servicio inventory-web ya definido; no implementar ni modificar Angular en esta fase.

4. Crear inventory-api/.env.example con:
MYSQL_DATABASE=inventory_db
MYSQL_USER=inventory_user
MYSQL_PASSWORD=inventory_pass
MYSQL_ROOT_PASSWORD=root_pass
SERVER_PORT=8081
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60
CORS_ALLOWED_ORIGINS=http://localhost:4200

5. Conservar application.yml y las configuraciones de JPA/Flyway existentes; revisar solamente que el backend use el puerto 8081 y variables DB_* de manera coherente.

No añadir Redis, Kubernetes, autenticación ni otros servicios. No modificar el frontend. No recrear archivos ya correctos. Verificar docker compose config y detenerse; informa qué hiciste y qué debe probarse manualmente.
```

## Qué hace cada archivo

- `inventory-api/Dockerfile`: crea un JAR con Maven y lo ejecuta en una imagen Java 8.
- `inventory-api/.dockerignore`: evita copiar archivos que no son necesarios al contexto de construcción Docker.
- `docker-compose.yml`: define los contenedores, la red interna, los puertos, el volumen y el orden de arranque.
- `inventory-api/.env.example`: ejemplo de variables; **no es un archivo con secretos de producción**.

## Comprobación manual

Desde la **raíz** del repositorio:

```cmd
docker compose config
```

Valida y muestra la configuración final de Compose; no arranca servicios.

```cmd
docker compose up -d --build mysql inventory-api
```

Construye las imágenes necesarias e inicia MySQL y el backend en segundo plano. `-d` evita bloquear la terminal. El nombre `mysql` es el del servicio Docker; `localhost:3307` es el puerto para acceder desde Windows.

```cmd
docker compose ps
```

Muestra qué contenedores están ejecutándose.

**No ejecutar `docker compose down -v` si quieres conservar los datos**: `-v` elimina también el volumen de MySQL.
