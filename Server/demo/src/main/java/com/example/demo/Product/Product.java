package com.example.demo.Product;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType; 

import com.example.demo.Variants.Variants;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column( nullable = false , unique = true )
    private String name ;

    @Column(columnDefinition = "int default 0")
    private int quantity ;

    @Column(nullable = false)
    private String category ;

    private String description ;
    private int heigh ;
    private int width ;
    private int depth ; 
    private int price ;


    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Variants> variants = new ArrayList<>();

    

    public Product () {} 

    public Product(Long id, String name, int quantity, String category, String description, int heigh, int width,
            int depth) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.category = category;
        this.description = description;
        this.heigh = heigh;
        this.width = width;
        this.depth = depth;
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

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getHeigh() {
        return heigh;
    }

    public void setHeigh(int heigh) {
        this.heigh = heigh;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getDepth() {
        return depth;
    }

    public void setDepth(int depth) {
        this.depth = depth;
    }

@OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
@com.fasterxml.jackson.annotation.JsonManagedReference
public List<Variants> getVariants() {
    return this.variants;
}

public void setVariants(List<Variants> variants) {
    this.variants = variants;
}

    

}
