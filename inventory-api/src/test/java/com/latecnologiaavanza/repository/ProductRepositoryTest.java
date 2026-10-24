package com.latecnologiaavanza.repository;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.latecnologiaavanza.entity.Product;

@DataJpaTest
@ActiveProfiles("test")
class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    @Test
    void debeBuscarProductosPorNombreSinDistinguirMayusculas() {
        Product product = new Product();
        product.setName("Laptop Lenovo");
        product.setDescription("Laptop para oficina");
        product.setQuantity(5);
        product.setPrice(new BigDecimal("2499.90"));
        productRepository.saveAndFlush(product);

        List<Product> products = productRepository.findByNameContainingIgnoreCaseOrderByNameAsc("lenovo");

        assertEquals(1, products.size());
        assertEquals("Laptop Lenovo", products.get(0).getName());
    }

}
