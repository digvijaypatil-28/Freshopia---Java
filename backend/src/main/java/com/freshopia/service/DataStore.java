package com.freshopia.service;

import com.freshopia.model.Category;
import com.freshopia.model.Product;
import com.freshopia.model.UserEntity;
import com.freshopia.repository.ProductRepository;
import com.freshopia.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DataStore {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public final Map<String, List<String>> UPSELL_RULES = new HashMap<String, List<String>>() {{
        put("Spices & Masalas", Arrays.asList("sm-2", "sm-3"));
        put("Fruits & Vegetables", Arrays.asList("pe-1"));
    }};

    @PostConstruct
    public void seedData() {
        if (productRepository.count() == 0) {
            List<Product> products = new ArrayList<>();
            products.add(new Product("fv-1", "Alphonso Mangoes", Category.FRUITS_VEGGIES, 499.0, "1 Dozen", "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400", "Sourced 4 hours ago", "King of Mangoes, direct from Ratnagiri farms."));
            products.add(new Product("fv-2", "Fresh Palak (Spinach)", Category.FRUITS_VEGGIES, 30.0, "250g", "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400", "Farm-to-Table", "Organically grown, pesticide-free spinach."));
            products.add(new Product("fv-3", "Organic Avocados", Category.FRUITS_VEGGIES, 180.0, "2 units", "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400", "Imported Fresh", "Creamy, ripe Hass avocados."));
            products.add(new Product("dr-1", "Amul Gold Milk", Category.DRINKS_COLD_BREW, 33.0, "500ml", "https://images.unsplash.com/photo-1550583724-1255818c053b?auto=format&fit=crop&q=80&w=400", null, "Pasteurized full cream milk."));
            products.add(new Product("dr-2", "Cold Brew Coffee", Category.DRINKS_COLD_BREW, 180.0, "200ml", "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400", null, "18-hour slow steeped Arabica coffee."));
            products.add(new Product("dr-3", "Paper Boat Aam Panna", Category.DRINKS_COLD_BREW, 45.0, "250ml", "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400", null, "Traditional summer cooler made from raw mangoes."));
            products.add(new Product("fn-1", "California Almonds", Category.FRUITS_NUTS, 250.0, "200g", "https://images.unsplash.com/photo-1508061253366-f7da158b6d96?auto=format&fit=crop&q=80&w=400", null, "Premium quality, crunchy and nutritious."));
            products.add(new Product("fn-2", "Roasted Cashews", Category.FRUITS_NUTS, 320.0, "200g", "https://images.unsplash.com/photo-1536592240350-4170284436e9?auto=format&fit=crop&q=80&w=400", null, "Slow-roasted, lightly salted cashews."));
            products.add(new Product("sm-1", "Everest Garam Masala", Category.SPICES_MASALAS, 65.0, "100g", "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400", null, "Perfect blend of spices for Indian curries."));
            products.add(new Product("rc-1", "Maggi 2-Minute Noodles", Category.REGIONAL_CLASSICS, 14.0, "70g", "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=400", null, "The classic Indian comfort food."));
            products.add(new Product("rc-2", "Haldiram's Bhujia", Category.REGIONAL_CLASSICS, 40.0, "150g", "https://images.unsplash.com/photo-1599481238640-4c1288750d7a?auto=format&fit=crop&q=80&w=400", null, "Spicy and crunchy chickpea flour snack."));
            products.add(new Product("pe-1", "Sandalwood Agarbatti", Category.POOJA_ESSENTIALS, 45.0, "Pack of 20", "https://images.unsplash.com/photo-1602161100741-f67f651268b8?auto=format&fit=crop&q=80&w=400", null, "Traditional incense sticks for daily prayers."));
            products.add(new Product("pe-2", "Copper Pooja Thali", Category.POOJA_ESSENTIALS, 299.0, "1 unit", "https://images.unsplash.com/photo-1590076215667-873d31405904?auto=format&fit=crop&q=80&w=400", null, "Pure copper thali for auspicious rituals."));
            products.add(new Product("sm-2", "Daawat Basmati Rice", Category.REGIONAL_CLASSICS, 120.0, "1kg", "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400", null, "Long grain premium Basmati rice."));
            products.add(new Product("sm-3", "Fortune Sunflower Oil", Category.REGIONAL_CLASSICS, 165.0, "1L", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400", null, "Refined sunflower oil for healthy cooking."));
            products.add(new Product("fv-4", "Blueberries (Fresh)", Category.FRUITS_VEGGIES, 350.0, "125g", "https://images.unsplash.com/photo-1497534446932-c946e7316ba1?auto=format&fit=crop&q=80&w=400", "Cold Chain Maintained", "Antioxidant-rich premium blueberries."));
            
            productRepository.saveAll(products);
        }

        if (userRepository.count() == 0) {
            UserEntity admin = new UserEntity();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            userRepository.save(admin);

            UserEntity user = new UserEntity();
            user.setUsername("user");
            user.setPassword("pass123");
            userRepository.save(user);
        }
    }
}
