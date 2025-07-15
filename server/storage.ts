import 'dotenv/config';
import { eq } from "drizzle-orm";
import { 
  users, applications, documents, payments, notifications, licenses, 
  licenseTypes, workflowStages, applicationWorkflow, workflowComments, departments, units, subunits,
  type User, type InsertUser, type Application, type InsertApplication,
  type Document, type InsertDocument, type Payment, type InsertPayment,
  type Notification, type InsertNotification, type License, type LicenseType,
  type WorkflowStage, type ApplicationWorkflow, type WorkflowComment, type InsertWorkflowComment, type Department, type InsertDepartment,
  type Unit, type InsertUnit, type Subunit, type InsertSubunit
} from "@shared/schema";
import { db } from "./db";
import { desc, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Department methods
  getDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department>;
  deleteDepartment(id: number): Promise<void>;

  // Unit methods
  getUnits(): Promise<Unit[]>;
  getUnit(id: number): Promise<Unit | undefined>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  updateUnit(id: number, unit: Partial<InsertUnit>): Promise<Unit>;
  deleteUnit(id: number): Promise<void>;

  // Subunit methods
  getSubunits(): Promise<Subunit[]>;
  getSubunit(id: number): Promise<Subunit | undefined>;
  createSubunit(subunit: InsertSubunit): Promise<Subunit>;
  updateSubunit(id: number, subunit: Partial<InsertSubunit>): Promise<Subunit>;
  deleteSubunit(id: number): Promise<void>;

  // Application methods
  createApplication(application: InsertApplication): Promise<Application>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationByApplicationId(applicationId: string): Promise<Application | undefined>;
  getUserApplications(userId: number): Promise<Application[]>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application>;
  getAllApplications(): Promise<Application[]>;

  // Document methods
  createDocument(document: InsertDocument): Promise<Document>;
  getApplicationDocuments(applicationId: number): Promise<Document[]>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document>;
  deleteDocument(id: number): Promise<void>;

  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentByTransactionId(transactionId: string): Promise<Payment | undefined>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment>;
  getUserPayments(userId: number): Promise<Payment[]>;

  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;

  // License methods
  createLicense(license: Omit<License, 'id'>): Promise<License>;
  getUserLicenses(userId: number): Promise<License[]>;
  getLicense(id: number): Promise<License | undefined>;

  // License types
  getLicenseTypes(): Promise<LicenseType[]>;
  getLicenseType(id: number): Promise<LicenseType | undefined>;

  // Workflow methods
  getWorkflowStages(): Promise<WorkflowStage[]>;
  createWorkflowStage(stage: Omit<WorkflowStage, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowStage>;
  updateWorkflowStage(id: number, stage: Partial<WorkflowStage>): Promise<WorkflowStage>;
  deleteWorkflowStage(id: number): Promise<void>;
  createApplicationWorkflow(workflow: Omit<ApplicationWorkflow, 'id' | 'createdAt'>): Promise<ApplicationWorkflow>;
  getApplicationWorkflow(applicationId: number): Promise<ApplicationWorkflow[]>;
  updateApplicationWorkflow(id: number, workflow: Partial<ApplicationWorkflow>): Promise<ApplicationWorkflow>;

  // Workflow comment methods
  createWorkflowComment(comment: InsertWorkflowComment): Promise<WorkflowComment>;
  getWorkflowComments(workflowId?: number | null): Promise<WorkflowComment[]>;
  updateWorkflowComment(id: number, comment: Partial<InsertWorkflowComment>): Promise<WorkflowComment>;
  deleteWorkflowComment(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        updatedAt: new Date()
      })
      .returning();
    return user;
  }

  async updateUser(id: number, insertUser: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...insertUser,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const applicationId = `NBC-${new Date().getFullYear()}-${application.licenseTypeId}-${String(Date.now()).slice(-6)}`;
    const [app] = await db
      .insert(applications)
      .values({
        ...application,
        applicationId
      })
      .returning();
    return app;
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async getApplicationByApplicationId(applicationId: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.applicationId, applicationId));
    return application || undefined;
  }

  async getUserApplications(userId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.userId, userId)).orderBy(desc(applications.submittedAt));
  }

  async updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application> {
    const [app] = await db
      .update(applications)
      .set(application)
      .where(eq(applications.id, id))
      .returning();
    return app;
  }

  async getAllApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(desc(applications.submittedAt));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [doc] = await db
      .insert(documents)
      .values(document)
      .returning();
    return doc;
  }

  async getApplicationDocuments(applicationId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.applicationId, applicationId));
  }

  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document> {
    const [doc] = await db
      .update(documents)
      .set(document)
      .where(eq(documents.id, id))
      .returning();
    return doc;
  }

  async deleteDocument(id: number): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [pay] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return pay;
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentByTransactionId(transactionId: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.transactionId, transactionId));
    return payment || undefined;
  }

  async updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment> {
    const [pay] = await db
      .update(payments)
      .set(payment)
      .where(eq(payments.id, id))
      .returning();
    return pay;
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [notif] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return notif;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async createLicense(license: Omit<License, 'id'>): Promise<License> {
    const [lic] = await db
      .insert(licenses)
      .values(license)
      .returning();
    return lic;
  }

  async getUserLicenses(userId: number): Promise<License[]> {
    return await db.select().from(licenses).where(eq(licenses.userId, userId)).orderBy(desc(licenses.issuedAt));
  }

  async getLicense(id: number): Promise<License | undefined> {
    const [license] = await db.select().from(licenses).where(eq(licenses.id, id));
    return license || undefined;
  }

  async getLicenseTypes(): Promise<LicenseType[]> {
    return await db.select().from(licenseTypes).where(eq(licenseTypes.isActive, true));
  }

  async getLicenseType(id: number): Promise<LicenseType | undefined> {
    const [licenseType] = await db.select().from(licenseTypes).where(eq(licenseTypes.id, id));
    return licenseType || undefined;
  }

  async getWorkflowStages(): Promise<WorkflowStage[]> {
    return await db.select().from(workflowStages).where(eq(workflowStages.isActive, true)).orderBy(workflowStages.order);
  }

  async createWorkflowStage(stage: Omit<WorkflowStage, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowStage> {
    const [wf] = await db
      .insert(workflowStages)
      .values({
        ...stage,
        createdAt: new Date()
      })
      .returning();
    return wf;
  }

  async updateWorkflowStage(id: number, stage: Partial<WorkflowStage>): Promise<WorkflowStage> {
    const [wf] = await db
      .update(workflowStages)
      .set(stage)
      .where(eq(workflowStages.id, id))
      .returning();
    return wf;
  }

  async deleteWorkflowStage(id: number): Promise<void> {
    await db.delete(workflowStages).where(eq(workflowStages.id, id));
  }

  async createApplicationWorkflow(workflow: Omit<ApplicationWorkflow, 'id' | 'createdAt'>): Promise<ApplicationWorkflow> {
    const [wf] = await db
      .insert(applicationWorkflow)
      .values(workflow)
      .returning();
    return wf;
  }

  async getApplicationWorkflow(applicationId: number): Promise<ApplicationWorkflow[]> {
    return await db.select().from(applicationWorkflow).where(eq(applicationWorkflow.applicationId, applicationId));
  }

  async updateApplicationWorkflow(id: number, workflow: Partial<ApplicationWorkflow>): Promise<ApplicationWorkflow> {
    const [wf] = await db
      .update(applicationWorkflow)
      .set(workflow)
      .where(eq(applicationWorkflow.id, id))
      .returning();
    return wf;
  }

  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments).where(eq(departments.isActive, true));
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department || undefined;
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [dep] = await db
      .insert(departments)
      .values(department)
      .returning();
    return dep;
  }

  async updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department> {
    const [dep] = await db
      .update(departments)
      .set(department)
      .where(eq(departments.id, id))
      .returning();
    return dep;
  }

  async deleteDepartment(id: number): Promise<void> {
    await db.delete(departments).where(eq(departments.id, id));
  }

  async getUnits(): Promise<Unit[]> {
    return await db.select().from(units).where(eq(units.isActive, true));
  }

  async getUnit(id: number): Promise<Unit | undefined> {
    const [unitRecord] = await db.select().from(units).where(eq(units.id, id));
    return unitRecord || undefined;
  }

  async createUnit(unit: InsertUnit): Promise<Unit> {
    const [unitRecord] = await db
      .insert(units)
      .values(unit)
      .returning();
    return unitRecord;
  }

  async updateUnit(id: number, unit: Partial<InsertUnit>): Promise<Unit> {
    const [unitRecord] = await db
      .update(units)
      .set(unit)
      .where(eq(units.id, id))
      .returning();
    return unitRecord;
  }

  async deleteUnit(id: number): Promise<void> {
    await db.delete(units).where(eq(units.id, id));
  }

  async getSubunits(): Promise<Subunit[]> {
    return await db.select().from(subunits).where(eq(subunits.isActive, true));
  }

  async getSubunit(id: number): Promise<Subunit | undefined> {
    const [subunitRecord] = await db.select().from(subunits).where(eq(subunits.id, id));
    return subunitRecord || undefined;
  }

  async createSubunit(subunit: InsertSubunit): Promise<Subunit> {
    const [subunitRecord] = await db
      .insert(subunits)
      .values(subunit)
      .returning();
    return subunitRecord;
  }

  async updateSubunit(id: number, subunit: Partial<InsertSubunit>): Promise<Subunit> {
    const [subunitRecord] = await db
      .update(subunits)
      .set(subunit)
      .where(eq(subunits.id, id))
      .returning();
    return subunitRecord;
  }

  async deleteSubunit(id: number): Promise<void> {
    await db.delete(subunits).where(eq(subunits.id, id));
  }

  async createWorkflowComment(comment: InsertWorkflowComment): Promise<WorkflowComment> {
    const [wfComment] = await db
      .insert(workflowComments)
      .values(comment)
      .returning();
    return wfComment;
  }

  async getWorkflowComments(workflowId?: number | null): Promise<WorkflowComment[]> {
    if (workflowId) {
      return await db.select().from(workflowComments).where(eq(workflowComments.workflowId, workflowId));
    }
    return await db.select().from(workflowComments);
  }

  async updateWorkflowComment(id: number, comment: Partial<InsertWorkflowComment>): Promise<WorkflowComment> {
    const [wfComment] = await db
      .update(workflowComments)
      .set(comment)
      .where(eq(workflowComments.id, id))
      .returning();
    return wfComment;
  }

  async deleteWorkflowComment(id: number): Promise<void> {
    await db.delete(workflowComments).where(eq(workflowComments.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.updatedAt));
  }
}

export const storage = new DatabaseStorage();
