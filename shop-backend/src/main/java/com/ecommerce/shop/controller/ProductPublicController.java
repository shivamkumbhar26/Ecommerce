package com.ecommerce.shop.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.shop.dto.ApiResponse;
import com.ecommerce.shop.model.Product;
import com.ecommerce.shop.repository.ProductRepository;

@RestController
@RequestMapping("/api/products") // Publicly accessible
public class ProductPublicController {

    @Autowired
    private ProductRepository productRepository;

    // 1. Get all products (For the Homepage)
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    // 2. Get a single product (For the Product Detail page)
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        // 1. Try to find the product
        Optional<Product> product = productRepository.findById(id);

        // 2. If it exists, return 200 OK with the product
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        }

        // 3. If it doesn't exist, return 404 with our error message
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Product not found with ID: " + id));
    }
}