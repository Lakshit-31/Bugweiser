package com.moolya.repository;

import com.moolya.model.Grade;
import com.moolya.model.ListingStatus;
import com.moolya.model.ProduceListing;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProduceListingRepository extends MongoRepository<ProduceListing, String> {
    List<ProduceListing> findByFarmerId(String farmerId);
    List<ProduceListing> findByStatus(ListingStatus status);
    List<ProduceListing> findByAssignedGradeAndStatus(Grade assignedGrade, ListingStatus status);
    List<ProduceListing> findByCropNameContainingIgnoreCaseAndStatus(String cropName, ListingStatus status);
}
