package com.ecommerce.shop.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shop.dto.ApiResponse;
import com.ecommerce.shop.dto.JwtResponse;
import com.ecommerce.shop.model.LoginRequest;
import com.ecommerce.shop.model.User;
import com.ecommerce.shop.repository.UserRepository;
import com.ecommerce.shop.security.JwtUtils;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	@Autowired
	private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Injected from SecurityConfig

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email already exists!"));
        }

        // SECURITY FIX: Ignore the role from the frontend
        // Always force new registrations to be standard users
        user.setRole("ROLE_USER"); 

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        
        return ResponseEntity.ok(new ApiResponse(true, "User registered as ROLE_USER"));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        
        // 1. Find the user safely using Optional
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            // Return 404 Not Found with a clean JSON message
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "User not found with this email!"));
        }

        User user = userOptional.get();

        // 2. Check password
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            
            String token = jwtUtils.generateToken(user);
            
            // Return 200 OK with the Token and User info
            return ResponseEntity.ok(new JwtResponse(token, user.getFullName(), user.getRole()));
            
        } else {
            // Return 401 Unauthorized for wrong password
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid password. Please try again."));
        }
    }
}