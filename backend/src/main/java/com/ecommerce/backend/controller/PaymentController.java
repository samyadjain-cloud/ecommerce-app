package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.OrderDTO;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.service.OrderService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;

    @PostMapping("/create-intent")
    public ResponseEntity<?> createPaymentIntent(
            @RequestBody Map<String, Object> request,
            Authentication authentication) throws StripeException {

        User user = (User) authentication.getPrincipal();
        Double amount = ((Number) request.get("amount")).doubleValue();

        Map<String, Object> response = orderService.createPaymentIntent(user, amount);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completePayment(
            @RequestBody Map<String, Object> request,
            Authentication authentication) throws StripeException {

        Long orderId = ((Number) request.get("orderId")).longValue();
        Map<String, Object> response = orderService.completePayment(orderId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getUserOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<OrderDTO> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(orders);
    }
}