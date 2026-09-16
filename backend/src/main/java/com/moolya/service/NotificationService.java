package com.moolya.service;

import com.moolya.model.Order;
import com.moolya.model.Transaction;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendDealRequestNotificationToFarmer(Order order) {
        long qty = order.getQuantityQuintals() != null ? order.getQuantityQuintals().longValue() : 50L;
        // Spoken Hindi TTS phrase: "[Buyer Name] ने [Quantity] क्विंटल [Crop Name] का ऑर्डर प्लेस करा है।"
        String spokenHindiText = order.getBuyerName() + " ने " + qty + " क्विंटल " + order.getCropName() + " का ऑर्डर प्लेस करा है।";
        String spokenEnglishText = order.getBuyerName() + " has placed an order for " + qty + " quintals of " + order.getCropName() + ".";

        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "DEAL_REQUEST");
        payload.put("orderId", order.getId());
        payload.put("listingId", order.getListingId());
        payload.put("buyerId", order.getBuyerId());
        payload.put("buyerName", order.getBuyerName());
        payload.put("cropName", order.getCropName());
        payload.put("quantityQuintals", order.getQuantityQuintals());
        payload.put("totalAmount", order.getTotalAmount());
        payload.put("requestedDeliveryDate", order.getRequestedDeliveryDate());
        payload.put("spokenHindiText", spokenHindiText);
        payload.put("spokenEnglishText", spokenEnglishText);
        payload.put("createdAt", order.getCreatedAt());

        // Broadcast to specific farmer topic & general deals topic
        messagingTemplate.convertAndSend("/topic/farmer-deals/" + order.getFarmerId(), payload);
        messagingTemplate.convertAndSend("/topic/deals", payload);
    }

    public void sendDealReplyNotificationToBuyer(Order order) {
        String delayReasonText = order.getDelayReason() != null ? " (" + order.getDelayReason() + ")" : "";
        String spokenHindiText = order.getFarmerName() + " ने आपका ऑर्डर स्वीकार कर लिया है।" + 
                (order.getDelayReason() != null ? " कारण: " + order.getDelayReason() + "।" : "") + 
                " संभावित डिलीवरी की तारीख: " + (order.getExpectedDeliveryDate() != null ? order.getExpectedDeliveryDate() : "जल्द ही") + "।";
        String spokenEnglishText = order.getFarmerName() + " accepted your deal" + delayReasonText + ". Expected Delivery: " + 
                (order.getExpectedDeliveryDate() != null ? order.getExpectedDeliveryDate() : "Soon") + ".";

        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "DEAL_REPLY");
        payload.put("orderId", order.getId());
        payload.put("farmerId", order.getFarmerId());
        payload.put("farmerName", order.getFarmerName());
        payload.put("status", order.getStatus().name());
        payload.put("expectedDeliveryDate", order.getExpectedDeliveryDate());
        payload.put("delayReason", order.getDelayReason());
        payload.put("farmerVoiceNote", order.getFarmerVoiceNote());
        payload.put("spokenHindiText", spokenHindiText);
        payload.put("spokenEnglishText", spokenEnglishText);

        messagingTemplate.convertAndSend("/topic/buyer-updates/" + order.getBuyerId(), payload);
        messagingTemplate.convertAndSend("/topic/deals", payload);
    }

    public void sendChatMessageNotification(com.moolya.model.ChatMessage msg) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "CHAT_MESSAGE");
        payload.put("id", msg.getId());
        payload.put("orderId", msg.getOrderId());
        payload.put("senderId", msg.getSenderId());
        payload.put("senderName", msg.getSenderName());
        payload.put("senderRole", msg.getSenderRole());
        payload.put("receiverId", msg.getReceiverId());
        payload.put("receiverName", msg.getReceiverName());
        payload.put("message", msg.getMessage());
        payload.put("createdAt", msg.getCreatedAt());

        messagingTemplate.convertAndSend("/topic/order-chat/" + msg.getOrderId(), payload);
        messagingTemplate.convertAndSend("/topic/user-chats/" + msg.getReceiverId(), payload);
    }

    public void sendPaymentSuccessNotificationToFarmer(Order order, Transaction transaction) {
        long amountVal = order.getTotalAmount() != null ? order.getTotalAmount().longValue() : 0L;
        String spokenHindiText = "आपको " + order.getBuyerName() + " से ₹" + amountVal + " का पूरा भुगतान प्राप्त हुआ है।";
        String spokenEnglishText = "Aapko " + order.getBuyerName() + " se ₹" + amountVal + " ka pura bhugtan prapt hua hai.";

        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "PAYMENT_RECEIVED");
        payload.put("orderId", order.getId());
        payload.put("farmerId", order.getFarmerId());
        payload.put("buyerId", order.getBuyerId());
        payload.put("buyerName", order.getBuyerName());
        payload.put("amount", order.getTotalAmount());
        payload.put("paymentMethod", transaction.getPaymentMethod());
        payload.put("transactionId", transaction.getTransactionId());
        payload.put("spokenHindiText", spokenHindiText);
        payload.put("spokenEnglishText", spokenEnglishText);

        messagingTemplate.convertAndSend("/topic/farmer-deals/" + order.getFarmerId(), payload);
        messagingTemplate.convertAndSend("/topic/deals", payload);
    }

    public void sendProduceListingCreatedNotification(com.moolya.model.ProduceListing listing) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "PRODUCE_CREATED");
        payload.put("listingId", listing.getId());
        payload.put("farmerId", listing.getFarmerId());
        payload.put("farmerName", listing.getFarmerName());
        payload.put("cropName", listing.getCropName());
        payload.put("createdAt", listing.getCreatedAt());

        messagingTemplate.convertAndSend("/topic/produce-updates", payload);
    }
}
