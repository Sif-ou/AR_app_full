package com.example.demo.Color;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/api") // Target URL: http://localhost:8080/api/colors
public class ColorController {

    private final ColorService colorService;

    @Autowired
    public ColorController(ColorService colorService) {
        this.colorService = colorService;
    }

    @PostMapping("/add/colors")
    public ResponseEntity<Color> createColor(@RequestBody Color color) {
        // @RequestBody converts Postman JSON into your Color object
        Color savedColor = colorService.saveColor(color);
        return new ResponseEntity<>(savedColor, HttpStatus.CREATED);
    }
}