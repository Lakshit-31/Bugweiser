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
        if (userRepository.existsByPhone(req.getPhone())) {
            throw new RuntimeException("Phone number already registered: " + req.getPhone());
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setAadhaar(aadhaarEncryptionService.encryptAadhaarAES(req.getAadhaar()));
        user.setRole(Role.ROLE_FARMER);
        user.setPreferredLanguage(req.getPreferredLanguage() != null ? req.getPreferredLanguage() : "hi");
        user.setLocation(new Location(req.getDistrict(), req.getState()));

        User saved = userRepository.save(user);

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getPhone(), req.getPassword())
        );
        String token = tokenProvider.generateToken(auth);

        return new AuthResponse(token, saved);
    }

    public AuthResponse registerBuyer(RegisterBuyerRequest req) {
        if (userRepository.existsByPhone(req.getPhone())) {
            throw new RuntimeException("Phone number already registered: " + req.getPhone());
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.ROLE_BUYER);
        user.setBuyerType(req.getBuyerType());
        user.setBusinessName(req.getBusinessName());
        user.setGstId(req.getGstId());
        user.setPreferredLanguage(req.getPreferredLanguage() != null ? req.getPreferredLanguage() : "en");
        user.setLocation(new Location(req.getDistrict() != null ? req.getDistrict() : "Central", 
                                      req.getState() != null ? req.getState() : "Punjab"));

        User saved = userRepository.save(user);

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getPhone(), req.getPassword())
        );
        String token = tokenProvider.generateToken(auth);

        return new AuthResponse(token, saved);
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        String token = tokenProvider.generateToken(auth);
        User user = userRepository.findByPhone(req.getUsername())
                .orElseGet(() -> userRepository.findByEmail(req.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found")));

        return new AuthResponse(token, user);
    }
}
