package com.example.demo.Variants;

import com.example.demo.Color.Color;
import com.example.demo.Product.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "variants")
public class Variants {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne 
    @JoinColumn(name = "product_id", referencedColumnName = "id" )
    private Product product ;

    @ManyToOne 
    @JoinColumn(name = "color_id", referencedColumnName = "id" )
    private Color color_id ;



    @Column(nullable = false)
    private String name ;
    
    @Column(nullable = false)
    private String sku ;

    @Column(columnDefinition = "int default 0")
    private int percentage ;
    @Column(nullable = false)
    private int quantity ;


    public Variants(Long id, Product product, Color color_id, String name, String sku , int percentage , int quantity) {
        this.id = id;
        this.product = product;
        this.color_id = color_id;
        this.name = name;
        this.sku = sku;
        this.percentage = percentage;
        this.quantity = quantity;
    }

    public Variants() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct_id() {
        return product;
    }

    public void setProduct_id(Product product) {
        this.product = product;
    }

    public Color getColor_id() {
        return color_id;
    }

    public void setColor_id(Color color_id) {
        this.color_id = color_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }



}
