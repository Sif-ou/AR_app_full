package com.example.demo.Media;

import com.example.demo.Variants.Variants;
import com.example.demo.Variants.VariantsRepository;
import org.springframework.stereotype.Service;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final VariantsRepository variantsRepository;

    public MediaService(MediaRepository mediaRepository, VariantsRepository variantsRepository) {
        this.mediaRepository = mediaRepository;
        this.variantsRepository = variantsRepository;
    }

    public Media saveMedia(MediaCreateRequest request) {
        // 1. Manual Validation
        if (request.getVariantId() == null) {
            throw new IllegalArgumentException("Variant ID is mandatory. Media must belong to a variant.");
        }
        if (request.getStaticImage() == null || request.getStaticImage().trim().isEmpty()) {
            throw new IllegalArgumentException("Static image URL or path cannot be empty.");
        }

        // 2. Database Lookup: Ensure variant exists
        Variants variant = variantsRepository.findById(request.getVariantId())
                .orElseThrow(() -> new IllegalArgumentException("Variant not found with ID: " + request.getVariantId()));

        // 3. Map DTO fields to Entity
        Media media = new Media();
        media.setVariant(variant); 
        media.setStatic_image(request.getStaticImage()); // Matches your entity field variable name
        media.setModel_3d(request.getModel3d());        // Matches your entity field variable name

        // 4. Save to Database
        return mediaRepository.save(media);
    }
}