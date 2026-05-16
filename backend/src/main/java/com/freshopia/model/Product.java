package com.freshopia.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    private String id;
    
    private String name;
    
    @Enumerated(EnumType.STRING)
    private Category category;
    
    private Double price;
    private String unit;
    private String image;
    
    @Column(length = 1000)
    private String freshness_metadata;
    
    @Column(length = 2000)
    private String description;
}
