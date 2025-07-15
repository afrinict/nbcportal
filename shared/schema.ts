import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Departments table
export const departments = sqliteTable("departments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  description: text("description"),
  headOfDepartment: integer("head_of_department"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(Date.now)
});

// Units table
export const units = sqliteTable("units", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description"),
  departmentId: integer("department_id").notNull(),
  headOfUnit: integer("head_of_unit"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(Date.now)
});

// Sub-units table
export const subunits = sqliteTable("subunits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description"),
  unitId: integer("unit_id").notNull(),
  headOfSubunit: integer("head_of_subunit"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(Date.now)
});

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone").notNull(),
  fullName: text("full_name").notNull(),
  companyName: text("company_name"),
  address: text("address"),
  nin: text("nin"),
  cacNumber: text("cac_number"),
  role: text("role").notNull().default("applicant"), // applicant, staff, admin
  department: text("department"), // for staff users
  unit: text("unit"), // for staff users
  subunit: text("subunit"), // for staff users
  position: text("position"), // job title/position
  employeeId: text("employee_id").unique(), // staff ID
  isVerified: integer("is_verified", { mode: 'boolean' }).default(false),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(Date.now),
  department_id: integer("department_id").references(() => departments.id),
  department_role: text("department_role"), // 'department_admin', 'write', 'read_only'
  status: text("status").notNull().default("active"), // 'active', 'inactive'
});

// License types
export const licenseTypes = sqliteTable("license_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(), // FM, AM, TV, DTH, etc.
  description: text("description"),
  applicationFee: real("application_fee").notNull(),
  licenseFee: real("license_fee").notNull(),
  validityPeriod: integer("validity_period").notNull(), // in years
  requiredDocuments: text("required_documents"), // JSON string
  isActive: integer("is_active", { mode: 'boolean' }).default(true)
});

// Applications
export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  applicationId: text("application_id").notNull().unique(),
  userId: integer("user_id").notNull(),
  licenseTypeId: integer("license_type_id").notNull(),
  title: text("title").notNull(),
  proposedLocation: text("proposed_location"),
  status: text("status").notNull().default("submitted"), // submitted, under_review, approved, rejected
  currentStage: text("current_stage").default("initial_review"),
  progress: integer("progress").default(0),
  submittedAt: integer("submitted_at", { mode: 'timestamp' }).default(Date.now),
  approvedAt: integer("approved_at", { mode: 'timestamp' }),
  rejectedAt: integer("rejected_at", { mode: 'timestamp' }),
  rejectionReason: text("rejection_reason"),
  applicationData: text("application_data"), // JSON string
  isRenewal: integer("is_renewal", { mode: 'boolean' }).default(false),
  parentApplicationId: integer("parent_application_id"),
  department_id: integer("department_id").references(() => departments.id),
  assigned_to: integer("assigned_to").references(() => users.id),
  created_at: integer("created_at", { mode: 'timestamp' }).default(Date.now),
  updated_at: integer("updated_at", { mode: 'timestamp' }).default(Date.now)
});

// Workflow stages
export const workflowStages = sqliteTable("workflow_stages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  departmentId: integer("department_id"),
  unitId: integer("unit_id"),
  subunitId: integer("subunit_id"),
  description: text("description"),
  estimatedDuration: integer("estimated_duration"), // in days
  requiredDocuments: text("required_documents"), // JSON string
  assignedRole: text("assigned_role").default("reviewer"),
  canReject: integer("can_reject", { mode: 'boolean' }).default(false),
  canApprove: integer("can_approve", { mode: 'boolean' }).default(false),
  isRequired: integer("is_required", { mode: 'boolean' }).default(true),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now)
});

// Application workflow progress
export const applicationWorkflow = sqliteTable("application_workflow", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  applicationId: integer("application_id").notNull(),
  stageId: integer("stage_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, approved, rejected, returned
  assignedTo: integer("assigned_to"),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: integer("reviewed_at", { mode: 'timestamp' }),
  startedAt: integer("started_at", { mode: 'timestamp' }),
  completedAt: integer("completed_at", { mode: 'timestamp' }),
  dueDate: integer("due_date", { mode: 'timestamp' }),
  priority: text("priority").default("normal"), // low, normal, high, urgent
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now)
});

