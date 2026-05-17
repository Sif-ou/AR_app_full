package com.example.demo.Color;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ColorService {
 
    private final ColorRepository colorRepository;

    @Autowired
    public ColorService(ColorRepository colorRepository) {
        this.colorRepository = colorRepository;
    }

    public Color saveColor(Color color) {
        // 1. Basic Validation
        if (color.getName() == null || color.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Color name cannot be empty");
        }
        if (color.getHexCode() == null || color.getHexCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Color hex code cannot be empty");
        }
        
        // 2. Business Logic Validation (Using your repository methods!)
        if (colorRepository.findByName(color.getName()).isPresent()) {
            throw new IllegalStateException("A color with this name already exists");
        }
        if (colorRepository.findByHexCode(color.getHexCode()).isPresent()) {
            throw new IllegalStateException("A color with this hex code already exists");
        }
        
        // 3. Save to database
        return colorRepository.save(color);
    }
}