package com.moolya.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "produce_listings")
public class ProduceListing {
    @Id
    private String id;
    
    private String farmerId;
    private String farmerName;
    private String farmerPhone;
    
    private String cropName;
    private Double quantityQuintals;
    private Double pricePerQuintal;
    private String unit = "QUINTAL"; // QUINTAL or KG
    private Double displayQuantity;
    private String pesticidesUsed;
    private String harvestDate;

    private Grade assignedGrade;
    private List<String> imageUrls = new ArrayList<>();
    private ListingStatus status = ListingStatus.AVAILABLE;
    
    private Location location;
    private String createdAt;

    public ProduceListing() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

    public String getFarmerPhone() { return farmerPhone; }
    public void setFarmerPhone(String farmerPhone) { this.farmerPhone = farmerPhone; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public Double getQuantityQuintals() { return quantityQuintals; }
    public void setQuantityQuintals(Double quantityQuintals) { this.quantityQuintals = quantityQuintals; }

    public Double getPricePerQuintal() { return pricePerQuintal; }
    public void setPricePerQuintal(Double pricePerQuintal) { this.pricePerQuintal = pricePerQuintal; }

    public String getUnit() { return unit != null ? unit : "QUINTAL"; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getDisplayQuantity() { return displayQuantity != null ? displayQuantity : quantityQuintals; }
    public void setDisplayQuantity(Double displayQuantity) { this.displayQuantity = displayQuantity; }

    public String getPesticidesUsed() { return pesticidesUsed; }
    public void setPesticidesUsed(String pesticidesUsed) { this.pesticidesUsed = pesticidesUsed; }

    public String getHarvestDate() { return harvestDate; }
    public void setHarvestDate(String harvestDate) { this.harvestDate = harvestDate; }

    public Grade getAssignedGrade() { return assignedGrade; }
    public void setAssignedGrade(Grade assignedGrade) { this.assignedGrade = assignedGrade; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
