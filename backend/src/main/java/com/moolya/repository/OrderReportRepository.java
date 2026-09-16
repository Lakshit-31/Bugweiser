package com.moolya.repository;

import com.moolya.model.OrderReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderReportRepository extends MongoRepository<OrderReport, String> {
    List<OrderReport> findByStatus(String status);
    List<OrderReport> findByOrderId(String orderId);
    List<OrderReport> findByTargetUserId(String targetUserId);
    long countByStatus(String status);
}
