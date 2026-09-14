package com.moolya.controller;

import com.moolya.dto.ProduceSearchResponse;
import com.moolya.dto.VoiceListingRequest;
import com.moolya.model.Grade;
import com.moolya.model.ProduceListing;
import com.moolya.service.ProduceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/produce")
@CrossOrigin(origins = "*")
public class ProduceController {

    private final ProduceService produceService;

    public ProduceController(ProduceService produceService) {
        this.produceService = produceService;
    }

    @PostMapping("/create-voice")
    public ResponseEntity<ProduceListing> createVoiceListing(@Valid @RequestBody VoiceListingRequest request) {
        ProduceListing listing = produceService.createVoiceListing(request);
        return ResponseEntity.ok(listing);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProduceSearchResponse>> searchProduce(
            @RequestParam(required = false) String cropName,
            @RequestParam(required = false) Grade grade,
            @RequestParam(required = false) String buyerId) {
        List<ProduceSearchResponse> results = produceService.searchProduce(cropName, grade, buyerId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<ProduceListing>> getFarmerListings(@PathVariable String farmerId) {
        List<ProduceListing> listings = produceService.getFarmerListings(farmerId);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduceListing> getListingById(@PathVariable String id) {
        ProduceListing listing = produceService.getListingById(id);
        return ResponseEntity.ok(listing);
    }
}
