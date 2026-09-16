package com.moolya.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "admin_audit_logs")
public class AdminAuditLog {
    @Id
    private String id;
    
    private String adminId;
    private String adminName;
    private String action; // e.g., USER_SUSPENDED, REPORT_RESOLVED, REASON_ADDED
    private String targetType; // USER, ORDER, ORDER_REPORT, FEEDBACK, CONTACT_MESSAGE
    private String targetId;
    private String reasonOrNote;
    private String timestamp;

    public AdminAuditLog() {}

    public AdminAuditLog(String adminId, String adminName, String action, String targetType, String targetId, String reasonOrNote, String timestamp) {
        this.adminId = adminId;
        this.adminName = adminName;
        this.action = action;
        this.targetType = targetType;
        this.targetId = targetId;
        this.reasonOrNote = reasonOrNote;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }

    public String getReasonOrNote() { return reasonOrNote; }
    public void setReasonOrNote(String reasonOrNote) { this.reasonOrNote = reasonOrNote; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
