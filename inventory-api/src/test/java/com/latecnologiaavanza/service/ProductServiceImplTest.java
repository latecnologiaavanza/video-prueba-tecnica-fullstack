package com.latecnologiaavanza.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.latecnologiaavanza.dto.ProductRequest;
import com.latecnologiaavanza.dto.ProductResponse;
import com.latecnologiaavanza.entity.Product;
import com.latecnologiaavanza.exception.ResourceNotFoundException;
import com.latecnologiaavanza.repository.ProductRepository;
import com.latecnologiaavanza.service.impl.ProductServiceImpl;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void debeListarProductosOrdenados() {
        when(productRepository.findAllByOrderByNameAsc()).thenReturn(Arrays.asList(
                product(1L, "Laptop Lenovo", new BigDecimal("2499.90")),
                product(2L, "Mouse", new BigDecimal("49.90"))));

        List<ProductResponse> products = productService.findAll(null);

        assertEquals(2, products.size());
        assertEquals("Laptop Lenovo", products.get(0).getName());
        assertEquals("Mouse", products.get(1).getName());
        verify(productRepository).findAllByOrderByNameAsc();
    }

    @Test
    void debeBuscarPorNombre() {
        when(productRepository.findByNameContainingIgnoreCaseOrderByNameAsc("lenovo"))
                .thenReturn(Arrays.asList(product(1L, "Laptop Lenovo", new BigDecimal("2499.90"))));

        List<ProductResponse> products = productService.findAll("lenovo");

        assertEquals(1, products.size());
        assertEquals("Laptop Lenovo", products.get(0).getName());
        verify(productRepository).findByNameContainingIgnoreCaseOrderByNameAsc("lenovo");
    }

    @Test
    void debeCrearProducto() {
        ProductRequest request = request("Teclado", "Teclado mecánico", 4, new BigDecimal("99.90"));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(2L);
            return product;
        });

        ProductResponse response = productService.create(request);

        assertEquals("Teclado", response.getName());
        assertEquals(Long.valueOf(2L), response.getId());
        assertEquals(new BigDecimal("99.90"), response.getPrice());
    }

    @Test
    void debeLanzarExcepcionSiNoExiste() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> productService.findById(99L));
    }

    private Product product(Long id, String name, BigDecimal price) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setDescription("Descripción");
        product.setQuantity(1);
        product.setPrice(price);
        return product;
    }

    private ProductRequest request(String name, String description, Integer quantity, BigDecimal price) {
        ProductRequest request = new ProductRequest();
        request.setName(name);
        request.setDescription(description);
        request.setQuantity(quantity);
        request.setPrice(price);
        return request;
    }

}
