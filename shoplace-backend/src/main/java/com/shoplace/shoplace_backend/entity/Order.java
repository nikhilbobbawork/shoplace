package com.shoplace.shoplace_backend.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

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
    public Order() {
    }

    public Order(String fullName, String address, String city, String zipCode, Double totalPrice, List<OrderItem> items) {
        this.fullName = fullName;
        this.address = address;
        this.city = city;
        this.zipCode = zipCode;
        this.totalPrice = totalPrice;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

}
