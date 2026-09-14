package com.moolya.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "requirements")
public class Requirement {
    @Id
    private String id;
    
    private String buyerId;
    private String buyerName;
    private String buyerPhone;
    
    private String cropName;
    private Double quantityQuintals;
    private String desiredGrade;
    private Location location;
    private String rawVoicePrompt;
    private String createdAt;

    public Requirement() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerPhone() { return buyerPhone; }
    public void setBuyerPhone(String buyerPhone) { this.buyerPhone = buyerPhone; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public Double getQuantityQuintals() { return quantityQuintals; }
    public void setQuantityQuintals(Double quantityQuintals) { this.quantityQuintals = quantityQuintals; }

    public String getDesiredGrade() { return desiredGrade; }
    public void setDesiredGrade(String desiredGrade) { this.desiredGrade = desiredGrade; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public String getRawVoicePrompt() { return rawVoicePrompt; }
    public void setRawVoicePrompt(String rawVoicePrompt) { this.rawVoicePrompt = rawVoicePrompt; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
