package com.ecommerce.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.shop.model.*;
import com.ecommerce.shop.dto.ApiResponse;
import com.ecommerce.shop.repository.UserRepository;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItem newItem, Principal principal) {
        // 1. Find user by email from JWT
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(404).body(new ApiResponse(false, "User not found"));
        }

        User user = userOpt.get();
        
        // 2. Safety Check: If cart is null for some reason, initialize it
        if (user.getCart() == null) {
            user.setCart(new ArrayList<>());
        }

        // 3. Match variable names from your CartItem class
        boolean exists = false;
        for (CartItem item : user.getCart()) {
            // Use getProductId() and getQuantity() from your CartItem model
            if (item.getProductId().equals(newItem.getProductId())) {
                item.setQuantity(item.getQuantity() + newItem.getQuantity());
                exists = true;
                break;
            }
        }

        if (!exists) {
            user.getCart().add(newItem);
        }

        // 4. Save back to the "users" collection
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse(true, "Item added to cart successfully"));
    }

    @GetMapping("/view")
    public ResponseEntity<?> getCart(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .map(user -> ResponseEntity.ok(user.getCart()))
                .orElse(ResponseEntity.status(404).body(null));
    }
    
 // 1. Remove a specific item from the cart
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeItem(@PathVariable String productId, Principal principal) {
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Remove the item if the productId matches
            user.getCart().removeIf(item -> item.getProductId().equals(productId));
            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse(true, "Item removed from cart"));
        }
        return ResponseEntity.status(404).body(new ApiResponse(false, "User not found"));
    }

    // 2. Clear the entire cart
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Principal principal) {
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.getCart().clear(); // Empties the list
            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse(true, "Cart cleared successfully"));
        }
        return ResponseEntity.status(404).body(new ApiResponse(false, "User not found"));
    }
}