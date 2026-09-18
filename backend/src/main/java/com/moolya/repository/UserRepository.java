package com.moolya.repository;

import com.moolya.model.Role;
import com.moolya.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByPhone(String phone);
    Optional<User> findByEmail(String email);
    Boolean existsByPhone(String phone);
    Boolean existsByEmail(String email);
    Boolean existsByAadhaar(String aadhaar);
    
    Optional<User> findFirstByRole(Role role);
    List<User> findByRole(Role role);
    List<User> findByRoleIn(List<Role> roles);
    List<User> findByAccountStatus(String accountStatus);
    List<User> findBySuspiciousStatusIn(List<String> suspiciousStatuses);
    
    long countByRole(Role role);
    long countByAccountStatus(String accountStatus);
}
