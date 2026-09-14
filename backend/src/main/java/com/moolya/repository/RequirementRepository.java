package com.moolya.repository;

import com.moolya.model.Requirement;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RequirementRepository extends MongoRepository<Requirement, String> {
    List<Requirement> findByBuyerId(String buyerId);
}
