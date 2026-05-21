package com.example.demo.Product;

import java.util.List;
import java.util.Optional;

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

public List<Product> getAllProducts() {
        return productRepository.findAll();
    }


/**
 * NEW: Deletes a product from the database by ID.
 */
public void deleteProduct(Long id) {
    if (!productRepository.existsById(id)) {
        throw new IllegalArgumentException("Product with ID " + id + " does not exist.");
    }
    productRepository.deleteById(id);
}


public Optional<Product> findById(Long id) {
    if (!productRepository.existsById(id)) {
        throw new IllegalArgumentException("Product with ID " + id + " does not exist.");
    }
    return productRepository.findById(id) ;
}


}