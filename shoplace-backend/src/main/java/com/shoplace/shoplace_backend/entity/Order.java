package com.shoplace.shoplace_backend.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "customer_orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String address;
    private String city;
    private String zipCode;
    private Double totalPrice;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;

    // Getters, Setters, Constructors
    public Order() {}

    public Order(String fullName, String address, String city, String zipCode, Double totalPrice, List<OrderItem> items) {
        this.fullName = fullName;
        this.address = address;
        this.city = city;
        this.zipCode = zipCode;
        this.totalPrice = totalPrice;
        this.items = items;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getAddress() { return address; }
    public String getCity() { return city; }
    public String getZipCode() { return zipCode; }
    public Double getTotalPrice() { return totalPrice; }
    public List<OrderItem> getItems() { return items; }
}