package com.moolya.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class AadhaarEncryptionService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    // 16-byte key for AES-128 / AES-256 demo encryption
    private static final String AES_KEY = "MoolyaAadhaarKey";

    public String hashAadhaar(String rawAadhaar) {
        if (rawAadhaar == null) return null;
        return passwordEncoder.encode(rawAadhaar);
    }

    public String encryptAadhaarAES(String rawAadhaar) {
        if (rawAadhaar == null || rawAadhaar.length() < 12) return rawAadhaar;
        try {
            SecretKeySpec secretKey = new SecretKeySpec(AES_KEY.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedBytes = cipher.doFinal(rawAadhaar.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            // Fallback to masked representation
            return "XXXX-XXXX-" + rawAadhaar.substring(rawAadhaar.length() - 4);
        }
    }
}
