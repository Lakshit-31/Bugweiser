package com.moolya.dto;

import com.moolya.model.ProduceListing;
import java.util.Map;

public class ProduceSearchResponse {
    private ProduceListing listing;
    private int buyerTrustMatchScore;
    private Map<String, Object> netEarningsBreakdown;

    public ProduceSearchResponse(ProduceListing listing, int buyerTrustMatchScore, Map<String, Object> netEarningsBreakdown) {
        this.listing = listing;
        this.buyerTrustMatchScore = buyerTrustMatchScore;
        this.netEarningsBreakdown = netEarningsBreakdown;
    }

    public ProduceListing getListing() { return listing; }
    public void setListing(ProduceListing listing) { this.listing = listing; }

    public int getBuyerTrustMatchScore() { return buyerTrustMatchScore; }
    public void setBuyerTrustMatchScore(int buyerTrustMatchScore) { this.buyerTrustMatchScore = buyerTrustMatchScore; }

    public Map<String, Object> getNetEarningsBreakdown() { return netEarningsBreakdown; }
    public void setNetEarningsBreakdown(Map<String, Object> netEarningsBreakdown) { this.netEarningsBreakdown = netEarningsBreakdown; }
}
