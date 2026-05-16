package com.freshopia.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingBreakdown {
    private Double item_total;
    private Double gst;
    @Builder.Default
    private Double delivery_fee = 25.0;
    @Builder.Default
    private Double handling_fee = 5.0;
    private Double grand_total;
}
