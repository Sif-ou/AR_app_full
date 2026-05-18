package com.example.demo.Variants;

import com.example.demo.Color.Color;
import com.example.demo.Color.ColorRepository;
import com.example.demo.Product.Product;
import com.example.demo.Product.ProductRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class VariantsService {

    private final VariantsRepository variantsRepository;
    private final ProductRepository productRepository;
    private final ColorRepository colorRepository;

    public VariantsService(VariantsRepository variantsRepository, 
                           ProductRepository productRepository, 
                           ColorRepository colorRepository) {
        this.variantsRepository = variantsRepository;
        this.productRepository = productRepository;
        this.colorRepository = colorRepository;
    }

    public Variants createVariant(VariantCreateRequest request) {
        // 1. Manual Validation: Check for nulls or empty strings
        if (request.getProductId() == null) {
            throw new IllegalArgumentException("Product is mandatory. Please select a product.");
        }
        if (request.getColorId() == null) {
            throw new IllegalArgumentException("Color is mandatory. Please select a color.");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Variant name is mandatory.");
        }
        if (request.getSku() == null || request.getSku().trim().isEmpty()) {
            throw new IllegalArgumentException("SKU is mandatory.");
        }
        if (request.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative.");
        }

        // 2. Database lookups
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + request.getProductId()));

        Color color = colorRepository.findById(request.getColorId())
                .orElseThrow(() -> new IllegalArgumentException("Color not found with ID: " + request.getColorId()));

        // 3. Mapping and Saving
        Variants variant = new Variants();
        variant.setProduct_id(product);
        variant.setColor_id(color);
        variant.setName(request.getName());
        variant.setSku(request.getSku());
        variant.setPercentage(request.getPercentage());
        variant.setQuantity(request.getQuantity());
        variant.setDescription(request.getDescription());

        return variantsRepository.save(variant);
    }


public List<Variants> getAllVariants() {
        return variantsRepository.findAll();
    }

    /**
     * Hard deletes a single variant by ID, cascading removal to its linked media entries.
     */
    public void deleteVariant(Long id) {
        if (!variantsRepository.existsById(id)) {
            throw new IllegalArgumentException("Variant with ID " + id + " does not exist.");
        }
        variantsRepository.deleteById(id);
    }



}