package com.ecommerce.shop.repository;

import com.ecommerce.shop.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserEmail(String email);
    List<Order> findByAssignedTo(String email); // For Employee Dashboard
}