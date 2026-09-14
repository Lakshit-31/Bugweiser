package com.moolya.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    
    private String listingId;
    private String cropName;
    private Double quantityQuintals;
    private Double totalAmount;
    
    private String buyerId;
    private String buyerName;
    private String buyerPhone;
    
    private String farmerId;
    private String farmerName;
    private String farmerPhone;
    
    private OrderStatus status = OrderStatus.REQUESTED;
    private String expectedDeliveryDate;
    private String farmerVoiceNote;
    
    private String createdAt;
    private String updatedAt;

    public Order() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getListingId() { return listingId; }
    public void setListingId(String listingId) { this.listingId = listingId; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public Double getQuantityQuintals() { return quantityQuintals; }
    public void setQuantityQuintals(Double quantityQuintals) { this.quantityQuintals = quantityQuintals; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerPhone() { return buyerPhone; }
    public void setBuyerPhone(String buyerPhone) { this.buyerPhone = buyerPhone; }

    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

    public String getFarmerPhone() { return farmerPhone; }
    public void setFarmerPhone(String farmerPhone) { this.farmerPhone = farmerPhone; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(String expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }

    public String getFarmerVoiceNote() { return farmerVoiceNote; }
    public void setFarmerVoiceNote(String farmerVoiceNote) { this.farmerVoiceNote = farmerVoiceNote; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
