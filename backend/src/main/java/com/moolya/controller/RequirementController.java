package com.moolya.controller;

import com.moolya.model.Location;
import com.moolya.model.Requirement;
import com.moolya.repository.RequirementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/v1/requirements")
@CrossOrigin(origins = "*")
public class RequirementController {

    private final RequirementRepository requirementRepository;

    public RequirementController(RequirementRepository requirementRepository) {
        this.requirementRepository = requirementRepository;
    }

    @PostMapping
    public ResponseEntity<Requirement> createRequirement(@RequestBody Requirement requirement) {
        if (requirement.getCreatedAt() == null) {
            requirement.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }
        Requirement saved = requirementRepository.save(requirement);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Requirement>> getAllRequirements() {
        return ResponseEntity.ok(requirementRepository.findAll());
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<Requirement>> getBuyerRequirements(@PathVariable String buyerId) {
        return ResponseEntity.ok(requirementRepository.findByBuyerId(buyerId));
    }
}
