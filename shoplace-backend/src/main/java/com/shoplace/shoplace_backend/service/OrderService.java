package com.shoplace.shoplace_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shoplace.shoplace_backend.dto.OrderItemRequest;
import com.shoplace.shoplace_backend.dto.OrderRequest;
import com.shoplace.shoplace_backend.entity.Order;
import com.shoplace.shoplace_backend.entity.Product;
import com.shoplace.shoplace_backend.repository.OrderRepository;
import com.shoplace.shoplace_backend.repository.ProductRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order saveOrder(OrderRequest dto) {
        // 1. Validate and update product stock quantities
        for (OrderItemRequest itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + itemDto.getProductId()));

            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Deduct stock quantity
            product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            productRepository.save(product);
        }

        // 2. Map DTO to Entity and save order
        Order order = new Order();
        order.setFullName(dto.getFullName());
        order.setAddress(dto.getAddress());
        order.setCity(dto.getCity());
        order.setZipCode(dto.getZipCode());
        order.setTotalPrice(dto.getTotalPrice());

        // Map items if your entity requires them
        // (Assuming your Order entity has a setter for items or uses a helper method)
        return orderRepository.save(order);
    }
}
