package com.freshopia.repository;

import com.freshopia.model.Category;
import com.freshopia.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByCategory(Category category);
}
