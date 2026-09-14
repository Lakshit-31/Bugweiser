package com.moolya.service;

import com.moolya.dto.DealReplyDto;
import com.moolya.dto.DealRequestDto;
import com.moolya.model.*;
import com.moolya.repository.OrderRepository;
import com.moolya.repository.ProduceListingRepository;
import com.moolya.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProduceListingRepository produceListingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository,
                        ProduceListingRepository produceListingRepository,
                        UserRepository userRepository,
                        NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.produceListingRepository = produceListingRepository;
        this.userRepository = userRepository;
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
        order.setQuantityQuintals(req.getQuantityQuintals() != null ? req.getQuantityQuintals() : listing.getQuantityQuintals());
        order.setTotalAmount(order.getQuantityQuintals() * listing.getPricePerQuintal());

        order.setBuyerId(buyer.getId());
        order.setBuyerName(buyer.getFullName());
        order.setBuyerPhone(buyer.getPhone());

        order.setFarmerId(listing.getFarmerId());
        order.setFarmerName(farmer != null ? farmer.getFullName() : listing.getFarmerName());
        order.setFarmerPhone(farmer != null ? farmer.getPhone() : listing.getFarmerPhone());

        order.setStatus(OrderStatus.REQUESTED);
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

    public List<Order> getFarmerOrders(String farmerId) {
        return orderRepository.findByFarmerId(farmerId);
    }

    public List<Order> getBuyerOrders(String buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }
}
