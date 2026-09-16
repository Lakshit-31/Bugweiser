package com.moolya.service;

import com.moolya.dto.DealReplyDto;
import com.moolya.dto.DealRequestDto;
import com.moolya.dto.PaymentRequestDto;
import com.moolya.model.*;
import com.moolya.repository.ChatMessageRepository;
import com.moolya.repository.OrderRepository;
import com.moolya.repository.ProduceListingRepository;
import com.moolya.repository.TransactionRepository;
import com.moolya.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProduceListingRepository produceListingRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository,
                        ProduceListingRepository produceListingRepository,
                        UserRepository userRepository,
                        TransactionRepository transactionRepository,
                        ChatMessageRepository chatMessageRepository,
                        NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.produceListingRepository = produceListingRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.notificationService = notificationService;
    }

    public Order requestDeal(DealRequestDto req) {
        ProduceListing listing = produceListingRepository.findById(req.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found: " + req.getListingId()));

        User buyer = userRepository.findById(req.getBuyerId())
                .orElseThrow(() -> new RuntimeException("Buyer not found: " + req.getBuyerId()));

        User farmer = userRepository.findById(listing.getFarmerId()).orElse(null);

        Order order = new Order();
        order.setListingId(listing.getId());
        order.setCropName(listing.getCropName());

        String unit = req.getUnit() != null ? req.getUnit() : "QUINTAL";
        Double displayQty = req.getDisplayQuantity() != null ? req.getDisplayQuantity() : (req.getQuantityQuintals() != null ? req.getQuantityQuintals() : listing.getQuantityQuintals());
        Double qtyQuintals = "KG".equalsIgnoreCase(unit) ? (displayQty / 100.0) : displayQty;

        order.setUnit(unit);
        order.setDisplayQuantity(displayQty);
        order.setQuantityQuintals(qtyQuintals);
        order.setTotalAmount(qtyQuintals * listing.getPricePerQuintal());

        order.setBuyerId(buyer.getId());
        order.setBuyerName(buyer.getFullName());
        order.setBuyerPhone(buyer.getPhone());

        order.setFarmerId(listing.getFarmerId());
        order.setFarmerName(farmer != null ? farmer.getFullName() : listing.getFarmerName());
        order.setFarmerPhone(farmer != null ? farmer.getPhone() : listing.getFarmerPhone());

        order.setStatus(OrderStatus.REQUESTED);
        String reqDate = req.getRequestedDeliveryDate();
        if (reqDate == null || reqDate.trim().isEmpty()) {
            reqDate = java.time.LocalDate.now().plusDays(7).format(DateTimeFormatter.ISO_LOCAL_DATE);
        } else {
            java.time.LocalDate parsed = GradingService.parseDateFlexible(reqDate);
            if (parsed != null) {
                reqDate = parsed.format(DateTimeFormatter.ISO_LOCAL_DATE);
            }
        }
        order.setRequestedDeliveryDate(reqDate);
        order.setExpectedDeliveryDate(reqDate);

        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        order.setCreatedAt(nowStr);
        order.setUpdatedAt(nowStr);

        Order savedOrder = orderRepository.save(order);

        // Real-time WebSocket audio trigger to farmer
        notificationService.sendDealRequestNotificationToFarmer(savedOrder);

        return savedOrder;
    }

    public Order replyToDeal(DealReplyDto req) {
        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + req.getOrderId()));

        if (req.isAccepted()) {
            order.setStatus(OrderStatus.ACCEPTED);
            order.setExpectedDeliveryDate(req.getExpectedDeliveryDate());
            order.setFarmerVoiceNote(req.getFarmerVoiceNote());
            order.setDelayReason(req.getDelayReason());

            // Mark listing as ORDERED
            ProduceListing listing = produceListingRepository.findById(order.getListingId()).orElse(null);
            if (listing != null) {
                listing.setStatus(ListingStatus.ORDERED);
                produceListingRepository.save(listing);
            }
        } else {
            order.setStatus(OrderStatus.DECLINED);
        }

        order.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        Order saved = orderRepository.save(order);

        // Real-time WebSocket notification to buyer
        notificationService.sendDealReplyNotificationToBuyer(saved);

        return saved;
    }

    public Transaction processPayment(PaymentRequestDto req) {
        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + req.getOrderId()));

        String txnId = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setOrderId(order.getId());
        transaction.setListingId(order.getListingId());
        transaction.setCropName(order.getCropName());
        transaction.setQuantityQuintals(order.getQuantityQuintals());
        transaction.setAmount(req.getAmount() != null ? req.getAmount() : order.getTotalAmount());
        transaction.setBuyerId(order.getBuyerId());
        transaction.setBuyerName(order.getBuyerName());
        transaction.setFarmerId(order.getFarmerId());
        transaction.setFarmerName(order.getFarmerName());
        transaction.setPaymentMethod(req.getPaymentMethod().toUpperCase());
        transaction.setTransactionId(txnId);
        transaction.setStatus("SUCCESSFUL");
        transaction.setCreatedAt(nowStr);

        Transaction savedTxn = transactionRepository.save(transaction);

        // Update Order payment status
        order.setPaymentStatus("PAID");
        order.setPaymentMethod(req.getPaymentMethod().toUpperCase());
        order.setPaymentTransactionId(txnId);
        order.setPaidAt(nowStr);
        order.setUpdatedAt(nowStr);
        orderRepository.save(order);

        // Send payment WebSocket voice notification to farmer
        notificationService.sendPaymentSuccessNotificationToFarmer(order, savedTxn);

        return savedTxn;
    }

    public List<Order> getFarmerOrders(String farmerId) {
        return orderRepository.findByFarmerId(farmerId);
    }

    public List<Order> getBuyerOrders(String buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    public List<Transaction> getBuyerTransactions(String buyerId) {
        return transactionRepository.findByBuyerId(buyerId);
    }

    public List<Transaction> getFarmerTransactions(String farmerId) {
        return transactionRepository.findByFarmerId(farmerId);
    }

    public ChatMessage saveChatMessage(ChatMessage req) {
        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + req.getOrderId()));

        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        req.setCreatedAt(nowStr);

        // Determine receiver if missing
        if (req.getReceiverId() == null || req.getReceiverId().isEmpty()) {
            if ("ROLE_FARMER".equals(req.getSenderRole())) {
                req.setReceiverId(order.getBuyerId());
                req.setReceiverName(order.getBuyerName());
            } else {
                req.setReceiverId(order.getFarmerId());
                req.setReceiverName(order.getFarmerName());
            }
        }

        ChatMessage saved = chatMessageRepository.save(req);
        notificationService.sendChatMessageNotification(saved);
        return saved;
    }

    public List<ChatMessage> getOrderChatHistory(String orderId) {
        return chatMessageRepository.findByOrderIdOrderByCreatedAtAsc(orderId);
    }

    public void clearAllOrdersAndTransactions() {
        orderRepository.deleteAll();
        transactionRepository.deleteAll();
        chatMessageRepository.deleteAll();
    }
}
