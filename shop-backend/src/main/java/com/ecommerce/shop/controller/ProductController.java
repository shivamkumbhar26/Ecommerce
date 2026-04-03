package com.ecommerce.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.shop.model.Product;
import com.ecommerce.shop.dto.ApiResponse;
import com.ecommerce.shop.repository.ProductRepository;

import java.util.ArrayList;
import java.util.Date;

@RestController
@RequestMapping("/api/admin/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        // 1. Validation: Name, SKU, and Price
        if (product.getName() == null || product.getName().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Product name is required."));
        }
        if (product.getSku() == null || product.getSku().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "SKU is required."));
        }
        if (product.getPrice() <= 0) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Price must be greater than zero."));
        }

        try {
            // 2. Image URL Logic: Handle empty or null lists
            if (product.getImageUrls() == null) {
                product.setImageUrls(new ArrayList<>()); 
            }

            // Placeholder logic for future S3 integration:
            // For now, if the list is empty, we could set a 'default' placeholder image
            if (product.getImageUrls().isEmpty()) {
                product.getImageUrls().add("https://your-placeholder-url.com/default-product.png");
            }

            // 3. Timestamps
            product.setCreatedAt(new Date());
            product.setUpdatedAt(new Date());

            // 4. Save to Atlas
            Product savedProduct = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Internal Server Error: " + e.getMessage()));
        }
    }
}