package com.shoplace.shoplace_backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductRequest(
        @NotBlank(message = "Product name is required")
        String name,
        @NotBlank(message = "Description is required")
        String description,
        @NotNull(message = "Price is required")
        @Min(value = 0, message = "Price must be positive")
        BigDecimal price,
        @NotNull(message = "Stock quantity is required")
        @Min(value = 0, message = "Stock quantity cannot be negative")
        Integer stockQuantity,
        @NotBlank(message = "Category is required")
        String category,
        @NotBlank(message = "Image URL is required")
        String imageUrl
        ) {

}