// Workflow comments
export const workflowComments = sqliteTable("workflow_comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  applicationId: integer("application_id").notNull(),
  workflowId: integer("workflow_id").notNull(),
  userId: integer("user_id").notNull(),
  comment: text("comment").notNull(),
  isInternal: integer("is_internal", { mode: 'boolean' }).default(false), // internal comment vs applicant visible
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now)
});

// Documents
export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  applicationId: integer("application_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  status: text("status").default("pending"), // pending, verified, rejected
  verifiedBy: integer("verified_by"),
  verifiedAt: integer("verified_at", { mode: 'timestamp' }),
  uploadedAt: integer("uploaded_at", { mode: 'timestamp' }).default(Date.now)
});

// Payments
export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  applicationId: integer("application_id").notNull(),
  userId: integer("user_id").notNull(),
  transactionId: text("transaction_id").notNull().unique(),
  paymentReference: text("payment_reference"),
  amount: real("amount").notNull(),
  paymentType: text("payment_type").notNull(), // application_fee, license_fee
  status: text("status").notNull().default("pending"), // pending, completed, failed, cancelled
  paymentMethod: text("payment_method").default("remita"),
  paidAt: integer("paid_at", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now)
});

// Notifications
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, success, warning, error
  isRead: integer("is_read", { mode: 'boolean' }).default(false),
  applicationId: integer("application_id"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now)
});

// Licenses (issued certificates)
export const licenses = sqliteTable("licenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  applicationId: integer("application_id").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  userId: integer("user_id").notNull(),
  licenseTypeId: integer("license_type_id").notNull(),
  issuedAt: integer("issued_at", { mode: 'timestamp' }).default(Date.now),
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  status: text("status").notNull().default("active"), // active, expired, revoked, suspended
  certificatePath: text("certificate_path"),
  digitalSignature: text("digital_signature")
});

// Department permissions for role-based access control
export const departmentPermissions = sqliteTable("department_permissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  departmentId: integer("department_id").notNull().references(() => departments.id),
  role: text("role").notNull(), // 'department_admin', 'write', 'read_only'
  permissions: text("permissions").notNull(), // JSON string with specific permissions
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(Date.now)
});

// Department activities for audit trail
export const departmentActivities = sqliteTable("department_activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  departmentId: integer("department_id").notNull().references(() => departments.id),
  userId: integer("user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // 'created', 'updated', 'deleted', 'approved', 'rejected'
  resourceType: text("resource_type").notNull(), // 'application', 'document', 'comment', 'user'
  resourceId: integer("resource_id"),
  details: text("details"), // JSON string
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now)
});

// Department metrics for analytics
export const departmentMetrics = sqliteTable("department_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  departmentId: integer("department_id").notNull().references(() => departments.id),
  metricType: text("metric_type").notNull(), // 'applications_received', 'applications_approved', 'applications_rejected', 'avg_processing_time'
  value: integer("value").notNull(),
  period: text("period").notNull(), // 'daily', 'weekly', 'monthly', 'yearly'
  date: integer("date", { mode: 'timestamp' }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now)
});

// Relations
export const departmentsRelations = relations(departments, ({ many, one }) => ({
  units: many(units),
  users: many(users),
  workflowStages: many(workflowStages),
  headOfDepartment: one(users, {
    fields: [departments.headOfDepartment],
    references: [users.id]
  })
}));

export const unitsRelations = relations(units, ({ many, one }) => ({
  subunits: many(subunits),
  workflowStages: many(workflowStages),
  department: one(departments, {
    fields: [units.departmentId],
    references: [departments.id]
  }),
  headOfUnit: one(users, {
    fields: [units.headOfUnit],
    references: [users.id]
  })
}));

export const subunitsRelations = relations(subunits, ({ one }) => ({
  unit: one(units, {
    fields: [subunits.unitId],
    references: [units.id]
  }),
  headOfSubunit: one(users, {
    fields: [subunits.headOfSubunit],
    references: [users.id]
  })
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  applications: many(applications),
  payments: many(payments),
  notifications: many(notifications),
  licenses: many(licenses),
  workflowComments: many(workflowComments),
  department: one(departments, {
    fields: [users.department_id],
    references: [departments.id]
  })
}));

