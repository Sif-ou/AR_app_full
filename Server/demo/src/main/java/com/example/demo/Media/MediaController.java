package com.example.demo.Media;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping("add/media")
    public ResponseEntity<?> addMedia(@RequestBody MediaCreateRequest request) {
        try {
            Media savedMedia = mediaService.saveMedia(request);
            return new ResponseEntity<>(savedMedia, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}