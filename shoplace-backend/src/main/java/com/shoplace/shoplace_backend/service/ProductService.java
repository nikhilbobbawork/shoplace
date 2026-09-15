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
        Product product = new Product(
            request.name(),
            request.description(),
            request.price(),
            request.stockQuantity(),
            request.category(),
            request.imageUrl()
        );
        return productRepository.save(product);
    }

    public List<Product> getAllProducts(String category) {
        if (category != null && !category.isBlank()) {
            return productRepository.findByCategoryIgnoreCase(category);
        }
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}