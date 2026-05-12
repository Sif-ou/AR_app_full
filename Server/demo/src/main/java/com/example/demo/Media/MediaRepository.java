package com.example.demo.Media;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Variants.Variants;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    

    List<Media> findByVariant_id(Variants variant_id) ;
}