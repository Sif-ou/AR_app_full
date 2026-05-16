package com.example.demo.Media;

import com.example.demo.Variants.Variants;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "medias")
public class Media {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne 
    @JoinColumn(name = "variant_id", referencedColumnName = "id" )
    private Variants variant ;

    @Column(nullable = false)
    private String static_image ;

    private String model_3d ;

    public Media(Long id, Variants variant, String static_image, String model_3d) {
        this.id = id;
        this.variant = variant;
        this.static_image = static_image;
        this.model_3d = model_3d;
    }

    public Media() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatic_image() {
        return static_image;
    }

    public void setStatic_image(String static_image) {
        this.static_image = static_image;
    }

    public String getModel_3d() {
        return model_3d;
    }

    public void setModel_3d(String model_3d) {
        this.model_3d = model_3d;
    }

    public Variants getVariant() {
        return variant;
    }

    public void setVariant(Variants variant) {
        this.variant = variant;
    }

}
