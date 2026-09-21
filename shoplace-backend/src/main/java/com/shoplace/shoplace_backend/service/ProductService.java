package com.shoplace.shoplace_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shoplace.shoplace_backend.dto.ProductRequest;
import com.shoplace.shoplace_backend.entity.Product;
import com.shoplace.shoplace_backend.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStockQuantity(request.stockQuantity());
        product.setCategory(request.category());
        product.setImageUrl(request.imageUrl());

        return productRepository.save(product);
    }

    public List<Product> getAllProducts(String search, String category) {
        if (search != null && !search.trim().isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search.trim());
        }

        if (category != null && !category.trim().isEmpty()) {
            return productRepository.findByCategoryIgnoreCase(category.trim());
        }

        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }
}