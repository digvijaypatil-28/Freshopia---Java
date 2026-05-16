package com.freshopia.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Category {
    @JsonProperty("Fruits & Vegetables") FRUITS_VEGGIES("Fruits & Vegetables"),
    @JsonProperty("Drinks & Cold Brews") DRINKS_COLD_BREW("Drinks & Cold Brews"),
    @JsonProperty("Fruits & Nuts") FRUITS_NUTS("Fruits & Nuts"),
    @JsonProperty("Spices & Masalas") SPICES_MASALAS("Spices & Masalas"),
    @JsonProperty("Regional Classics") REGIONAL_CLASSICS("Regional Classics"),
    @JsonProperty("Pooja Essentials") POOJA_ESSENTIALS("Pooja Essentials");

    private final String value;

    Category(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}
