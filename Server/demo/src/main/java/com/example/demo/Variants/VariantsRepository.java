package com.example.demo.Variants;

import com.example.demo.Product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VariantsRepository extends JpaRepository<Variants, Long> {
    
    List<Variants> findByProduct(Product product);
    

    Optional<Variants> findBySku(String sku);
}