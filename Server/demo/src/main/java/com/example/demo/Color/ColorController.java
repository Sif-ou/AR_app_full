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
}