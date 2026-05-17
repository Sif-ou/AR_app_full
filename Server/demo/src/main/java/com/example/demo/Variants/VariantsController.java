package com.example.demo.Variants;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/add/variants")
public class VariantsController {

    private final VariantsService variantsService;

    public VariantsController(VariantsService variantsService) {
        this.variantsService = variantsService;
    }

@PostMapping
public ResponseEntity<?> addVariant(@RequestBody VariantCreateRequest request) {
    try {
        Variants savedVariant = variantsService.createVariant(request);
        return new ResponseEntity<>(savedVariant, HttpStatus.CREATED);
    } catch (IllegalArgumentException e) {
        // This catches your manual validation errors and returns a 400 Bad Request
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
}