package com.moolya.service;

import com.moolya.model.*;
import com.moolya.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final OrderReportRepository orderReportRepository;
    private final FeedbackRepository feedbackRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final AdminAuditLogRepository auditLogRepository;
    private final SuspiciousActivityService suspiciousActivityService;

    public AdminService(UserRepository userRepository,
                        OrderRepository orderRepository,
                        TransactionRepository transactionRepository,
                        OrderReportRepository orderReportRepository,
                        FeedbackRepository feedbackRepository,
                        ContactMessageRepository contactMessageRepository,
                        AdminAuditLogRepository auditLogRepository,
                        SuspiciousActivityService suspiciousActivityService) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.orderReportRepository = orderReportRepository;
        this.feedbackRepository = feedbackRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.auditLogRepository = auditLogRepository;
        this.suspiciousActivityService = suspiciousActivityService;
    }

    public Map<String, Object> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        List<User> allUsers = userRepository.findByRoleIn(List.of(Role.ROLE_FARMER, Role.ROLE_BUYER));
        long totalFarmers = allUsers.stream().filter(u -> u.getRole() == Role.ROLE_FARMER).count();
        long totalBuyers = allUsers.stream().filter(u -> u.getRole() == Role.ROLE_BUYER).count();
        long activeUsers = allUsers.stream().filter(u -> !"SUSPENDED".equalsIgnoreCase(u.getAccountStatus())).count();
        long suspendedUsers = allUsers.stream().filter(u -> "SUSPENDED".equalsIgnoreCase(u.getAccountStatus())).count();

        List<Order> allOrders = orderRepository.findAll();
        long pendingOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.REQUESTED).count();
        long completedOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.ACCEPTED || o.getStatus() == OrderStatus.DELIVERED).count();
        long cancelledOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.DECLINED).count();

        long totalTransactions = transactionRepository.count();
        long pendingComplaints = orderReportRepository.countByStatus("PENDING") + orderReportRepository.countByStatus("UNDER_REVIEW");
        long unreadContactMessages = contactMessageRepository.countByStatus("NEW");
        long unresolvedFeedback = feedbackRepository.countByStatus("NEW") + feedbackRepository.countByStatus("UNDER_REVIEW");

        metrics.put("totalRegisteredUsers", allUsers.size());
        metrics.put("totalFarmers", totalFarmers);
        metrics.put("totalBuyers", totalBuyers);
        metrics.put("activeUsers", activeUsers);
        metrics.put("suspendedUsers", suspendedUsers);
        metrics.put("pendingOrders", pendingOrders);
        metrics.put("completedOrders", completedOrders);
        metrics.put("cancelledOrders", cancelledOrders);
        metrics.put("totalTransactions", totalTransactions);
        metrics.put("pendingComplaints", pendingComplaints);
        metrics.put("unreadContactMessages", unreadContactMessages);
        metrics.put("unresolvedFeedback", unresolvedFeedback);

        return metrics;
    }

    public List<AdminAuditLog> getRecentActivities() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<User> getAllUsers(String search, String roleFilter, String statusFilter, String suspiciousFilter) {
        List<User> users = userRepository.findByRoleIn(List.of(Role.ROLE_FARMER, Role.ROLE_BUYER));

        return users.stream()
                .filter(u -> {
                    if (roleFilter != null && !roleFilter.isEmpty() && !"ALL".equalsIgnoreCase(roleFilter)) {
                        if (!u.getRole().name().equalsIgnoreCase(roleFilter)) return false;
                    }
                    if (statusFilter != null && !statusFilter.isEmpty() && !"ALL".equalsIgnoreCase(statusFilter)) {
                        if (!statusFilter.equalsIgnoreCase(u.getAccountStatus())) return false;
                    }
                    if (suspiciousFilter != null && !suspiciousFilter.isEmpty() && !"ALL".equalsIgnoreCase(suspiciousFilter)) {
                        if (!suspiciousFilter.equalsIgnoreCase(u.getSuspiciousStatus())) return false;
                    }
                    if (search != null && !search.trim().isEmpty()) {
                        String q = search.trim().toLowerCase();
                        boolean matchName = u.getFullName() != null && u.getFullName().toLowerCase().contains(q);
                        boolean matchPhone = u.getPhone() != null && u.getPhone().contains(q);
                        boolean matchEmail = u.getEmail() != null && u.getEmail().toLowerCase().contains(q);
                        boolean matchId = u.getId() != null && u.getId().contains(q);
                        return matchName || matchPhone || matchEmail || matchId;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> getUserDetails(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Map<String, Object> details = new HashMap<>();
        details.put("user", user);

        if (user.getRole() == Role.ROLE_FARMER) {
            details.put("orders", orderRepository.findByFarmerId(userId));
            details.put("transactions", transactionRepository.findByFarmerId(userId));
        } else {
            details.put("orders", orderRepository.findByBuyerId(userId));
            details.put("transactions", transactionRepository.findByBuyerId(userId));
        }

        details.put("reports", orderReportRepository.findByTargetUserId(userId));
        details.put("feedback", feedbackRepository.findByUserId(userId));

        return details;
    }

    public User updateUserStatus(String userId, String status, String reason, String notes, User adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        user.setAccountStatus(status);
        if (reason != null && !reason.trim().isEmpty()) {
            user.setSuspensionReason(reason.trim());
        }
        if (notes != null && !notes.trim().isEmpty()) {
            user.setAdminNotes(notes.trim());
        }
        user.setUpdatedAt(nowStr);

        User saved = userRepository.save(user);

        // Audit Log Entry
        String actionName = "SUSPENDED".equalsIgnoreCase(status) ? "USER_SUSPENDED" : "USER_ACTIVATED";
        logAudit(adminUser, actionName, "USER", userId, "Reason: " + (reason != null ? reason : "N/A") + " | Notes: " + (notes != null ? notes : "N/A"));

        return saved;
    }

    public List<User> scanSuspiciousUsers() {
        return suspiciousActivityService.scanAndDetectSuspiciousUsers();
    }

    public List<Order> getAllOrders(String statusFilter, String search) {
        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .filter(o -> {
                    if (statusFilter != null && !statusFilter.isEmpty() && !"ALL".equalsIgnoreCase(statusFilter)) {
                        if (!statusFilter.equalsIgnoreCase(o.getStatus().name())) return false;
                    }
                    if (search != null && !search.trim().isEmpty()) {
                        String q = search.trim().toLowerCase();
                        boolean matchCrop = o.getCropName() != null && o.getCropName().toLowerCase().contains(q);
                        boolean matchBuyer = o.getBuyerName() != null && o.getBuyerName().toLowerCase().contains(q);
                        boolean matchFarmer = o.getFarmerName() != null && o.getFarmerName().toLowerCase().contains(q);
                        boolean matchId = o.getId() != null && o.getId().contains(q);
                        return matchCrop || matchBuyer || matchFarmer || matchId;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public List<OrderReport> getReportedOrders() {
        return orderReportRepository.findAll();
    }

    public OrderReport createOrderReport(OrderReport report) {
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        report.setCreatedAt(nowStr);
        report.setUpdatedAt(nowStr);
        report.setStatus("PENDING");
        return orderReportRepository.save(report);
    }

    public OrderReport updateOrderReportStatus(String reportId, String status, String notes, User adminUser) {
        OrderReport report = orderReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));

        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        report.setStatus(status);
        if (notes != null) report.setAdminNotes(notes);
        report.setUpdatedAt(nowStr);

        OrderReport saved = orderReportRepository.save(report);
        logAudit(adminUser, "REPORT_STATUS_UPDATED", "ORDER_REPORT", reportId, "Status: " + status + " | Notes: " + notes);
        return saved;
    }

    public List<Feedback> getAllFeedback(String statusFilter, Integer ratingFilter) {
        List<Feedback> list = feedbackRepository.findAll();

        return list.stream()
                .filter(f -> {
                    if (statusFilter != null && !statusFilter.isEmpty() && !"ALL".equalsIgnoreCase(statusFilter)) {
                        if (!statusFilter.equalsIgnoreCase(f.getStatus())) return false;
                    }
                    if (ratingFilter != null && ratingFilter > 0) {
                        if (!ratingFilter.equals(f.getRating())) return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public Feedback submitFeedback(Feedback feedback) {
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        feedback.setCreatedAt(nowStr);
        feedback.setStatus("NEW");
        return feedbackRepository.save(feedback);
    }

    public Feedback updateFeedbackStatus(String feedbackId, String status, String notes, User adminUser) {
        Feedback f = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found: " + feedbackId));

        f.setStatus(status);
        if (notes != null) f.setAdminNotes(notes);

        Feedback saved = feedbackRepository.save(f);
        logAudit(adminUser, "FEEDBACK_UPDATED", "FEEDBACK", feedbackId, "Status: " + status + " | Notes: " + notes);
        return saved;
    }

    public List<ContactMessage> getAllContactMessages(String statusFilter, String search) {
        List<ContactMessage> list = contactMessageRepository.findAll();

        return list.stream()
                .filter(m -> {
                    if (statusFilter != null && !statusFilter.isEmpty() && !"ALL".equalsIgnoreCase(statusFilter)) {
                        if (!statusFilter.equalsIgnoreCase(m.getStatus())) return false;
                    }
                    if (search != null && !search.trim().isEmpty()) {
                        String q = search.trim().toLowerCase();
                        boolean matchName = m.getName() != null && m.getName().toLowerCase().contains(q);
                        boolean matchSubject = m.getSubject() != null && m.getSubject().toLowerCase().contains(q);
                        boolean matchContact = m.getPhoneOrEmail() != null && m.getPhoneOrEmail().toLowerCase().contains(q);
                        return matchName || matchSubject || matchContact;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public ContactMessage submitContactMessage(ContactMessage message) {
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        message.setCreatedAt(nowStr);
        message.setUpdatedAt(nowStr);
        message.setStatus("NEW");
        return contactMessageRepository.save(message);
    }

    public ContactMessage updateContactMessageStatus(String messageId, String status, String reply, String notes, User adminUser) {
        ContactMessage msg = contactMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Contact message not found: " + messageId));

        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        msg.setStatus(status);
        if (reply != null) msg.setAdminReply(reply);
        if (notes != null) msg.setAdminNotes(notes);
        msg.setUpdatedAt(nowStr);

        ContactMessage saved = contactMessageRepository.save(msg);
        logAudit(adminUser, "CONTACT_MESSAGE_UPDATED", "CONTACT_MESSAGE", messageId, "Status: " + status + " | Reply: " + reply);
        return saved;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<AdminAuditLog> getAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    private void logAudit(User adminUser, String action, String targetType, String targetId, String reasonOrNote) {
        String adminId = adminUser != null ? adminUser.getId() : "SYSTEM";
        String adminName = adminUser != null ? adminUser.getFullName() : "System Admin";
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        AdminAuditLog log = new AdminAuditLog(adminId, adminName, action, targetType, targetId, reasonOrNote, nowStr);
        auditLogRepository.save(log);
    }
}
