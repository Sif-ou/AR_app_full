package com.example.demo.Media;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/api/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addMedia(@RequestBody MediaCreateRequest request) {
        try {
            Media savedMedia = mediaService.saveMedia(request);
            return new ResponseEntity<>(savedMedia, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * GET: Fetch all static images and 3D files.
     * Endpoint: GET http://localhost:8080/api/media
     */
    @GetMapping@PostMapping("/get")
    public ResponseEntity<List<Media>> getAllMedia() {
        List<Media> mediaList = mediaService.getAllMedia();
        return ResponseEntity.ok(mediaList);
    }

    /**
     * DELETE: Delete a specific media row (breaks no constraints).
     * Endpoint: DELETE http://localhost:8080/api/media/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedia(@PathVariable Long id) {
        try {
            mediaService.deleteMedia(id);
            return ResponseEntity.ok("Media asset deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the media record: " + e.getMessage());
        }
    }
}