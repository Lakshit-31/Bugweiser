package com.moolya.service;

import com.moolya.model.Order;
import com.moolya.model.OrderStatus;
import com.moolya.model.Role;
import com.moolya.model.User;
import com.moolya.repository.OrderReportRepository;
import com.moolya.repository.OrderRepository;
import com.moolya.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class SuspiciousActivityService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderReportRepository orderReportRepository;

    public SuspiciousActivityService(UserRepository userRepository,
                                     OrderRepository orderRepository,
                                     OrderReportRepository orderReportRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.orderReportRepository = orderReportRepository;
    }

    /**
     * Scans all farmers & buyers in MongoDB for suspicious activity patterns.
     */
    public List<User> scanAndDetectSuspiciousUsers() {
        List<User> users = userRepository.findByRoleIn(List.of(Role.ROLE_FARMER, Role.ROLE_BUYER));
        List<User> updatedUsers = new ArrayList<>();
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        for (User user : users) {
            List<String> reasons = new ArrayList<>();
            int riskPoints = 0;

            // Pattern 1: User has order reports filed against them
            long reportCount = orderReportRepository.findByTargetUserId(user.getId()).size();
            if (reportCount > 0) {
                riskPoints += reportCount * 30;
                reasons.add(reportCount + " reported order case(s) filed against this user.");
            }

            // Pattern 2: Order cancellations
            List<Order> userOrders = "ROLE_FARMER".equals(user.getRole().name()) 
                    ? orderRepository.findByFarmerId(user.getId()) 
                    : orderRepository.findByBuyerId(user.getId());

            long cancelledCount = userOrders.stream()
                    .filter(o -> o.getStatus() == OrderStatus.DECLINED)
                    .count();

            if (cancelledCount >= 3) {
                riskPoints += 25;
                reasons.add("High order cancellation frequency (" + cancelledCount + " cancelled orders).");
            }

            // Pattern 3: Duplicate contact details or emails shared across multiple accounts
            if (user.getPhone() != null && !user.getPhone().isEmpty()) {
                long samePhoneCount = users.stream()
                        .filter(u -> !u.getId().equals(user.getId()) && user.getPhone().equals(u.getPhone()))
                        .count();
                if (samePhoneCount > 0) {
                    riskPoints += 40;
                    reasons.add("Duplicate contact phone number shared with another account.");
                }
            }

            if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                long sameEmailCount = users.stream()
                        .filter(u -> !u.getId().equals(user.getId()) && user.getEmail().equalsIgnoreCase(u.getEmail()))
                        .count();
                if (sameEmailCount > 0) {
                    riskPoints += 40;
                    reasons.add("Duplicate email address shared with another account.");
                }
            }

            // Determine status based on risk score
            String newStatus = "NORMAL";
            if (riskPoints >= 50) {
                newStatus = "SUSPICIOUS";
            } else if (riskPoints >= 20 || reportCount > 0) {
                newStatus = "UNDER_REVIEW";
            }

            // Update user model if status or reason changed
            if (!newStatus.equals(user.getSuspiciousStatus()) || !reasons.isEmpty()) {
                user.setSuspiciousStatus(newStatus);
                user.setSuspiciousReason(reasons.isEmpty() ? "No suspicious patterns detected." : String.join(" | ", reasons));
                user.setSuspiciousDetectedAt(nowStr);
                user.setUpdatedAt(nowStr);
                userRepository.save(user);
                updatedUsers.add(user);
            }
        }

        return updatedUsers;
    }
}
