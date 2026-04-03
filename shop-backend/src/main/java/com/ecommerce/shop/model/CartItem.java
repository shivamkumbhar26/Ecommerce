package com.ecommerce.shop.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private String productId;
    private String name;
    private float price;
    private int quantity;
}