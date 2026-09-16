package com.moolya.controller;

import com.moolya.model.*;
import com.moolya.repository.UserRepository;
import com.moolya.security.UserPrincipal;
import com.moolya.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService, UserRepository userRepository) {
        this.adminService = adminService;
        this.userRepository = userRepository;
    }

    private User getAdminUser(UserPrincipal principal) {
        if (principal == null) return null;
        return userRepository.findById(principal.getId()).orElse(null);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        return ResponseEntity.ok(adminService.getDashboardMetrics());
    }

    @GetMapping("/activities")
    public ResponseEntity<List<AdminAuditLog>> getRecentActivities() {
        return ResponseEntity.ok(adminService.getRecentActivities());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String suspicious) {
        return ResponseEntity.ok(adminService.getAllUsers(search, role, status, suspicious));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getUserDetails(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getUserDetails(id));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        String status = body.get("status");
        String reason = body.get("reason");
        String notes = body.get("notes");
        User admin = getAdminUser(principal);

        User updated = adminService.updateUserStatus(id, status, reason, notes, admin);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/suspicious-users")
    public ResponseEntity<List<User>> getSuspiciousUsers() {
        List<User> suspicious = adminService.getAllUsers(null, null, null, "SUSPICIOUS");
        return ResponseEntity.ok(suspicious);
    }

    @PostMapping("/detect-suspicious")
    public ResponseEntity<List<User>> scanSuspiciousUsers() {
        List<User> scanned = adminService.scanSuspiciousUsers();
        return ResponseEntity.ok(scanned);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllOrders(status, search));
    }

    @GetMapping("/order-reports")
    public ResponseEntity<List<OrderReport>> getReportedOrders() {
        return ResponseEntity.ok(adminService.getReportedOrders());
    }

    @PostMapping("/order-reports")
    public ResponseEntity<OrderReport> submitOrderReport(@RequestBody OrderReport report) {
        return ResponseEntity.ok(adminService.createOrderReport(report));
    }

    @PatchMapping("/order-reports/{id}/status")
    public ResponseEntity<OrderReport> updateOrderReportStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        String status = body.get("status");
        String notes = body.get("notes");
        User admin = getAdminUser(principal);

        OrderReport updated = adminService.updateOrderReportStatus(id, status, notes, admin);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<Feedback>> getAllFeedback(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer rating) {
        return ResponseEntity.ok(adminService.getAllFeedback(status, rating));
    }

    @PostMapping("/feedback")
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(adminService.submitFeedback(feedback));
    }

    @PatchMapping("/feedback/{id}/status")
    public ResponseEntity<Feedback> updateFeedbackStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        String status = body.get("status");
        String notes = body.get("notes");
        User admin = getAdminUser(principal);

        Feedback updated = adminService.updateFeedbackStatus(id, status, notes, admin);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/contact-messages")
    public ResponseEntity<List<ContactMessage>> getAllContactMessages(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllContactMessages(status, search));
    }

    @PostMapping("/contact-messages")
    public ResponseEntity<ContactMessage> submitContactMessage(@RequestBody ContactMessage message) {
        return ResponseEntity.ok(adminService.submitContactMessage(message));
    }

    @PatchMapping("/contact-messages/{id}/status")
    public ResponseEntity<ContactMessage> updateContactMessageStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        String status = body.get("status");
        String reply = body.get("reply");
        String notes = body.get("notes");
        User admin = getAdminUser(principal);

        ContactMessage updated = adminService.updateContactMessageStatus(id, status, reply, notes, admin);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AdminAuditLog>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getAuditLogs());
    }
}
