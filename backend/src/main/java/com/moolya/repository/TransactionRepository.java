package com.moolya.repository;

import com.moolya.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByBuyerId(String buyerId);
    List<Transaction> findByFarmerId(String farmerId);
    List<Transaction> findByOrderId(String orderId);
}
