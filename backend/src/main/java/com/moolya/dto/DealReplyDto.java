package com.moolya.dto;

import jakarta.validation.constraints.NotBlank;

public class DealReplyDto {

    @NotBlank(message = "Order ID is required")
    private String orderId;

    private boolean accepted;

    private String expectedDeliveryDate;

    private String farmerVoiceNote;

    public DealReplyDto() {}

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public boolean isAccepted() { return accepted; }
    public void setAccepted(boolean accepted) { this.accepted = accepted; }

    public String getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(String expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }

    public String getFarmerVoiceNote() { return farmerVoiceNote; }
    public void setFarmerVoiceNote(String farmerVoiceNote) { this.farmerVoiceNote = farmerVoiceNote; }
}
