package com.taskflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "relief_camps")
public class ReliefCamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String zone;

    @Column(nullable = false)
    private int capacity = 100;

    @Column(nullable = false)
    private int occupied = 0;

    public ReliefCamp() {
    }

    public ReliefCamp(String name, String zone, int capacity, int occupied) {
        this.name = name;
        this.zone = zone;
        this.capacity = capacity;
        this.occupied = occupied;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getOccupied() {
        return occupied;
    }

    public void setOccupied(int occupied) {
        this.occupied = occupied;
    }
}
