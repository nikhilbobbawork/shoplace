package com.shoplace.shoplace_backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoplace.shoplace_backend.dto.OrderRequest;
import com.shoplace.shoplace_backend.entity.Order;
import com.shoplace.shoplace_backend.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest) {
        System.out.println("=== INCOMING ORDER RECEIVED FROM Customer Name: " + orderRequest.getFullName() + " ===");
        Order savedOrder = orderService.saveOrder(orderRequest);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }
}