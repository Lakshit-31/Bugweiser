package com.moolya.service;

import com.moolya.model.Grade;
import com.moolya.model.ProduceListing;
import com.moolya.model.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MatchScoreService {

    public int calculateTrustMatchScore(ProduceListing listing, User buyer) {
        int score = 70; // Base trust score

        // Grade Bonus
        if (listing.getAssignedGrade() == Grade.GRADE_A) {
            score += 15;
        } else if (listing.getAssignedGrade() == Grade.GRADE_B) {
            score += 8;
        } else {
            score += 2;
        }

        // Location proximity bonus
        if (buyer != null && buyer.getLocation() != null && listing.getLocation() != null) {
            if (buyer.getLocation().getState() != null && 
                buyer.getLocation().getState().equalsIgnoreCase(listing.getLocation().getState())) {
                score += 10;
            }
            if (buyer.getLocation().getDistrict() != null && 
                buyer.getLocation().getDistrict().equalsIgnoreCase(listing.getLocation().getDistrict())) {
                score += 5;
            }
        } else {
            score += 5;
        }

        // Price competitiveness bonus
        if (listing.getPricePerQuintal() != null && listing.getPricePerQuintal() <= 3000) {
            score += 5;
        }

        return Math.min(100, Math.max(0, score));
    }

    public Map<String, Object> calculateNetEarningsBreakdown(ProduceListing listing) {
        double quantity = listing.getQuantityQuintals() != null ? listing.getQuantityQuintals() : 0.0;
        double price = listing.getPricePerQuintal() != null ? listing.getPricePerQuintal() : 0.0;
        double grossTotal = quantity * price;

        // Estimated transport cost: 4.5% of total value
        double transportCost = Math.round(grossTotal * 0.045 * 100.0) / 100.0;
        // Platform commission & transaction handling: 1.5%
        double platformFee = Math.round(grossTotal * 0.015 * 100.0) / 100.0;
        // Net profit for farmer
        double netProfit = Math.round((grossTotal - transportCost - platformFee) * 100.0) / 100.0;

        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("grossTotal", grossTotal);
        breakdown.put("estimatedTransportCost", transportCost);
        breakdown.put("platformFee", platformFee);
        breakdown.put("netFarmerEarnings", netProfit);
        return breakdown;
    }
}
