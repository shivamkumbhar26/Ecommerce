package com.ecommerce.shop.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.ecommerce.shop.model.Product;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    // You can add custom search methods here later, like:
    List<Product> findByCategory(String category);
    List<Product> findByBrand(String brand);
}