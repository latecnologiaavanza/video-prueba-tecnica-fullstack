# 06 — Pruebas automatizadas del backend


## Requisitos de partida

El servicio, el controlador, la entidad y el repositorio ya deben funcionar. Maven debe tener las dependencias de `spring-boot-starter-test` y H2 para las pruebas.

## Prompt para Codex

```text
Implementa únicamente las pruebas automatizadas del backend, usando el paquete com.latecnologiaavanza.

Utiliza JUnit 5, Mockito, MockMvc y H2, con Java 8 y Spring Boot 2.7.18.

1. Crear src/test/resources/application-test.yml:
- H2: jdbc:h2:mem:inventory_test;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
- Usuario sa, contraseña vacía.
- Hibernate create-drop.
- Dialecto H2Dialect.
- Flyway deshabilitado.
- app.rate-limit.enabled=false.

2. Crear service/ProductServiceImplTest.java.

Usar MockitoExtension, @Mock ProductRepository y @InjectMocks ProductServiceImpl.

Cuatro pruebas:
- debeListarProductosOrdenados.
- debeBuscarPorNombre, comprobando trim() sobre " lenovo ".
- debeCrearProducto, verificando nombre "Teclado", ID 2 y precio 99.90.
- debeLanzarExcepcionSiNoExiste, usando ID 99.

3. Crear controller/ProductControllerTest.java.

Usar @WebMvcTest(ProductController.class), MockMvc, @MockBean ProductService y @MockBean RateLimitInterceptor. Configurar preHandle() para devolver true.

Dos pruebas:
- debeDevolverLaListaDeProductos: GET devuelve 200 y Laptop Lenovo.
- debeRechazarUnProductoInvalido: POST con nombre vacío, cantidad -1 y precio 0 devuelve 400 y fieldErrors.

4. Crear repository/ProductRepositoryTest.java.

Usar @DataJpaTest y H2.

Una prueba:
- debeBuscarProductosPorNombreSinDistinguirMayusculas: guardar Laptop Lenovo y encontrarlo buscando "lenovo".

5. Crear ProductIntegrationTest.java en el paquete base.

Usar @SpringBootTest, @AutoConfigureMockMvc y @ActiveProfiles("test").

Una prueba:
- debeCompletarElCrudDeProductos: POST → 201, GET → 200, PUT → 200, DELETE → 204 y GET posterior → 404.

Usar H2 y limpiar registros mediante @BeforeEach.

Total: 8 pruebas.

No crear pruebas adicionales ni modificar la lógica de negocio para ocultar fallos.

Ejecuta mvn -B clean verify. Informa el número de pruebas exitosas, fallidas y errores reales.
```

## Qué verifica cada test

| Clase | Pruebas |
|---|---:|
| `ProductServiceImplTest` | 4 |
| `ProductControllerTest` | 2 |
| `ProductRepositoryTest` | 1 |
| `ProductIntegrationTest` | 1 |
| **Total** | **8** |

## Comando manual

Desde `inventory-api/`:

```cmd
mvn -B clean verify
```

`clean` borra compilaciones anteriores; `verify` ejecuta los tests y valida el ciclo de build. El resultado esperado al finalizar la fase es **8 pruebas ejecutadas y 0 fallos**. Si ocurre algún error, revisa los mensajes reales de Maven antes de continuar.
