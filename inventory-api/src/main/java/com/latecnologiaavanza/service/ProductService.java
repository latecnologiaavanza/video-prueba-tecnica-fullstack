package com.latecnologiaavanza.service;

import java.util.List;

import com.latecnologiaavanza.dto.ProductRequest;
import com.latecnologiaavanza.dto.ProductResponse;

public interface ProductService {

    List<ProductResponse> findAll(String name);

    ProductResponse findById(Long id);

    ProductResponse create(ProductRequest request);

    ProductResponse update(Long id,ProductRequest request);

    void delete(Long id);

}
