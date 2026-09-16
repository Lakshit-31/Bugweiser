package com.moolya.repository;

import com.moolya.model.AdminAuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminAuditLogRepository extends MongoRepository<AdminAuditLog, String> {
    List<AdminAuditLog> findAllByOrderByTimestampDesc();
    List<AdminAuditLog> findByTargetType(String targetType);
}
