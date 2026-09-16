package com.moolya.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class VoiceListingRequest {

    private String farmerId;

    @NotBlank(message = "Crop name is required")
    private String cropName;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be positive")
    private Double quantityQuintals;

    @NotNull(message = "Price is required")
    private Double pricePerQuintal;

    private String unit = "QUINTAL";
    private Double displayQuantity;

    private String pesticidesUsed;
    private String harvestDate;

    private String district;
    private String state;

    @NotNull(message = "Produce photos are mandatory")
    private List<String> imageUrls;

    public VoiceListingRequest() {}

    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public Double getQuantityQuintals() { return quantityQuintals; }
    public void setQuantityQuintals(Double quantityQuintals) { this.quantityQuintals = quantityQuintals; }

    public Double getPricePerQuintal() { return pricePerQuintal; }
    public void setPricePerQuintal(Double pricePerQuintal) { this.pricePerQuintal = pricePerQuintal; }

    public String getUnit() { return unit != null ? unit : "QUINTAL"; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getDisplayQuantity() { return displayQuantity; }
    public void setDisplayQuantity(Double displayQuantity) { this.displayQuantity = displayQuantity; }

    public String getPesticidesUsed() { return pesticidesUsed; }
    public void setPesticidesUsed(String pesticidesUsed) { this.pesticidesUsed = pesticidesUsed; }

    public String getHarvestDate() { return harvestDate; }
    public void setHarvestDate(String harvestDate) { this.harvestDate = harvestDate; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
