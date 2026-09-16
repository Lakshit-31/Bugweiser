package com.moolya.service;

import com.moolya.dto.ProduceSearchResponse;
import com.moolya.dto.VoiceListingRequest;
import com.moolya.model.*;
import com.moolya.repository.ProduceListingRepository;
import com.moolya.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProduceService {

    private final ProduceListingRepository produceListingRepository;
    private final UserRepository userRepository;
    private final GradingService gradingService;
    private final MatchScoreService matchScoreService;
    private final NotificationService notificationService;

    public ProduceService(ProduceListingRepository produceListingRepository,
                          UserRepository userRepository,
                          GradingService gradingService,
                          MatchScoreService matchScoreService,
                          NotificationService notificationService) {
        this.produceListingRepository = produceListingRepository;
        this.userRepository = userRepository;
        this.gradingService = gradingService;
        this.matchScoreService = matchScoreService;
        this.notificationService = notificationService;
    }

    public ProduceListing createVoiceListing(VoiceListingRequest req) {
        if (req.getImageUrls() == null || req.getImageUrls().size() < 4) {
            throw new IllegalArgumentException("At least 4 produce photos are strictly required before submitting a listing.");
        }

        User farmer = null;
        if (req.getFarmerId() != null) {
            farmer = userRepository.findById(req.getFarmerId()).orElse(null);
        }

        ProduceListing listing = new ProduceListing();
        listing.setFarmerId(req.getFarmerId());
        listing.setFarmerName(farmer != null ? farmer.getFullName() : "Verified Farmer");
        listing.setFarmerPhone(farmer != null ? farmer.getPhone() : "");
        listing.setCropName(req.getCropName());
        
        String unit = req.getUnit() != null ? req.getUnit() : "QUINTAL";
        Double displayQty = req.getDisplayQuantity() != null ? req.getDisplayQuantity() : req.getQuantityQuintals();
        Double qtyQuintals = "KG".equalsIgnoreCase(unit) ? (displayQty != null ? displayQty / 100.0 : req.getQuantityQuintals()) : (displayQty != null ? displayQty : req.getQuantityQuintals());

        listing.setUnit(unit);
        listing.setDisplayQuantity(displayQty != null ? displayQty : qtyQuintals);
        listing.setQuantityQuintals(qtyQuintals);
        listing.setPricePerQuintal(req.getPricePerQuintal());
        listing.setPesticidesUsed(req.getPesticidesUsed());

        String cleanHarvestDate = LocalDateNowStr();
        if (req.getHarvestDate() != null && !req.getHarvestDate().trim().isEmpty()) {
            java.time.LocalDate parsedDate = GradingService.parseDateFlexible(req.getHarvestDate());
            if (parsedDate != null) {
                cleanHarvestDate = parsedDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
            } else {
                cleanHarvestDate = req.getHarvestDate().trim();
            }
        }
        listing.setHarvestDate(cleanHarvestDate);

        // Automatic Grade Assignment Engine
        Grade assignedGrade = gradingService.calculateGrade(req.getPesticidesUsed(), cleanHarvestDate);
        listing.setAssignedGrade(assignedGrade);

        listing.setImageUrls(req.getImageUrls());
        listing.setStatus(ListingStatus.AVAILABLE);

        Location loc = new Location();
        if (req.getDistrict() != null && req.getState() != null) {
            loc.setDistrict(req.getDistrict());
            loc.setState(req.getState());
        } else if (farmer != null && farmer.getLocation() != null) {
            loc = farmer.getLocation();
        } else {
            loc.setDistrict("Ludhiana");
            loc.setState("Punjab");
        }
        listing.setLocation(loc);
        listing.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        ProduceListing saved = produceListingRepository.save(listing);
        notificationService.sendProduceListingCreatedNotification(saved);
        return saved;
    }

    public List<ProduceSearchResponse> searchProduce(String cropName, Grade grade, String buyerId) {
        List<ProduceListing> listings;
        if (cropName != null && !cropName.trim().isEmpty()) {
            listings = produceListingRepository.findByCropNameContainingIgnoreCaseAndStatus(cropName.trim(), ListingStatus.AVAILABLE);
        } else {
            listings = produceListingRepository.findByStatus(ListingStatus.AVAILABLE);
        }

        if (grade != null) {
            listings = listings.stream()
                    .filter(l -> l.getAssignedGrade() == grade)
                    .collect(Collectors.toList());
        }

        User buyer = buyerId != null ? userRepository.findById(buyerId).orElse(null) : null;

        List<ProduceSearchResponse> responseList = new ArrayList<>();
        for (ProduceListing l : listings) {
            int matchScore = matchScoreService.calculateTrustMatchScore(l, buyer);
            var breakdown = matchScoreService.calculateNetEarningsBreakdown(l);
            responseList.add(new ProduceSearchResponse(l, matchScore, breakdown));
        }

        return responseList;
    }

    public List<ProduceListing> getFarmerListings(String farmerId) {
        return produceListingRepository.findByFarmerId(farmerId);
    }

    public ProduceListing getListingById(String id) {
        return produceListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produce listing not found with ID: " + id));
    }

    public void deleteListing(String id) {
        ProduceListing listing = getListingById(id);
        produceListingRepository.delete(listing);
    }

    private String LocalDateNowStr() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
    }
}
