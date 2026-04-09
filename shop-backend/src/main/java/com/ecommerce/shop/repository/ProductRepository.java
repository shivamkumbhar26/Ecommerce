package com.ecommerce.shop.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.ecommerce.shop.model.Product;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByBrand(String brand);
    // Full-text search: find products where name contains the search string (Case Insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);
}