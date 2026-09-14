package com.moolya.dto;

import jakarta.validation.constraints.NotBlank;

public class DealRequestDto {

    @NotBlank(message = "Listing ID is required")
    private String listingId;

    @NotBlank(message = "Buyer ID is required")
    private String buyerId;

    private Double quantityQuintals;

    public DealRequestDto() {}

    public String getListingId() { return listingId; }
    public void setListingId(String listingId) { this.listingId = listingId; }

    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String buyerId) { this.buyerId = buyerId; }

    public Double getQuantityQuintals() { return quantityQuintals; }
    public void setQuantityQuintals(Double quantityQuintals) { this.quantityQuintals = quantityQuintals; }
}
