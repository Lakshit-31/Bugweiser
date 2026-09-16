package com.moolya.controller;

import com.moolya.dto.DealReplyDto;
import com.moolya.dto.DealRequestDto;
import com.moolya.dto.PaymentRequestDto;
import com.moolya.model.Order;
import com.moolya.model.Transaction;
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

    @PostMapping("/pay")
    public ResponseEntity<Transaction> processPayment(@Valid @RequestBody PaymentRequestDto request) {
        Transaction transaction = orderService.processPayment(request);
        return ResponseEntity.ok(transaction);
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

    @GetMapping("/transactions/buyer/{buyerId}")
    public ResponseEntity<List<Transaction>> getBuyerTransactions(@PathVariable String buyerId) {
        List<Transaction> list = orderService.getBuyerTransactions(buyerId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/transactions/farmer/{farmerId}")
    public ResponseEntity<List<Transaction>> getFarmerTransactions(@PathVariable String farmerId) {
        List<Transaction> list = orderService.getFarmerTransactions(farmerId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{orderId}/chat")
    public ResponseEntity<List<com.moolya.model.ChatMessage>> getOrderChatHistory(@PathVariable String orderId) {
        List<com.moolya.model.ChatMessage> history = orderService.getOrderChatHistory(orderId);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/{orderId}/chat")
    public ResponseEntity<com.moolya.model.ChatMessage> sendChatMessage(
            @PathVariable String orderId,
            @RequestBody com.moolya.model.ChatMessage message) {
        message.setOrderId(orderId);
        com.moolya.model.ChatMessage saved = orderService.saveChatMessage(message);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/clear-demo")
    public ResponseEntity<String> clearDemoOrders() {
        orderService.clearAllOrdersAndTransactions();
        return ResponseEntity.ok("All demo orders and transactions cleared successfully.");
    }
}
