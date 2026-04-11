package com.ecommerce.shop.controller;

import com.ecommerce.shop.dto.ApiResponse;
import com.ecommerce.shop.model.Order;
import com.ecommerce.shop.model.User;
import com.ecommerce.shop.repository.OrderRepository;
import com.ecommerce.shop.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired 
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/add-employee")
    public ResponseEntity<?> addEmployee(@RequestBody User employeeData) {
        // 1. Check if email is already taken
        if (userRepository.existsByEmail(employeeData.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        
        
        // 2. Create the new Employee object
        User employee = new User();
        employee.setFullName(employeeData.getFullName());
        employee.setEmail(employeeData.getEmail());
        
        // 3. Encrypt the password set by the Admin
        employee.setPassword(passwordEncoder.encode(employeeData.getPassword()));
        
        // 4. Set the role to ROLE_EMPLOYEE so the OrderController can find them
        employee.setRole("ROLE_EMPLOYEE");

        userRepository.save(employee);
        
        return ResponseEntity.ok("Employee registered successfully with ROLE_EMPLOYEE!");
    }
    
 // 1. DELETE USER: Remove a student or employee from the system
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        return userRepository.findById(userId)
            .map(user -> {
                userRepository.delete(user);
                return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
            })
            .orElse(ResponseEntity.status(404).body(new ApiResponse(false, "User not found")));
    }

    // 2. PROMOTE USER: Change a ROLE_USER to ROLE_EMPLOYEE
    @PatchMapping("/users/{userId}/promote")
    public ResponseEntity<?> promoteToEmployee(@PathVariable String userId) {
        return userRepository.findById(userId)
            .map(user -> {
                user.setRole("ROLE_EMPLOYEE");
                userRepository.save(user);
                return ResponseEntity.ok(new ApiResponse(true, user.getFullName() + " is now an Employee"));
            })
            .orElse(ResponseEntity.status(404).body(new ApiResponse(false, "User not found")));
    }
    
    @GetMapping("/employees")
    public ResponseEntity<List<User>> getAllEmployees() {
        // We use the same repository method your OrderController uses
        List<User> employees = userRepository.findByRole("ROLE_EMPLOYEE");
        
        // We return the list. If no employees exist, it returns an empty array []
        return ResponseEntity.ok(employees);
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        // Returns all registered students and employees
        return ResponseEntity.ok(userRepository.findAll());
    }

    // --- ORDER MANAGEMENT ---

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        // Returns every order in the system for the Admin table
        return ResponseEntity.ok(orderRepository.findAll());
    }
    
}