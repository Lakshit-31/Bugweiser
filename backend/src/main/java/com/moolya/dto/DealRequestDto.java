package com.moolya.dto;

import jakarta.validation.constraints.NotBlank;

public class DealRequestDto {

    @NotBlank(message = "Listing ID is required")
    private String listingId;

    @NotBlank(message = "Buyer ID is required")
    private String buyerId;

    private Double quantityQuintals;
    private String unit = "QUINTAL";
    private Double displayQuantity;
    private String requestedDeliveryDate;

    public DealRequestDto() {}

    public String getListingId() { return listingId; }
    public void setListingId(String listingId) { this.listingId = listingId; }

    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String buyerId) { this.buyerId = buyerId; }

    public Double getQuantityQuintals() { return quantityQuintals; }
    public void setQuantityQuintals(Double quantityQuintals) { this.quantityQuintals = quantityQuintals; }

    public String getUnit() { return unit != null ? unit : "QUINTAL"; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getDisplayQuantity() { return displayQuantity; }
    public void setDisplayQuantity(Double displayQuantity) { this.displayQuantity = displayQuantity; }

    public String getRequestedDeliveryDate() { return requestedDeliveryDate; }
    public void setRequestedDeliveryDate(String requestedDeliveryDate) { this.requestedDeliveryDate = requestedDeliveryDate; }
}
