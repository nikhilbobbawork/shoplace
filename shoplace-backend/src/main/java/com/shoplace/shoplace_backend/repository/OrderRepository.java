package com.shoplace.shoplace_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoplace.shoplace_backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}