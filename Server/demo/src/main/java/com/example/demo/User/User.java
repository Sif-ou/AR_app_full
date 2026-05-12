package com.example.demo.User;
import com.example.demo.Role.Role;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "users") 
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

@ManyToOne 
@JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role_id ;

    private String username;
    private String password;
    private String email;
    private int phone_num;
    private String address;
    private boolean active;



public User() {}


    public User(boolean active, String address, String email, Long id, String password, int phone_num, Role role_id, String username) {
        this.active = active;
        this.address = address;
        this.email = email;
        this.id = id;
        this.password = password;
        this.phone_num = phone_num;
        this.role_id = role_id;
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Role getRole_id() {
        return this.role_id ;
    }

    public void setRole_id(Role role) {
    this.role_id = role;
    }
    
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getPhone_num() {
        return phone_num;
    }

    public void setPhone_num(int phone_num) {
        this.phone_num = phone_num;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    
}