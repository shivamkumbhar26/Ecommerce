package com.ecommerce.shop.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String fullName;
    private String email;
    private String password; // This will store the BCrypt Hash
    private String role;     // "ROLE_USER" or "ROLE_ADMIN"

    // Initializing an empty cart for every new user
    private List<CartItem> cart = new ArrayList<>();
}


