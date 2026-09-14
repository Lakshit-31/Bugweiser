package com.moolya.repository;

import com.moolya.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByFarmerId(String farmerId);
    List<Order> findByBuyerId(String buyerId);
    List<Order> findByListingId(String listingId);
}
