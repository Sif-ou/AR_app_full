package com.example.demo.Variants;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/variants") 
// ⚠️ REMOVED @CrossOrigin(origins = "*") to prevent CORS credential conflicts
public class VariantsController {

    private final VariantsService variantsService;

    public VariantsController(VariantsService variantsService) {
        this.variantsService = variantsService;
    }

    @PreAuthorize("hasAuthority('STOCK') or hasRole('STOCK')")
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
     * FIXED Endpoint: GET https://ar-app-back-end.onrender.com/api/variants
     * (Removed the "/get" sub-path to match your frontend fetch request perfectly)
     */
    @GetMapping("")
    public ResponseEntity<List<Variants>> getAllVariants() {
        List<Variants> variants = variantsService.getAllVariants();
        return ResponseEntity.ok(variants);
    }

    @PreAuthorize("hasAuthority('STOCK') or hasRole('STOCK')")
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