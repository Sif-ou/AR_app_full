package com.example.demo.Variants;



public class VariantCreateRequest {

    private Long productId;
    private Long colorId;
    private String name;
    private String sku;
    private int percentage;
    private int quantity;
    private String description;

    // Getters and Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getColorId() { return colorId; }
    public void setColorId(Long colorId) { this.colorId = colorId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public int getPercentage() { return percentage; }
    public void setPercentage(int percentage) { this.percentage = percentage; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}