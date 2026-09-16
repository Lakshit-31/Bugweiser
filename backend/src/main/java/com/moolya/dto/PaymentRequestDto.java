package com.moolya.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PaymentRequestDto {
    @NotBlank(message = "Order ID is required")
    private String orderId;

    @NotBlank(message = "Buyer ID is required")
    private String buyerId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // CARD, UPI

    private String cardNumber;
    private String upiId;

    @NotNull(message = "Amount is required")
    private Double amount;

    public PaymentRequestDto() {}

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String buyerId) { this.buyerId = buyerId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}
