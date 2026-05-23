package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CartDTO;
import com.ecommerce.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartDTO>> getCart(Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(cartService.getCart(email));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            Authentication auth,
            @RequestBody Map<String, Object> request) {
        String email = auth.getName();
        Long productId = ((Number) request.get("productId")).longValue();
        Integer quantity = ((Number) request.get("quantity")).intValue();
        return ResponseEntity.ok(cartService.addToCart(email, productId, quantity));
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<CartDTO> updateQuantity(
            Authentication auth,
            @PathVariable Long cartId,
            @RequestBody Map<String, Integer> request) {
        String email = auth.getName();
        Integer quantity = request.get("quantity");
        return ResponseEntity.ok(cartService.updateQuantity(email, cartId, quantity));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> removeFromCart(
            Authentication auth,
            @PathVariable Long cartId) {
        String email = auth.getName();
        cartService.removeFromCart(email, cartId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication auth) {
        String email = auth.getName();
        cartService.clearCart(email);
        return ResponseEntity.noContent().build();
    }
}