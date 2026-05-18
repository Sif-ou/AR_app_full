package com.example.demo.Media;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/media")
// ⚠️ REMOVED @CrossOrigin(origins = "*") to allow global SecurityConfig to handle credentials safely
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PreAuthorize("hasAuthority('STOCK') or hasRole('STOCK')")
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
     * FIXED: Resolved compilation syntax mashup and dropped the "/get" suffix 
     * Endpoint now matches frontend precisely: GET https://ar-app-back-end.onrender.com/api/media
     */
    @GetMapping("")
    public ResponseEntity<List<Media>> getAllMedia() {
        List<Media> mediaList = mediaService.getAllMedia();
        return ResponseEntity.ok(mediaList);
    }

    /**
     * DELETE: Delete a specific media row.
     * Endpoint: DELETE https://ar-app-back-end.onrender.com/api/media/{id}
     */
    @PreAuthorize("hasAuthority('STOCK') or hasRole('STOCK')")
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