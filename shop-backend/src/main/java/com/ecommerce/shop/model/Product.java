package com.ecommerce.shop.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;           // product_id

    private String sku;          
    private String name;         
    private String description;  
    private String brand;
    
    private float price;         // Base Price (MSRP)
    
    @Field("sale_price")
    private float salePrice;     // Actual Selling Price

    private String currency;     
    private String category;

    @Field("image_urls")
    private List<String> imageUrls; 

    @Field("stock_quantity")
    private int stockQuantity;

    @Field("created_at")
    private Date createdAt = new Date();

    @Field("updated_at")
    private Date updatedAt = new Date();

    // Flexible attributes for specific products
    private Map<String, Object> specifications;
}