package com.ecommerce.shop.controller;

import com.ecommerce.shop.model.*;
import com.ecommerce.shop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, String> paymentData, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).get();

        if (user.getCart().isEmpty()) return ResponseEntity.badRequest().body("Cart is empty");

        // 1. Verify Dummy Payment ID from Frontend
        String paymentId = paymentData.get("paymentId");
        if (paymentId == null) return ResponseEntity.badRequest().body("Payment Required");

        // 2. Calculate Total Price
        double total = user.getCart().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity()).sum();

        // 3. Initialize Order
        Order order = new Order();
        order.setUserEmail(user.getEmail());
        order.setItems(new ArrayList<>(user.getCart()));
        order.setTotalAmount(total);
        order.setOrderDate(new Date());
        order.setPaid(true);
        order.setTransactionId("TXN-" + System.currentTimeMillis());
        order.setDeliveryStatus("PENDING");

        // 4. SMART ASSIGNMENT: Find the employee with the least active orders
        List<User> employees = userRepository.findByRole("ROLE_EMPLOYEE");
        
        if (!employees.isEmpty()) {
            User bestEmployee = employees.stream()
                .min(Comparator.comparingInt(emp -> 
                    orderRepository.findByAssignedTo(emp.getEmail()).size()
                )).get();

            order.setAssignedTo(bestEmployee.getEmail());
            order.setDeliveryStatus("ASSIGNED");
        }

        // 5. Save Order and Clear Cart
        orderRepository.save(order);
        user.getCart().clear();
        userRepository.save(user);

        return ResponseEntity.ok(order);
    }

    // API for Employees to see their specific tasks
    @GetMapping("/employee/tasks")
    public ResponseEntity<?> getEmployeeTasks(Principal principal) {
        return ResponseEntity.ok(orderRepository.findByAssignedTo(principal.getName()));
    }

    // API for Employees to update status (e.g., set to "DELIVERED")
    @PatchMapping("/update-status/{orderId}")
    public ResponseEntity<?> updateStatus(@PathVariable String orderId, @RequestParam String status) {
        return orderRepository.findById(orderId).map(order -> {
            order.setDeliveryStatus(status);
            orderRepository.save(order);
            return ResponseEntity.ok("Status updated to " + status);
        }).orElse(ResponseEntity.notFound().build());
    }
}