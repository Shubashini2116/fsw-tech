package com.taskflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "volunteers")
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String skill;

    @Column(length = 100)
    private String zone;

    @Column(nullable = false, length = 30)
    private String status = "available";

    @Column(length = 50)
    private String phone;

    public Volunteer() {
    }

    public Volunteer(String name, String skill, String zone, String status) {
        this.name = name;
        this.skill = skill;
        this.zone = zone;
        this.status = status != null ? status : "available";
    }

    public Volunteer(String name, String skill, String zone, String status, String phone) {
        this.name = name;
        this.skill = skill;
        this.zone = zone;
        this.status = status != null ? status : "available";
        this.phone = phone;
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

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
