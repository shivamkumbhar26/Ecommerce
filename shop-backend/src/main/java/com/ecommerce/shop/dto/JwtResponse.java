package com.ecommerce.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String jwt; 
    private String role;
    private String email ;
    private String fullName;
   
}
