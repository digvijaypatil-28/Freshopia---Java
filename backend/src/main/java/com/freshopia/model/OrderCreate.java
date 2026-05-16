package com.freshopia.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreate {
    private List<CartItem> items;
    private String address;
    private String payment_method;
    private Double total;
}
