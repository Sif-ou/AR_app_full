package com.example.demo.Variants;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/api/variants") // Cleaned up REST base path
public class VariantsController {

    private final VariantsService variantsService;

    public VariantsController(VariantsService variantsService) {
        this.variantsService = variantsService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addVariant(@RequestBody VariantCreateRequest request) {
        try {
            Variants savedVariant = variantsService.createVariant(request);
            return new ResponseEntity<>(savedVariant, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * GET: Fetch all variations
     * Endpoint: GET https://ar-app-back-end.onrender.com/api/variants
     */
    @GetMapping("/get")
    public ResponseEntity<List<Variants>> getAllVariants() {
        List<Variants> variants = variantsService.getAllVariants();
        return ResponseEntity.ok(variants);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVariant(@PathVariable Long id) {
        try {
            variantsService.deleteVariant(id);
            return ResponseEntity.ok("Variant deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the variant: " + e.getMessage());
        }
    }
}