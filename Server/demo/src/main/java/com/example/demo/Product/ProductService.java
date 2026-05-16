package com.example.demo.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Saves a new product to the database.
     */
    public Product saveProduct(Product product) {
        // Business logic or extra validation can go here
        if (product.getName() == null || product.getName().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        if (product.getCategory() == null || product.getCategory().isEmpty()) {
            throw new IllegalArgumentException("Product category cannot be empty");
        }
        
        return productRepository.save(product);
    }
}