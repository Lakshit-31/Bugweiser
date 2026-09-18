package com.moolya.service;

import com.moolya.dto.*;
import com.moolya.model.Location;
import com.moolya.model.Role;
import com.moolya.model.User;
import com.moolya.repository.UserRepository;
import com.moolya.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AadhaarEncryptionService aadhaarEncryptionService;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AadhaarEncryptionService aadhaarEncryptionService,
                       JwtTokenProvider tokenProvider,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.aadhaarEncryptionService = aadhaarEncryptionService;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse registerFarmer(RegisterFarmerRequest req) {
        String phone = req.getPhone() != null ? req.getPhone().trim() : "";
        if (userRepository.existsByPhone(phone)) {
            throw new RuntimeException("Phone number already registered: " + phone);
        }

        String rawAadhaar = req.getAadhaar() != null ? req.getAadhaar().trim() : "";
        String encryptedAadhaar = aadhaarEncryptionService.encryptAadhaarAES(rawAadhaar);
        if (encryptedAadhaar != null && userRepository.existsByAadhaar(encryptedAadhaar)) {
            throw new RuntimeException("Aadhaar number is already registered with another account: " + rawAadhaar);
        }

        String nowStr = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        User user = new User();
        user.setFullName(req.getFullName() != null ? req.getFullName().trim() : "");
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setAadhaar(encryptedAadhaar);
        user.setRole(Role.ROLE_FARMER);
        user.setAccountStatus("ACTIVE");
        user.setSuspiciousStatus("NORMAL");
        user.setPreferredLanguage(req.getPreferredLanguage() != null ? req.getPreferredLanguage() : "hi");
        user.setLocation(new Location(
                req.getDistrict() != null ? req.getDistrict().trim() : "Ludhiana",
                req.getState() != null ? req.getState().trim() : "Punjab"
        ));
        user.setCreatedAt(nowStr);
        user.setUpdatedAt(nowStr);

        User saved = userRepository.save(user);

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(phone, req.getPassword())
        );
        String token = tokenProvider.generateToken(auth);

        return new AuthResponse(token, saved);
    }

    public AuthResponse registerBuyer(RegisterBuyerRequest req) {
        String phone = req.getPhone() != null ? req.getPhone().trim() : "";
        if (userRepository.existsByPhone(phone)) {
            throw new RuntimeException("Phone number already registered: " + phone);
        }

        String email = req.getEmail() != null ? req.getEmail().trim() : "";
        if (!email.isEmpty() && userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email address already registered: " + email);
        }

        String nowStr = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        User user = new User();
        user.setFullName(req.getFullName() != null ? req.getFullName().trim() : "");
        user.setPhone(phone);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.ROLE_BUYER);
        user.setBuyerType(req.getBuyerType() != null ? req.getBuyerType() : com.moolya.model.BuyerType.INDIVIDUAL);
        user.setBusinessName(req.getBusinessName() != null ? req.getBusinessName().trim() : null);
        user.setGstId(req.getGstId() != null ? req.getGstId().trim() : null);
        user.setAccountStatus("ACTIVE");
        user.setSuspiciousStatus("NORMAL");
        user.setPreferredLanguage(req.getPreferredLanguage() != null ? req.getPreferredLanguage() : "en");
        user.setLocation(new Location(
                req.getDistrict() != null && !req.getDistrict().trim().isEmpty() ? req.getDistrict().trim() : "New Delhi", 
                req.getState() != null && !req.getState().trim().isEmpty() ? req.getState().trim() : "Delhi"
        ));
        user.setCreatedAt(nowStr);
        user.setUpdatedAt(nowStr);

        User saved = userRepository.save(user);

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(phone, req.getPassword())
        );
        String token = tokenProvider.generateToken(auth);

        return new AuthResponse(token, saved);
    }

    public AuthResponse login(LoginRequest req) {
        String identifier = req.getUsername() != null ? req.getUsername().trim() : "";
        String rawPassword = req.getPassword() != null ? req.getPassword().trim() : "";

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identifier, rawPassword)
            );

            String token = tokenProvider.generateToken(auth);
            User user = userRepository.findByPhone(identifier)
                    .orElseGet(() -> userRepository.findByEmail(identifier)
                            .orElseThrow(() -> new RuntimeException("User not found: " + identifier)));

            return new AuthResponse(token, user);
        } catch (org.springframework.security.core.AuthenticationException ex) {
            throw new IllegalArgumentException("गलत फोन नंबर या पासवर्ड! कृपया सही विवरण दर्ज करें। (Bad Credentials: Invalid phone or password).");
        }
    }
}
