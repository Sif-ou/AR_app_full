package com.example.demo.Color;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
// ⚠️ REMOVED @CrossOrigin(origins = "*") to prevent browser CORS credential rejections
public class ColorController {

    private final ColorService colorService;

    @Autowired
    public ColorController(ColorService colorService) {
        this.colorService = colorService;
    }

    @PreAuthorize("hasAuthority('STOCK') or hasRole('STOCK')")
    @PostMapping("/add/colors")
    public ResponseEntity<Color> createColor(@RequestBody Color color) {
        Color savedColor = colorService.saveColor(color);
        return new ResponseEntity<>(savedColor, HttpStatus.CREATED);
    }

    /**
     * GET: Fetch all active inventory color values.
     * FIXED: Added this missing method so the frontend initialization payload actually succeeds!
     * Endpoint matches frontend precisely: GET https://ar-app-back-end.onrender.com/api/colors
     */
    @GetMapping("/colors")
    public ResponseEntity<List<Color>> getAllColors() {
        try {
            List<Color> colors = colorService.getAllColors(); // Assumes your service has this standard method
            return new ResponseEntity<>(colors, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

@PreAuthorize("hasAuthority('STOCK') or hasRole('STOCK')")
@DeleteMapping("/colors/{id}")
public ResponseEntity<?> deleteColor(@PathVariable Long id) {
    try {
        colorService.deleteColor(id);
        return new ResponseEntity<>("Color deleted successfully", HttpStatus.OK);
    } catch (IllegalArgumentException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (Exception e) {
        return new ResponseEntity<>("An error occurred while deleting the color.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
}