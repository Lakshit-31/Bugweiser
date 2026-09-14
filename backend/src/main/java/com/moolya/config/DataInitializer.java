package com.moolya.config;

import com.moolya.model.*;
import com.moolya.repository.ProduceListingRepository;
import com.moolya.repository.UserRepository;
import com.moolya.service.AadhaarEncryptionService;
import com.moolya.service.GradingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProduceListingRepository produceListingRepository;
    private final PasswordEncoder passwordEncoder;
    private final AadhaarEncryptionService aadhaarEncryptionService;
    private final GradingService gradingService;

    public DataInitializer(UserRepository userRepository,
                           ProduceListingRepository produceListingRepository,
                           PasswordEncoder passwordEncoder,
                           AadhaarEncryptionService aadhaarEncryptionService,
                           GradingService gradingService) {
        this.userRepository = userRepository;
        this.produceListingRepository = produceListingRepository;
        this.passwordEncoder = passwordEncoder;
        this.aadhaarEncryptionService = aadhaarEncryptionService;
        this.gradingService = gradingService;
    }

    @Override
    public void run(String... args) {
        // Reset old data to guarantee clean UTF-8 strings
        produceListingRepository.deleteAll();
        userRepository.deleteAll();

        // Create Default Farmer
        User farmer = new User();
        farmer.setFullName("Ramesh Kumar");
        farmer.setPhone("9876543210");
        farmer.setPassword(passwordEncoder.encode("password123"));
        farmer.setAadhaar(aadhaarEncryptionService.encryptAadhaarAES("123456789012"));
        farmer.setRole(Role.ROLE_FARMER);
        farmer.setPreferredLanguage("hi");
        farmer.setLocation(new Location("Ludhiana", "Punjab"));
        User savedFarmer = userRepository.save(farmer);

        // Create Default Buyer
        User buyer = new User();
        buyer.setFullName("Priya Sharma");
        buyer.setPhone("9123456789");
        buyer.setEmail("priya@agrocorp.com");
        buyer.setPassword(passwordEncoder.encode("password123"));
        buyer.setRole(Role.ROLE_BUYER);
        buyer.setBuyerType(BuyerType.BUSINESS);
        buyer.setBusinessName("AgroCorp Food Procurements");
        buyer.setGstId("07AAAAA0000A1Z5");
        buyer.setPreferredLanguage("hi");
        buyer.setLocation(new Location("New Delhi", "Delhi"));
        userRepository.save(buyer);

        // Seed Initial Produce Listings
        createSampleListing(savedFarmer, "Wheat (गेहूँ)", 50.0, 2200.0, "Organic Neem Oil",
                LocalDate.now().minusDays(3).toString(),
                List.of(
                        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600",
                        "https://images.unsplash.com/photo-1535242208474-9a279b23b514?w=600",
                        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
                        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600"
                ));

        createSampleListing(savedFarmer, "Basmati Rice (बासमती चावल)", 100.0, 3500.0, "Regulated Bio-spray",
                LocalDate.now().minusDays(10).toString(),
                List.of(
                        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600",
                        "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600",
                        "https://images.unsplash.com/photo-1568261678596-578ad772d698?w=600",
                        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600"
                ));

        createSampleListing(savedFarmer, "Mustard Seeds (सरसों)", 30.0, 4800.0, "Zero Chemical Organic",
                LocalDate.now().minusDays(2).toString(),
                List.of(
                        "https://images.unsplash.com/photo-1508747703725-719777637510?w=600",
                        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600",
                        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600",
                        "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600"
                ));

        createSampleListing(savedFarmer, "Potato (आलू)", 80.0, 1200.0, "Standard Fungicide Spray",
                LocalDate.now().minusDays(25).toString(),
                List.of(
                        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600",
                        "https://images.unsplash.com/photo-1508747703725-719777637510?w=600",
                        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600",
                        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600"
                ));
    }

    private void createSampleListing(User farmer, String cropName, Double qty, Double price, String pesticides, String harvestDate, List<String> images) {
        ProduceListing listing = new ProduceListing();
        listing.setFarmerId(farmer.getId());
        listing.setFarmerName(farmer.getFullName());
        listing.setFarmerPhone(farmer.getPhone());
        listing.setCropName(cropName);
        listing.setQuantityQuintals(qty);
        listing.setPricePerQuintal(price);
        listing.setPesticidesUsed(pesticides);
        listing.setHarvestDate(harvestDate);
        listing.setAssignedGrade(gradingService.calculateGrade(pesticides, harvestDate));
        listing.setImageUrls(images);
        listing.setStatus(ListingStatus.AVAILABLE);
        listing.setLocation(farmer.getLocation());
        listing.setCreatedAt(LocalDate.now().toString());
        produceListingRepository.save(listing);
    }
}
