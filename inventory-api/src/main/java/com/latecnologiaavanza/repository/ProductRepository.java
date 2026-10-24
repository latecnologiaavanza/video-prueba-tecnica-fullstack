package com.latecnologiaavanza.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.latecnologiaavanza.entity.Product;

@Repository 
public interface ProductRepository extends JpaRepository<Product, Long>{

    List<Product> findAllByOrderByNameAsc();

    List<Product> findByNameContainingIgnoreCaseOrderByNameAsc(String name);

    List<Product> findByName(String name);


}
