# 05 — CORS y Rate Limiting

> **Origen: prompt posterior proporcionado en la conversación.** Esta versión conserva las expresiones de configuración correctas, sin enlaces añadidos accidentalmente por formato del editor.

## Propósito

Permitir solicitudes del frontend y limitar la cantidad de peticiones por IP; **no** añadir autenticación, Redis u otro sistema.

## Prompt para Codex

```text
Implementa las dos configuraciones pendientes en com.latecnologiaavanza.config.

1. Crear RateLimitInterceptor.java.

Utiliza @Component e implementa HandlerInterceptor.

Configurar mediante @Value:
- app.rate-limit.enabled: true
- app.rate-limit.max-requests: 100
- app.rate-limit.window-seconds: 60

Utiliza ConcurrentHashMap<String, Window> y System.currentTimeMillis() para registrar solicitudes por IP mediante request.getRemoteAddr().

La clase interna Window debe tener startedAt y requests.

En preHandle:
- Permitir OPTIONS.
- Permitir solicitudes si el limitador está deshabilitado.
- Reiniciar el contador al terminar la ventana temporal.
- Permitir hasta 100 solicitudes por IP en 60 segundos.
- Superado el límite, devolver HTTP 429 y JSON:

{"status":429,"message":"Se excedió el límite de solicitudes. Intenta nuevamente más tarde."}

Capturar IOException al escribir la respuesta.

2. Crear WebConfig.java.

Utilizar @Configuration e implementar WebMvcConfigurer.

Inyectar allowedOrigins mediante @Value("${app.cors.allowed-origins:http://localhost:4200}") y RateLimitInterceptor mediante constructor.

Configurar CORS para /** con:
- allowedOrigins(allowedOrigins.split(","))
- Métodos GET, POST, PUT, DELETE, OPTIONS.
- allowedHeaders("*").

Registrar RateLimitInterceptor exclusivamente en /api/**.

Conservar application.yml porque las propiedades ya están configuradas.

No utilizar Redis, Spring Security ni librerías adicionales. No modificar frontend ni Docker.

Compilar y detenerse al finalizar.
```

## Explicación

- **CORS:** autoriza a la aplicación Angular en `http://localhost:4200` a llamar a la API cuando se hace una petición entre orígenes distintos.
- **OPTIONS:** tipo de solicitud usado, entre otros casos, por el navegador para consultar permisos CORS.
- **Rate Limit:** permite por defecto 100 solicitudes por IP dentro de una ventana de 60 segundos y devuelve `429 Too Many Requests` cuando se supera.
- **ConcurrentHashMap:** almacena contadores por IP para manejar accesos concurrentes.

## Verificación

Abre `http://localhost:8081/swagger-ui.html` y prueba las operaciones. Para comprobar el límite de forma práctica, puedes arrancar temporalmente el backend con `RATE_LIMIT_MAX_REQUESTS=3` y comprobar que la cuarta solicitud de la misma IP dentro de la ventana recibe 429; luego restaura el valor 100.
