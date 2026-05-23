package com.ecommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Double totalAmount;
    private String status;
    private String stripePaymentId;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
}