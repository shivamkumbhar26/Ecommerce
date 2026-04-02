package com.ecommerce.shop.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.ecommerce.shop.model.User;
import com.ecommerce.shop.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Injecting values from properties/env
    @Value("${admin.setup.email}")
    private String adminEmail;

    @Value("${admin.setup.password}")
    private String adminPassword;

    @Value("${admin.setup.name}")
    private String adminName;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setFullName(adminName);
            admin.setEmail(adminEmail);
            
            // Hashing the password from the environment variable
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("ROLE_ADMIN");

            userRepository.save(admin);
            System.out.println(">>> Seeded Admin Account: " + adminEmail);
        }
    }
}