export const applicationsRelations = relations(applications, ({ many, one }) => ({
  documents: many(documents),
  payments: many(payments),
  workflow: many(applicationWorkflow),
  user: one(users, {
    fields: [applications.userId],
    references: [users.id]
  }),
  licenseType: one(licenseTypes, {
    fields: [applications.licenseTypeId],
    references: [licenseTypes.id]
  }),
  department: one(departments, {
    fields: [applications.department_id],
    references: [departments.id]
  }),
  assignedTo: one(users, {
    fields: [applications.assigned_to],
    references: [users.id]
  })
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  application: one(applications, {
    fields: [documents.applicationId],
    references: [applications.id]
  }),
  verifiedBy: one(users, {
    fields: [documents.verifiedBy],
    references: [users.id]
  })
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  application: one(applications, {
    fields: [payments.applicationId],
    references: [applications.id]
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id]
  })
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  }),
  application: one(applications, {
    fields: [notifications.applicationId],
    references: [applications.id]
  })
}));

export const licensesRelations = relations(licenses, ({ one }) => ({
  application: one(applications, {
    fields: [licenses.applicationId],
    references: [applications.id]
  }),
  user: one(users, {
    fields: [licenses.userId],
    references: [users.id]
  }),
  licenseType: one(licenseTypes, {
    fields: [licenses.licenseTypeId],
    references: [licenseTypes.id]
  })
}));

export const workflowStagesRelations = relations(workflowStages, ({ many, one }) => ({
  workflows: many(applicationWorkflow),
  department: one(departments, {
    fields: [workflowStages.departmentId],
    references: [departments.id]
  }),
  unit: one(units, {
    fields: [workflowStages.unitId],
    references: [units.id]
  }),
  subunit: one(subunits, {
    fields: [workflowStages.subunitId],
    references: [subunits.id]
  })
}));

export const applicationWorkflowRelations = relations(applicationWorkflow, ({ many, one }) => ({
  comments: many(workflowComments),
  application: one(applications, {
    fields: [applicationWorkflow.applicationId],
    references: [applications.id]
  }),
  stage: one(workflowStages, {
    fields: [applicationWorkflow.stageId],
    references: [workflowStages.id]
  }),
  assignedTo: one(users, {
    fields: [applicationWorkflow.assignedTo],
    references: [users.id]
  }),
  reviewedBy: one(users, {
    fields: [applicationWorkflow.reviewedBy],
    references: [users.id]
  })
}));

export const workflowCommentsRelations = relations(workflowComments, ({ one }) => ({
  application: one(applications, {
    fields: [workflowComments.applicationId],
    references: [applications.id]
  }),
  workflow: one(applicationWorkflow, {
    fields: [workflowComments.workflowId],
    references: [applicationWorkflow.id]
  }),
  user: one(users, {
    fields: [workflowComments.userId],
    references: [users.id]
  })
}));

// Zod schemas for validation
export const insertDepartmentSchema = createInsertSchema(departments);
export const insertUnitSchema = createInsertSchema(units);
export const insertSubunitSchema = createInsertSchema(subunits);
export const insertUserSchema = createInsertSchema(users);
export const insertApplicationSchema = createInsertSchema(applications);
export const insertDocumentSchema = createInsertSchema(documents);
export const insertPaymentSchema = createInsertSchema(payments);
export const insertNotificationSchema = createInsertSchema(notifications);
export const insertWorkflowStageSchema = createInsertSchema(workflowStages);
export const insertApplicationWorkflowSchema = createInsertSchema(applicationWorkflow);
export const insertWorkflowCommentSchema = createInsertSchema(workflowComments);

// Type exports
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type Subunit = typeof subunits.$inferSelect;
export type InsertSubunit = z.infer<typeof insertSubunitSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type License = typeof licenses.$inferSelect;
export type LicenseType = typeof licenseTypes.$inferSelect;
export type WorkflowStage = typeof workflowStages.$inferSelect;
export type InsertWorkflowStage = z.infer<typeof insertWorkflowStageSchema>;
export type ApplicationWorkflow = typeof applicationWorkflow.$inferSelect;
export type InsertApplicationWorkflow = z.infer<typeof insertApplicationWorkflowSchema>;
export type WorkflowComment = typeof workflowComments.$inferSelect;
export type InsertWorkflowComment = z.infer<typeof insertWorkflowCommentSchema>;
