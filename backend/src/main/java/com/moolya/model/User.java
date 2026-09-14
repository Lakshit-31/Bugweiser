package com.moolya.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String fullName;
    
    @Indexed(unique = true)
    private String phone;
    
    private String email;
    
    private String aadhaar; // Encrypted / Hashed
    
    private String password; // BCrypt Hashed
    
    private Role role;
    
    private BuyerType buyerType; // Optional for buyers
    
    private String businessName;
    
    private String gstId;
    
    private String preferredLanguage = "hi";
    
    private Location location;

    public User() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAadhaar() { return aadhaar; }
    public void setAadhaar(String aadhaar) { this.aadhaar = aadhaar; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public BuyerType getBuyerType() { return buyerType; }
    public void setBuyerType(BuyerType buyerType) { this.buyerType = buyerType; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getGstId() { return gstId; }
    public void setGstId(String gstId) { this.gstId = gstId; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
}
