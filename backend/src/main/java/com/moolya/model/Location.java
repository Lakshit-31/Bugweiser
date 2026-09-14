package com.moolya.model;

public class Location {
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;

    public Location() {}

    public Location(String district, String state) {
        this.district = district;
        this.state = state;
    }

    public Location(String district, String state, Double latitude, Double longitude) {
        this.district = district;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
