package com.moolya.service;

import com.moolya.model.Order;
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
        // Spoken Hindi TTS phrase: "[Buyer Name] को आपका [Crop Name] चाहिए।"
        String spokenHindiText = order.getBuyerName() + " को आपका " + order.getCropName() + " चाहिए।";
        String spokenEnglishText = order.getBuyerName() + " wants your " + order.getCropName() + ".";

        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "DEAL_REQUEST");
        payload.put("orderId", order.getId());
        payload.put("listingId", order.getListingId());
        payload.put("buyerId", order.getBuyerId());
        payload.put("buyerName", order.getBuyerName());
        payload.put("cropName", order.getCropName());
        payload.put("quantityQuintals", order.getQuantityQuintals());
        payload.put("totalAmount", order.getTotalAmount());
        payload.put("spokenHindiText", spokenHindiText);
        payload.put("spokenEnglishText", spokenEnglishText);
        payload.put("createdAt", order.getCreatedAt());

        // Broadcast to specific farmer topic & general deals topic
        messagingTemplate.convertAndSend("/topic/farmer-deals/" + order.getFarmerId(), payload);
        messagingTemplate.convertAndSend("/topic/deals", payload);
    }

    public void sendDealReplyNotificationToBuyer(Order order) {
        String spokenHindiText = order.getFarmerName() + " ने आपका ऑर्डर स्वीकार कर लिया है। संभावित डिलीवरी की तारीख: " + 
                (order.getExpectedDeliveryDate() != null ? order.getExpectedDeliveryDate() : "जल्द ही") + "।";
        String spokenEnglishText = order.getFarmerName() + " accepted your deal. Expected Delivery: " + 
                (order.getExpectedDeliveryDate() != null ? order.getExpectedDeliveryDate() : "Soon") + ".";

        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "DEAL_REPLY");
        payload.put("orderId", order.getId());
        payload.put("farmerId", order.getFarmerId());
        payload.put("farmerName", order.getFarmerName());
        payload.put("status", order.getStatus().name());
        payload.put("expectedDeliveryDate", order.getExpectedDeliveryDate());
        payload.put("farmerVoiceNote", order.getFarmerVoiceNote());
        payload.put("spokenHindiText", spokenHindiText);
        payload.put("spokenEnglishText", spokenEnglishText);

        messagingTemplate.convertAndSend("/topic/buyer-updates/" + order.getBuyerId(), payload);
        messagingTemplate.convertAndSend("/topic/deals", payload);
    }
}
