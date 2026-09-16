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
                LocalDate harvestDate = parseDateFlexible(harvestDateStr.trim());
                if (harvestDate != null) {
                    daysSinceHarvest = ChronoUnit.DAYS.between(harvestDate, LocalDate.now());
                } else {
                    daysSinceHarvest = 5;
                }
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

    public static LocalDate parseDateFlexible(String str) {
        if (str == null || str.trim().isEmpty()) return null;
        String s = str.trim().toLowerCase();

        // 1. Direct ISO parse
        try {
            return LocalDate.parse(s, DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (Exception ignored) {}

        // 2. Normalize spoken Hindi/Hinglish month typos & filler words
        s = s.replaceAll("(?i)\\b(tarikh|tareekh|tariq|tikh|तारीख|ko|को|kaati|काटी|kaata|काटा|thi|था|san|saal|sal|year|month|date|harvested|on)\\b", " ")
             .replaceAll("(?i)\\b(setember|setamber|setambar|sitember|sitamber|sitambar|sitambhar|सितंबर|सितम्बर|सितं)\\b", "september")
             .replaceAll("(?i)\\b(janwari|janvri|जनवरी)\\b", "january")
             .replaceAll("(?i)\\b(febwari|farvari|फरवरी|फ़रवरी)\\b", "february")
             .replaceAll("(?i)\\b(maarch|मार्च)\\b", "march")
             .replaceAll("(?i)\\b(aprel|epral|अप्रैल|अप्रेल)\\b", "april")
             .replaceAll("(?i)\\b(mai|मई)\\b", "may")
             .replaceAll("(?i)\\b(जून)\\b", "june")
             .replaceAll("(?i)\\b(julai|जुलाई)\\b", "july")
             .replaceAll("(?i)\\b(agast|अगस्त)\\b", "august")
             .replaceAll("(?i)\\b(aktubar|aktuabar|अक्टूबर)\\b", "october")
             .replaceAll("(?i)\\b(navambar|navamber|नवंबर|नवम्बर)\\b", "november")
             .replaceAll("(?i)\\b(disambar|disamber|दिसंबर|दिसम्बर)\\b", "december")
             .replaceAll("(\\d+)(st|nd|rd|th)", "$1")
             .replaceAll("\\s+", " ")
             .trim();

        String[] patterns = {
            "yyyy-MM-dd", "dd-MM-yyyy", "dd/MM/yyyy", "d/M/yyyy", "d-M-yyyy", "d.M.yyyy",
            "d MMMM yyyy", "dd MMMM yyyy", "MMMM d yyyy", "MMMM dd yyyy",
            "d MMM yyyy", "dd MMM yyyy", "yyyy/MM/dd"
        };
        for (String pattern : patterns) {
            try {
                return LocalDate.parse(s, DateTimeFormatter.ofPattern(pattern, java.util.Locale.ENGLISH));
            } catch (Exception ignored) {}
        }

        // If no year present in phrase (e.g. "15 september"), append current year
        if (!s.matches(".*\\d{4}.*")) {
            int currentYear = LocalDate.now().getYear();
            String sWithYear = s + " " + currentYear;
            for (String pattern : new String[]{"d MMMM yyyy", "dd MMMM yyyy", "MMMM d yyyy", "MMMM dd yyyy", "d MMM yyyy", "dd MMM yyyy"}) {
                try {
                    return LocalDate.parse(sWithYear, DateTimeFormatter.ofPattern(pattern, java.util.Locale.ENGLISH));
                } catch (Exception ignored) {}
            }
        }

        return null;
    }
}
