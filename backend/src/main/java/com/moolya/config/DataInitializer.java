package com.moolya.config;

import com.moolya.model.Location;
import com.moolya.model.Role;
import com.moolya.model.User;
import com.moolya.repository.OrderRepository;
import com.moolya.repository.TransactionRepository;
import com.moolya.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DataInitializer implements CommandLineRunner {

    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(OrderRepository orderRepository,
                           TransactionRepository transactionRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Clear all demo/sample orders and transactions for clean production use
        orderRepository.deleteAll();
        transactionRepository.deleteAll();
        System.out.println(">>> Demo orders and transactions cleared successfully on startup.");

        // Check if Admin account exists in MongoDB
        if (userRepository.findFirstByRole(Role.ROLE_ADMIN).isEmpty()) {
            String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            User admin = new User();
            admin.setFullName("Moolya System Admin");
            admin.setPhone("9999999999");
            admin.setEmail("admin@moolya.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setAccountStatus("ACTIVE");
            admin.setSuspiciousStatus("NORMAL");
            admin.setPreferredLanguage("en");
            admin.setLocation(new Location("Central Admin", "Punjab"));
            admin.setCreatedAt(nowStr);
            admin.setUpdatedAt(nowStr);

            userRepository.save(admin);
            System.out.println(">>> Initial System Admin account created successfully in MongoDB (Phone: 9999999999 / Email: admin@moolya.com).");
        } else {
            System.out.println(">>> Admin account already exists in MongoDB. Skipping admin creation.");
        }
    }
}
