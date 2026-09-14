package com.moolya.controller;

import com.moolya.dto.DealReplyDto;
import com.moolya.dto.DealRequestDto;
import com.moolya.model.Order;
import com.moolya.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/deal-request")
    public ResponseEntity<Order> requestDeal(@Valid @RequestBody DealRequestDto request) {
        Order order = orderService.requestDeal(request);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/deal-reply")
    public ResponseEntity<Order> replyToDeal(@Valid @RequestBody DealReplyDto reply) {
        Order order = orderService.replyToDeal(reply);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/farmer-orders/{farmerId}")
    public ResponseEntity<List<Order>> getFarmerOrders(@PathVariable String farmerId) {
        List<Order> orders = orderService.getFarmerOrders(farmerId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/buyer-orders/{buyerId}")
    public ResponseEntity<List<Order>> getBuyerOrders(@PathVariable String buyerId) {
        List<Order> orders = orderService.getBuyerOrders(buyerId);
        return ResponseEntity.ok(orders);
    }
}
