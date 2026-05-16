package com.example.demo.Media;

public class MediaCreateRequest {

    private Long variantId;
    private String staticImage;
    private String model3d ; 

    // Getters and Setters
    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }

    public String getStaticImage() { return staticImage; }
    public void setStaticImage(String staticImage) { this.staticImage = staticImage; }

    public String getModel3d() { return model3d; }
    public void setModel3d(String model3d) { this.model3d = model3d; }
}