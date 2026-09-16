package com.moolya.repository;

import com.moolya.model.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    List<Feedback> findByStatus(String status);
    List<Feedback> findByRating(Integer rating);
    List<Feedback> findByReported(Boolean reported);
    List<Feedback> findByUserId(String userId);
    long countByStatus(String status);
}
