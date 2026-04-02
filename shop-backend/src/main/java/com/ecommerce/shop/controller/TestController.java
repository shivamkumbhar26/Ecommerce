package com.ecommerce.shop.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class TestController {

    @GetMapping("/user")
    public String testUser(Principal principal) {
        // principal.getName() will return the email stored in the JWT
        return "Backend recognizes you! Your email is: " + principal.getName();
    }
}