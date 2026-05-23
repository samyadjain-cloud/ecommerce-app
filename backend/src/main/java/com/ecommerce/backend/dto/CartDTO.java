package com.ecommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Double productPrice;
    private String productImage;
    private Integer quantity;
    private Double subtotal;
    private Long addedAt;
}