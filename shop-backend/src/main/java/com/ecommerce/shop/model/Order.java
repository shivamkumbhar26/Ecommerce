package com.ecommerce.shop.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "orders")
@Data
public class Order {
    @Id
    private String id;
    private String userEmail;
    private List<CartItem> items;
    private double totalAmount;
    private Date orderDate;
    
    private boolean isPaid;
    private String transactionId;
    private String assignedTo;      // Employee Email
    private String deliveryStatus;  // "PENDING", "ASSIGNED", "OUT_FOR_DELIVERY", "DELIVERED"
}