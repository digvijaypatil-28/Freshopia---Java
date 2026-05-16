package com.freshopia.controller;

import com.freshopia.model.*;
import com.freshopia.service.DataStore;
import com.freshopia.repository.OrderRepository;
import com.freshopia.repository.ProductRepository;
import com.freshopia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.util.Base64;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@CrossOrigin(origins = "*")
public class FreshopiaController {

    @Autowired
    private DataStore dataStore;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/products")
    public List<Product> getProducts(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            try {
                Category cat = Category.valueOf(category.toUpperCase().replace(" ", "_").replace("&", ""));
                // This valueOf mapping might be tricky because of the JsonProperty names. 
                // Let's use a more robust way to match the 'value' field.
                return productRepository.findAll().stream()
                        .filter(p -> p.getCategory().getValue().equals(category))
                        .collect(Collectors.toList());
            } catch (Exception e) {
                return productRepository.findAll();
            }
        }
        return productRepository.findAll();
    }

    @PostMapping("/billing")
    public BillingBreakdown calculateBilling(@RequestBody List<CartItem> cart) {
        double itemTotal = 0.0;
        for (CartItem item : cart) {
            Optional<Product> product = productRepository.findById(item.getProduct_id());
            if (product.isPresent()) {
                itemTotal += product.get().getPrice() * item.getQuantity();
            }
        }

        double gst = itemTotal * 0.05;
        double deliveryFee = (itemTotal > 0 && itemTotal < 500) ? 25.0 : 0.0;
        double handlingFee = itemTotal > 0 ? 5.0 : 0.0;
        double grandTotal = itemTotal + gst + deliveryFee + handlingFee;

        return BillingBreakdown.builder()
                .item_total(itemTotal)
                .gst(gst)
                .delivery_fee(deliveryFee)
                .handling_fee(handlingFee)
                .grand_total(grandTotal)
                .build();
    }

    @PostMapping("/upsell")
    public List<Product> getUpsellSuggestions(@RequestBody List<CartItem> cart) {
        Set<String> suggestedIds = new HashSet<>();
        for (CartItem item : cart) {
            Optional<Product> product = productRepository.findById(item.getProduct_id());
            if (product.isPresent()) {
                List<String> rules = dataStore.UPSELL_RULES.get(product.get().getCategory().getValue());
                if (rules != null) {
                    suggestedIds.addAll(rules);
                }
            }
        }

        Set<String> cartIds = cart.stream().map(CartItem::getProduct_id).collect(Collectors.toSet());
        List<String> finalIds = suggestedIds.stream()
                .filter(id -> !cartIds.contains(id))
                .collect(Collectors.toList());

        return productRepository.findAllById(finalIds).stream()
                .limit(3)
                .collect(Collectors.toList());
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (request.getUsername() == null || request.getUsername().length() < 3) {
            return ResponseEntity.badRequest().body("Username must be at least 3 characters");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        
        UserEntity newUser = UserEntity.builder()
                .username(request.getUsername())
                .password(request.getPassword()) // In real app, use BCrypt
                .build();
        userRepository.save(newUser);
        
        String token = Base64.getEncoder().encodeToString(request.getUsername().getBytes(StandardCharsets.UTF_8));
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Optional<UserEntity> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        String token = Base64.getEncoder().encodeToString(request.getUsername().getBytes(StandardCharsets.UTF_8));
        return ResponseEntity.ok(new AuthResponse(token));
    }

    private String getCurrentUser(String token) {
        try {
            String username = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
            if (userRepository.findByUsername(username).isPresent()) {
                return username;
            }
        } catch (Exception e) {
            // ignore
        }
        return null;
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody OrderCreate orderData, @RequestParam String token) {
        String username = getCurrentUser(token);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Order newOrder = Order.builder()
                .id(UUID.randomUUID().toString().substring(0, 8))
                .username(username)
                .items(new ArrayList<>(orderData.getItems()))
                .address(orderData.getAddress())
                .payment_method(orderData.getPayment_method())
                .total(orderData.getTotal())
                .created_at(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .status("Processing")
                .build();

        orderRepository.save(newOrder);
        return ResponseEntity.ok(newOrder);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(@RequestParam String token) {
        String username = getCurrentUser(token);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        List<Order> userOrders = orderRepository.findByUsername(username);
        return ResponseEntity.ok(userOrders);
    }
}
