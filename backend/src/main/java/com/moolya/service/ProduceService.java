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

    public ProduceService(ProduceListingRepository produceListingRepository,
                          UserRepository userRepository,
                          GradingService gradingService,
                          MatchScoreService matchScoreService) {
        this.produceListingRepository = produceListingRepository;
        this.userRepository = userRepository;
        this.gradingService = gradingService;
        this.matchScoreService = matchScoreService;
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
        listing.setFarmerName(farmer != null ? farmer.getFullName() : "Ramesh Kumar");
        listing.setFarmerPhone(farmer != null ? farmer.getPhone() : "9876543210");
        listing.setCropName(req.getCropName());
        listing.setQuantityQuintals(req.getQuantityQuintals());
        listing.setPricePerQuintal(req.getPricePerQuintal());
        listing.setPesticidesUsed(req.getPesticidesUsed());
        listing.setHarvestDate(req.getHarvestDate() != null ? req.getHarvestDate() : LocalDateNowStr());

        // Automatic Grade Assignment Engine
        Grade assignedGrade = gradingService.calculateGrade(req.getPesticidesUsed(), req.getHarvestDate());
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

        return produceListingRepository.save(listing);
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

    private String LocalDateNowStr() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
    }
}
