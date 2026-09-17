package com.shoplace.shoplace_backend.service;

import org.springframework.stereotype.Service;

import com.shoplace.shoplace_backend.entity.Order;
import com.shoplace.shoplace_backend.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
}