package com.shoplace.shoplace_backend.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.shoplace.shoplace_backend.entity.Product;
import com.shoplace.shoplace_backend.repository.ProductRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            List<Product> initialProducts = List.of(
                new Product(
                    "Wireless Mechanical Keyboard",
                    "Compact 75% layout mechanical keyboard with hot-swappable tactile switches and RGB backlighting.",
                    new BigDecimal("89.99"),
                    25,
                    "Electronics",
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"
                ),
                new Product(
                    "Ergonomic Mesh Office Chair",
                    "Breathable mesh back desk chair with adjustable lumbar support and 3D armrests.",
                    new BigDecimal("199.50"),
                    12,
                    "Furniture",
                    "https://images.unsplash.com/photo-1580481072645-022f9a6d1205?w=600"
                ),
                new Product(
                    "Noise Cancelling Headphones",
                    "Over-ear wireless headphones with active noise cancellation and up to 30 hours of battery life.",
                    new BigDecimal("149.99"),
                    18,
                    "Electronics",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
                ),
                new Product(
                    "Minimalist Leather Backpack",
                    "Durable water-resistant faux leather backpack with a padded 15-inch laptop compartment.",
                    new BigDecimal("64.95"),
                    30,
                    "Accessories",
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
                )
            );

            productRepository.saveAll(initialProducts);
            System.out.println("DataSeeder: Initial sample products seeded successfully into SQLite.");
        } else {
            System.out.println("DataSeeder: Database already contains products. Skipping seeding.");
        }
    }
}