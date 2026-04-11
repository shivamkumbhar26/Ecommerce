package com.ecommerce.shop.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.ecommerce.shop.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    // This method is used during Login to find the user
    Optional<User> findByEmail(String email);
 // Add this line inside the interface
    List<User> findByRole(String role);
    boolean existsByEmail(String email);
}