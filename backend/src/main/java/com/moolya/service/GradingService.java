package com.moolya.service;

import com.moolya.model.Grade;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class GradingService {

    public Grade calculateGrade(String pesticidesUsed, String harvestDateStr) {
        if (pesticidesUsed == null) pesticidesUsed = "";
        String pLower = pesticidesUsed.toLowerCase();

        boolean isOrganicOrZero = pLower.contains("organic") || pLower.contains("neem") || 
                                  pLower.contains("zero") || pLower.contains("none") || 
                                  pLower.contains("no chemical") || pLower.contains("जैविक") || 
                                  pLower.contains("नीम");

        boolean isHeavyChemical = pLower.contains("heavy") || pLower.contains("chemical") || 
                                  pLower.contains("high") || pLower.contains("sulfur") || 
                                  pLower.contains("strong") || pLower.contains("2,4-d") ||
                                  pLower.contains("कीटनाशक");

        long daysSinceHarvest = 0;
        try {
            if (harvestDateStr != null && !harvestDateStr.trim().isEmpty()) {
                LocalDate harvestDate = LocalDate.parse(harvestDateStr.trim(), DateTimeFormatter.ISO_DATE);
                daysSinceHarvest = ChronoUnit.DAYS.between(harvestDate, LocalDate.now());
            }
        } catch (Exception e) {
            daysSinceHarvest = 5; // Default fallback
        }

        // Logic Rule:
        // Grade A: Zero / minimal organic pesticides, fresh harvest (<= 15 days)
        // Grade B: Standard regulated pesticide usage, recent harvest (16 - 45 days)
        // Grade C: Higher chemical treatment or stored produce (> 45 days)
        if (isOrganicOrZero && daysSinceHarvest <= 20) {
            return Grade.GRADE_A;
        } else if (!isHeavyChemical && daysSinceHarvest <= 45) {
            return Grade.GRADE_B;
        } else {
            return Grade.GRADE_C;
        }
    }
}
