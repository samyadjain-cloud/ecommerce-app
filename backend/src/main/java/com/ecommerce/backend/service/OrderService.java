package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.OrderDTO;
import com.ecommerce.backend.dto.OrderItemDTO;
import com.ecommerce.backend.model.*;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.OrderItemRepository;
import com.ecommerce.backend.repository.CartRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;

    @Value("${stripe.api.key}")
    private String stripeKey;

    public Map<String, Object> createPaymentIntent(User user, Double amount) throws StripeException {
        Stripe.apiKey = stripeKey;

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(amount);
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);

        List<Cart> cartItems = cartRepository.findByUser(user);
        List<OrderItem> orderItems = new ArrayList<>();

        for (Cart cart : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cart.getProduct());
            orderItem.setQuantity(cart.getQuantity());
            orderItem.setPrice(cart.getProduct().getPrice());
            orderItems.add(orderItem);
        }

        orderItemRepository.saveAll(orderItems);
        savedOrder.setItems(orderItems);

        Map<String, Object> params = new HashMap<>();
        params.put("amount", (long) (amount * 100));
        params.put("currency", "usd");
        params.put("description", "E-commerce purchase");

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        savedOrder.setStripePaymentId(paymentIntent.getId());
        orderRepository.save(savedOrder);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", savedOrder.getId());
        response.put("clientSecret", paymentIntent.getClientSecret());
        response.put("amount", amount);
        response.put("currency", "USD");
        response.put("status", paymentIntent.getStatus());

        return response;
    }

    public Map<String, Object> completePayment(Long orderId) throws StripeException {
        Stripe.apiKey = stripeKey;

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        PaymentIntent paymentIntent = PaymentIntent.retrieve(order.getStripePaymentId());

        if ("succeeded".equals(paymentIntent.getStatus())) {
            order.setStatus("COMPLETED");
            orderRepository.save(order);

            List<Cart> cartItems = cartRepository.findByUser(order.getUser());
            cartRepository.deleteAll(cartItems);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("status", "COMPLETED");
            response.put("totalAmount", order.getTotalAmount());
            return response;
        } else {
            throw new RuntimeException("Payment not successful");
        }
    }

    public List<OrderDTO> getUserOrders(User user) {
        List<Order> orders = orderRepository.findByUser(user);
        List<OrderDTO> orderDTOs = new ArrayList<>();

        for (Order order : orders) {
            OrderDTO dto = new OrderDTO();
            dto.setId(order.getId());
            dto.setTotalAmount(order.getTotalAmount());
            dto.setStatus(order.getStatus());
            dto.setStripePaymentId(order.getStripePaymentId());
            dto.setCreatedAt(order.getCreatedAt());

            List<OrderItemDTO> itemDTOs = new ArrayList<>();
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setProductId(item.getProduct().getId());
                    itemDTO.setProductName(item.getProduct().getName());
                    itemDTO.setProductPrice(item.getPrice());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setSubtotal(item.getSubtotal());
                    itemDTOs.add(itemDTO);
                }
            }
            dto.setItems(itemDTOs);
            orderDTOs.add(dto);
        }

        return orderDTOs;
    }
}