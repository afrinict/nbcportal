import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer } from 'http';
import { storage } from "./storage";
import { insertUserSchema, insertApplicationSchema, applications as applicationsTable, users as usersTable, departments as departmentsTable } from "@shared/schema";
import { db } from "./db";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const JWT_SECRET = process.env.JWT_SECRET || 'nbc-portal-secret-key';

interface AuthenticatedRequest extends express.Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
    department?: string;
  };
}

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and Word documents are allowed.'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

function generateToken(userId: number, username: string, email: string, role: string, department?: string) {
  return jwt.sign(
    { 
      userId, 
      username, 
      email, 
      role, 
      department 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async function authenticateToken(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      department: decoded.department
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}

export async function registerRoutes(app: express.Express): Promise<express.Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const hashedPassword = await hashPassword(userData.password);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      const token = generateToken(user.id, user.username, user.email, user.role, user.department || undefined);

      res.status(201).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          department: user.department
        },
        token
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log('Login attempt for email:', email);

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log('User not found for email:', email);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log('User found:', { id: user.id, username: user.username, role: user.role });

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        console.log('Invalid password for user:', user.email);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log('Password verified successfully for user:', user.email);

      const token = generateToken(user.id, user.username, user.email, user.role, user.department || undefined);

      console.log('Token generated successfully for user:', user.email);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          department: user.department
        },
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Development endpoint to create test user (remove in production)
  app.post("/api/dev/create-admin", async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: "Not available in production" });
      }

      const passwordHash = await hashPassword('password123');
      
      const user = await storage.createUser({
        username: 'admin',
        email: 'admin@nbc.gov.ng',
        password: passwordHash,
        fullName: 'NBC Administrator',
        phone: '+2348012345680',
        role: 'admin',
        department: null,
        unit: null,
        subunit: null
      });

      console.log('Admin user created:', user);

      res.status(201).json({
        message: "Admin user created successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        credentials: {
          email: 'admin@nbc.gov.ng',
          password: 'password123'
        }
      });
    } catch (error) {
      console.error("Create admin error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        companyName: user.companyName,
        phone: user.phone,
        address: user.address,
        role: user.role,
        department: user.department,
        isVerified: user.isVerified
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // License types
  app.get("/api/license-types", authenticateToken, async (req, res) => {
    try {
      const licenseTypes = await storage.getLicenseTypes();
      res.json(licenseTypes);
    } catch (error) {
      console.error("Get license types error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Applications
  app.post("/api/applications", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Check if user has applicant role
      if (req.user!.role !== 'applicant') {
        return res.status(403).json({ 
          message: "Access denied. Only applicant users can submit license applications." 
        });
      }

      const applicationData = insertApplicationSchema.parse({
        ...req.body,
        userId: req.user!.id
      });

      const application = await storage.createApplication(applicationData);

      const stages = await storage.getWorkflowStages();
      for (const stage of stages) {
        await storage.createApplicationWorkflow({
          applicationId: application.id,
          stageId: stage.id,
          status: 'pending',
          assignedTo: null,
          reviewedBy: null,
          reviewedAt: null,
          startedAt: null,
          completedAt: null,
          dueDate: null,
          priority: 'normal'
        });
      }

      await storage.createNotification({
        userId: req.user!.id,
        title: "Application Submitted",
        message: `Your application ${application.applicationId} has been submitted successfully.`,
        type: "success",
        applicationId: application.id
      });

      res.status(201).json(application);
    } catch (error) {
      console.error("Create application error:", error);
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  app.get("/api/applications", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      let applications;
      
      if (req.user!.role === 'admin' || req.user!.role === 'staff') {
        applications = await storage.getAllApplications();
      } else {
        applications = await storage.getUserApplications(req.user!.id);
      }

      res.json(applications);
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/applications/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (req.user!.role === 'applicant' && application.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(application);
    } catch (error) {
      console.error("Get application error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Document upload
  app.post("/api/applications/:id/documents", authenticateToken, upload.single('document'), async (req: AuthenticatedRequest, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (req.user!.role === 'applicant' && application.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { name, type } = req.body;

      const document = await storage.createDocument({
        applicationId,
        name: name || req.file.originalname,
        type: type || 'general',
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      });

      res.status(201).json(document);
    } catch (error) {
      console.error("Upload document error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/applications/:id/documents", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (req.user!.role === 'applicant' && application.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const documents = await storage.getApplicationDocuments(applicationId);
      res.json(documents);
    } catch (error) {
      console.error("Get documents error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Payments
  app.post("/api/payments", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { applicationId, amount, paymentType } = req.body;

      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (application.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const transactionId = `RMT${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      const payment = await storage.createPayment({
        applicationId,
        userId: req.user!.id,
        transactionId,
        amount,
        paymentType,
        status: 'pending'
      });

      res.status(201).json(payment);
    } catch (error) {
      console.error("Create payment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/payments", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const payments = await storage.getUserPayments(req.user!.id);
      res.json(payments);
    } catch (error) {
      console.error("Get payments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Confirm payment (simulate Remita webhook)
  app.post("/api/payments/:transactionId/confirm", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { transactionId } = req.params;
      const payment = await storage.getPaymentByTransactionId(transactionId);

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      if (payment.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedPayment = await storage.updatePayment(payment.id, {
        status: 'completed'
      });

      await storage.createNotification({
        userId: req.user!.id,
        title: "Payment Confirmed",
        message: `Your payment of ₦${payment.amount} has been confirmed.`,
        type: "success",
        applicationId: payment.applicationId
      });

      res.json(updatedPayment);
    } catch (error) {
      console.error("Confirm payment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Notifications
  app.get("/api/notifications", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.user!.id);
      res.json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/notifications/:id/read", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Profile
  app.patch("/api/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = req.body;
      delete updates.password; // Don't allow password updates through this endpoint
      delete updates.role; // Don't allow role updates
      
      const updatedUser = await storage.updateUser(req.user!.id, updates);
      
      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        companyName: updatedUser.companyName,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Workflow
  app.get("/api/applications/:id/workflow", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const workflow = await storage.getApplicationWorkflow(applicationId);
      res.json(workflow);
    } catch (error) {
      console.error("Get workflow error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Staff endpoints
  app.patch("/api/applications/:id/workflow/:workflowId", 
    authenticateToken, 
    requireRole(['staff', 'admin']), 
    async (req: AuthenticatedRequest, res) => {
      try {
        const workflowId = parseInt(req.params.workflowId);
        const { status } = req.body;

        const workflow = await storage.updateApplicationWorkflow(workflowId, {
          status,
          reviewedBy: req.user!.id,
          reviewedAt: new Date()
        });

        res.json(workflow);
      } catch (error) {
        console.error("Update workflow error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Department endpoints
  app.get("/api/departments", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Get departments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/departments", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const { name, code, description, headOfDepartment } = req.body;
      
      if (!name || !code) {
        return res.status(400).json({ message: "Name and code are required" });
      }

      const department = await storage.createDepartment({
        name,
        code,
        description,
        headOfDepartment
      });

      res.status(201).json(department);
    } catch (error) {
      console.error("Create department error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/departments/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const departmentId = parseInt(req.params.id);
      const { name, code, description, headOfDepartment, isActive } = req.body;

      const department = await storage.updateDepartment(departmentId, {
        name,
        code,
        description,
        headOfDepartment,
        isActive
      });

      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      res.json(department);
    } catch (error) {
      console.error("Update department error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/departments/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const departmentId = parseInt(req.params.id);
      await storage.deleteDepartment(departmentId);
      res.json({ message: "Department deleted successfully" });
    } catch (error) {
      console.error("Delete department error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Unit endpoints
  app.get("/api/units", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const units = await storage.getUnits();
      res.json(units);
    } catch (error) {
      console.error("Get units error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/units", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const { name, code, description, departmentId, headOfUnit } = req.body;
      
      if (!name || !code || !departmentId) {
        return res.status(400).json({ message: "Name, code, and department are required" });
      }

      const unit = await storage.createUnit({
        name,
        code,
        description,
        departmentId,
        headOfUnit
      });

      res.status(201).json(unit);
    } catch (error) {
      console.error("Create unit error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/units/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const unitId = parseInt(req.params.id);
      const { name, code, description, departmentId, headOfUnit, isActive } = req.body;

      const unit = await storage.updateUnit(unitId, {
        name,
        code,
        description,
        departmentId,
        headOfUnit,
        isActive
      });

      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }

      res.json(unit);
    } catch (error) {
      console.error("Update unit error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/units/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const unitId = parseInt(req.params.id);
      await storage.deleteUnit(unitId);
      res.json({ message: "Unit deleted successfully" });
    } catch (error) {
      console.error("Delete unit error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Subunit endpoints
  app.get("/api/subunits", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const subunits = await storage.getSubunits();
      res.json(subunits);
    } catch (error) {
      console.error("Get subunits error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/subunits", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const { name, code, description, unitId, headOfSubunit } = req.body;
      
      if (!name || !code || !unitId) {
        return res.status(400).json({ message: "Name, code, and unit are required" });
      }

      const subunit = await storage.createSubunit({
        name,
        code,
        description,
        unitId,
        headOfSubunit
      });

      res.status(201).json(subunit);
    } catch (error) {
      console.error("Create subunit error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/subunits/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const subunitId = parseInt(req.params.id);
      const { name, code, description, unitId, headOfSubunit, isActive } = req.body;

      const subunit = await storage.updateSubunit(subunitId, {
        name,
        code,
        description,
        unitId,
        headOfSubunit,
        isActive
      });

      if (!subunit) {
        return res.status(404).json({ message: "Subunit not found" });
      }

      res.json(subunit);
    } catch (error) {
      console.error("Update subunit error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/subunits/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const subunitId = parseInt(req.params.id);
      await storage.deleteSubunit(subunitId);
      res.json({ message: "Subunit deleted successfully" });
    } catch (error) {
      console.error("Delete subunit error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Workflow stages endpoints
  app.get("/api/workflow-stages", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const stages = await storage.getWorkflowStages();
      res.json(stages);
    } catch (error) {
      console.error("Get workflow stages error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/workflow-stages", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const { name, description, order, estimatedDuration, requiredDocuments, assignedRole, canReject, canApprove } = req.body;
      
      if (!name || !order) {
        return res.status(400).json({ message: "Name and order are required" });
      }

      const stage = await storage.createWorkflowStage({
        name,
        description,
        order,
        estimatedDuration: estimatedDuration || 1,
        requiredDocuments: requiredDocuments || [],
        assignedRole: assignedRole || 'reviewer',
        canReject: canReject || false,
        canApprove: canApprove || false,
        isRequired: true,
        isActive: true,
        departmentId: null,
        unitId: null,
        subunitId: null
      });

      res.status(201).json(stage);
    } catch (error) {
      console.error("Create workflow stage error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/workflow-stages/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const stageId = parseInt(req.params.id);
      const { name, description, order, estimatedDuration, requiredDocuments, assignedRole, canReject, canApprove, isActive } = req.body;

      const stage = await storage.updateWorkflowStage(stageId, {
        name,
        description,
        order,
        estimatedDuration,
        requiredDocuments,
        assignedRole,
        canReject,
        canApprove,
        isActive
      });

      if (!stage) {
        return res.status(404).json({ message: "Workflow stage not found" });
      }

      res.json(stage);
    } catch (error) {
      console.error("Update workflow stage error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/workflow-stages/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const stageId = parseInt(req.params.id);
      await storage.deleteWorkflowStage(stageId);
      res.json({ message: "Workflow stage deleted successfully" });
    } catch (error) {
      console.error("Delete workflow stage error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Workflow comments endpoints
  app.get("/api/workflow-comments", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const workflowId = req.query.workflowId ? parseInt(req.query.workflowId as string) : null;
      const comments = await storage.getWorkflowComments(workflowId);
      res.json(comments);
    } catch (error) {
      console.error("Get workflow comments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/workflow-comments", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const { applicationId, workflowId, comment, isInternal } = req.body;
      
      if (!applicationId || !workflowId || !comment) {
        return res.status(400).json({ message: "Application ID, workflow ID, and comment are required" });
      }

      const workflowComment = await storage.createWorkflowComment({
        applicationId,
        workflowId,
        userId: req.user!.id,
        comment,
        isInternal: isInternal || false
      });

      res.status(201).json(workflowComment);
    } catch (error) {
      console.error("Create workflow comment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/workflow-comments/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const { comment, isInternal } = req.body;

      const workflowComment = await storage.updateWorkflowComment(commentId, {
        comment,
        isInternal
      });

      if (!workflowComment) {
        return res.status(404).json({ message: "Workflow comment not found" });
      }

      res.json(workflowComment);
    } catch (error) {
      console.error("Update workflow comment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/workflow-comments/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const commentId = parseInt(req.params.id);
      await storage.deleteWorkflowComment(commentId);
      res.json({ message: "Workflow comment deleted successfully" });
    } catch (error) {
      console.error("Delete workflow comment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User management endpoints
  app.get("/api/users", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      // For now, we'll return all users. In a real app, you might want pagination
      const allUsers = await storage.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const { username, email, password, fullName, role, department, status } = req.body;
      
      if (!username || !email || !password || !fullName || !role) {
        return res.status(400).json({ message: "Username, email, password, fullName, and role are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);
      
      // Create the user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        fullName,
        role,
        department: department || null,
        status: status || 'active',
        phone: '', // Required field, set default
        companyName: null,
        address: null,
        nin: null,
        cacNumber: null,
        unit: null,
        subunit: null,
        position: null,
        employeeId: null,
        isVerified: false
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/users/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { username, email, fullName, role, department, status, password } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== existingUser.email) {
        const userWithEmail = await storage.getUserByEmail(email);
        if (userWithEmail && userWithEmail.id !== userId) {
          return res.status(400).json({ message: "Email already taken by another user" });
        }
      }

      // Check if username is being changed and if it's already taken
      if (username && username !== existingUser.username) {
        const userWithUsername = await storage.getUserByUsername(username);
        if (userWithUsername && userWithUsername.id !== userId) {
          return res.status(400).json({ message: "Username already taken by another user" });
        }
      }

      // Prepare update data
      const updateData: any = {
        username: username || existingUser.username,
        email: email || existingUser.email,
        fullName: fullName || existingUser.fullName,
        role: role || existingUser.role,
        department: department !== undefined ? department : existingUser.department,
        status: status !== undefined ? status : existingUser.status
      };

      // Hash password if provided
      if (password) {
        updateData.password = await hashPassword(password);
      }

      // Update the user
      const updatedUser = await storage.updateUser(userId, updateData);

      // Return user without password
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/users/:id", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent deleting the current user
      if (userId === req.user!.id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      // Soft delete by setting status to inactive
      await storage.updateUser(userId, { status: 'inactive' });
      
      res.json({ message: "User deactivated successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id/activate", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Activate the user
      const updatedUser = await storage.updateUser(userId, { status: 'active' });
      
      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Activate user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id/deactivate", authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent deactivating the current user
      if (userId === req.user!.id) {
        return res.status(400).json({ message: "Cannot deactivate your own account" });
      }

      // Deactivate the user
      const updatedUser = await storage.updateUser(userId, { status: 'inactive' });
      
      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Deactivate user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/dashboard', authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Get user to check role
      const user = await storage.getUser(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Get applications data
      const applications = await db.select().from(applicationsTable);
      
      // Get users data
      const users = await db.select().from(usersTable);
      
      // Get departments data
      const departments = await db.select().from(departmentsTable);

      // Calculate monthly data for the last 12 months
      const monthlyData = [];
      const currentDate = new Date();
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const count = applications.filter(app => {
          const appDate = new Date(app.created_at);
          return appDate >= monthStart && appDate <= monthEnd;
        }).length;
        
        monthlyData.push({ 
          month: monthName, 
          count,
          date: date.toISOString().split('T')[0]
        });
      }

      // Calculate daily data for the last 30 days
      const dailyData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const count = applications.filter(app => {
          const appDate = new Date(app.created_at);
          return appDate.toDateString() === date.toDateString();
        }).length;
        
        dailyData.push({ 
          day: dayName, 
          count,
          date: date.toISOString().split('T')[0]
        });
      }

      // Calculate status distribution
      const statusCounts = {};
      applications.forEach(app => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
      });
      
      const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
        count,
        percentage: Math.round((count / applications.length) * 100)
      }));

      // Calculate license type distribution
      const licenseTypeCounts = {};
      const licenseTypeNames = {
        1: 'Broadcasting License',
        2: 'Cable TV License',
        3: 'Satellite License',
        4: 'Radio License',
        5: 'TV License'
      };
      
      applications.forEach(app => {
        licenseTypeCounts[app.licenseTypeId] = (licenseTypeCounts[app.licenseTypeId] || 0) + 1;
      });
      
      const licenseTypeDistribution = Object.entries(licenseTypeCounts).map(([type, count]) => ({
        type: licenseTypeNames[parseInt(type)] || `Type ${type}`,
        count,
        percentage: Math.round((count / applications.length) * 100)
      }));

      // Calculate user role distribution
      const roleCounts = {};
      users.forEach(user => {
        roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
      });
      
      const roleDistribution = Object.entries(roleCounts).map(([role, count]) => ({
        role: role.charAt(0).toUpperCase() + role.slice(1),
        count,
        percentage: Math.round((count / users.length) * 100)
      }));

      // Calculate department performance
      const departmentStats = departments.map(dept => {
        const deptUsers = users.filter(user => user.department === dept.name);
        return {
          name: dept.name,
          applications: applications.length, // Simplified for now
          users: deptUsers.length,
          efficiency: Math.round((applications.length / Math.max(deptUsers.length, 1)) * 100) / 100
        };
      });

      // Calculate performance metrics
      const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      
      const applicationsThisMonth = applications.filter(app => 
        new Date(app.created_at) >= thisMonth
      ).length;
      
      const applicationsLastMonth = applications.filter(app => 
        new Date(app.created_at) >= lastMonth && new Date(app.created_at) < thisMonth
      ).length;

      const growthRate = applicationsLastMonth > 0 
        ? ((applicationsThisMonth - applicationsLastMonth) / applicationsLastMonth) * 100 
        : 0;

      // Calculate average processing time
      const processingTimes = applications.map(app => {
        const created = new Date(app.created_at);
        const updated = new Date(app.updated_at || app.created_at);
        return Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      });
      
      const averageProcessingTime = processingTimes.length > 0 
        ? Math.round(processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length)
        : 0;

      // Calculate completion rate
      const completedApplications = applications.filter(app => 
        ['approved', 'rejected'].includes(app.status)
      ).length;
      
      const completionRate = applications.length > 0 
        ? Math.round((completedApplications / applications.length) * 100)
        : 0;

      const analyticsData = {
        applications: {
          total: applications.length,
          pending: applications.filter(app => app.status === 'pending').length,
          approved: applications.filter(app => app.status === 'approved').length,
          rejected: applications.filter(app => app.status === 'rejected').length,
          inReview: applications.filter(app => app.status === 'in_review').length,
          monthlyData,
          dailyData,
          statusDistribution,
          licenseTypeDistribution,
          completionRate
        },
        users: {
          total: users.length,
          active: users.filter(user => user.status === 'active').length,
          inactive: users.filter(user => user.status === 'inactive').length,
          roleDistribution,
          newUsersThisMonth: users.filter(user => 
            new Date(user.createdAt) >= thisMonth
          ).length
        },
        departments: {
          total: departments.length,
          activeDepartments: departments.length,
          departmentStats
        },
        performance: {
          averageProcessingTime,
          applicationsThisMonth,
          applicationsLastMonth,
          growthRate: Math.round(growthRate * 100) / 100,
          completionRate,
          efficiency: Math.round((completionRate / Math.max(averageProcessingTime, 1)) * 100) / 100
        }
      };

      res.json(analyticsData);
    } catch (error) {
      console.error('Analytics dashboard error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Enhanced analytics routes with filtering
  app.get('/api/analytics/applications', authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await storage.getUser(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const { startDate, endDate, status, licenseType } = req.query;
      
      let applications = await db.select().from(applicationsTable);
      
      // Apply filters
      if (startDate && endDate) {
        applications = applications.filter(app => {
          const appDate = new Date(app.created_at);
          return appDate >= new Date(startDate as string) && appDate <= new Date(endDate as string);
        });
      }
      
      if (status) {
        applications = applications.filter(app => app.status === status);
      }
      
      if (licenseType) {
        applications = applications.filter(app => app.licenseTypeId === parseInt(licenseType as string));
      }

      const statusDistribution = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      res.json({
        total: applications.length,
        statusDistribution: Object.entries(statusDistribution).map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
          count,
          percentage: Math.round((count / applications.length) * 100)
        })),
        applications: applications.slice(0, 100) // Limit for performance
      });
    } catch (error) {
      console.error('Applications analytics error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/analytics/users', authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await storage.getUser(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const { startDate, endDate, role, status } = req.query;
      
      let users = await db.select().from(usersTable);
      
      // Apply filters
      if (startDate && endDate) {
        users = users.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate >= new Date(startDate as string) && userDate <= new Date(endDate as string);
        });
      }
      
      if (role) {
        users = users.filter(user => user.role === role);
      }
      
      if (status) {
        users = users.filter(user => user.status === status);
      }

      const roleDistribution = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      res.json({
        total: users.length,
        active: users.filter(user => user.status === 'active').length,
        inactive: users.filter(user => user.status === 'inactive').length,
        roleDistribution: Object.entries(roleDistribution).map(([role, count]) => ({
          role: role.charAt(0).toUpperCase() + role.slice(1),
          count,
          percentage: Math.round((count / users.length) * 100)
        })),
        users: users.slice(0, 100) // Limit for performance
      });
    } catch (error) {
      console.error('Users analytics error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/analytics/departments', authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await storage.getUser(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const departments = await db.select().from(departmentsTable);
      const users = await db.select().from(usersTable);
      const applications = await db.select().from(applicationsTable);

      const departmentStats = departments.map(dept => {
        const deptUsers = users.filter(user => user.department === dept.name);
        const deptApplications = applications.filter(app => {
          // This would need proper relationship mapping in a real scenario
          return true; // For now, showing all applications
        });
        
        return {
          name: dept.name,
          applications: deptApplications.length,
          users: deptUsers.length,
          efficiency: Math.round((deptApplications.length / Math.max(deptUsers.length, 1)) * 100) / 100,
          activeUsers: deptUsers.filter(user => user.status === 'active').length
        };
      });

      res.json({
        total: departments.length,
        activeDepartments: departments.length,
        departmentStats
      });
    } catch (error) {
      console.error('Departments analytics error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/analytics/performance', authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await storage.getUser(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const applications = await db.select().from(applicationsTable);

      const currentDate = new Date();
      const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastYear = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
      
      const applicationsThisMonth = applications.filter(app => 
        new Date(app.created_at) >= thisMonth
      ).length;
      
      const applicationsLastMonth = applications.filter(app => 
        new Date(app.created_at) >= lastMonth && new Date(app.created_at) < thisMonth
      ).length;

      const applicationsLastYear = applications.filter(app => 
        new Date(app.created_at) >= lastYear && new Date(app.created_at) < thisMonth
      ).length;

      const growthRate = applicationsLastMonth > 0 
        ? ((applicationsThisMonth - applicationsLastMonth) / applicationsLastMonth) * 100 
        : 0;

      const yearlyGrowthRate = applicationsLastYear > 0
        ? ((applicationsThisMonth - applicationsLastYear) / applicationsLastYear) * 100
        : 0;

      // Calculate processing times
      const processingTimes = applications.map(app => {
        const created = new Date(app.created_at);
        const updated = new Date(app.updated_at || app.created_at);
        return Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      });
      
      const averageProcessingTime = processingTimes.length > 0 
        ? Math.round(processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length)
        : 0;

      const minProcessingTime = Math.min(...processingTimes);
      const maxProcessingTime = Math.max(...processingTimes);

      // Calculate completion metrics
      const completedApplications = applications.filter(app => 
        ['approved', 'rejected'].includes(app.status)
      ).length;
      
      const completionRate = applications.length > 0 
        ? Math.round((completedApplications / applications.length) * 100)
        : 0;

      const approvalRate = completedApplications > 0
        ? Math.round((applications.filter(app => app.status === 'approved').length / completedApplications) * 100)
        : 0;

      res.json({
        averageProcessingTime,
        minProcessingTime,
        maxProcessingTime,
        applicationsThisMonth,
        applicationsLastMonth,
        applicationsLastYear,
        growthRate: Math.round(growthRate * 100) / 100,
        yearlyGrowthRate: Math.round(yearlyGrowthRate * 100) / 100,
        completionRate,
        approvalRate,
        efficiency: Math.round((completionRate / Math.max(averageProcessingTime, 1)) * 100) / 100
      });
    } catch (error) {
      console.error('Performance analytics error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // New route for generating custom reports
  app.post('/api/analytics/reports', authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await storage.getUser(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const { 
        reportType, 
        startDate, 
        endDate, 
        filters = {},
        format = 'json' 
      } = req.body;

      if (!reportType || !startDate || !endDate) {
        return res.status(400).json({ message: 'Report type, start date, and end date are required' });
      }

      let applications = await db.select().from(applicationsTable);
      let users = await db.select().from(usersTable);
      let departments = await db.select().from(departmentsTable);

      // Apply date filters
      applications = applications.filter(app => {
        const appDate = new Date(app.created_at);
        return appDate >= new Date(startDate) && appDate <= new Date(endDate);
      });

      users = users.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate >= new Date(startDate) && userDate <= new Date(endDate);
      });

      // Apply additional filters
      if (filters.status) {
        applications = applications.filter(app => app.status === filters.status);
      }

      if (filters.role) {
        users = users.filter(user => user.role === filters.role);
      }

      if (filters.department) {
        users = users.filter(user => user.department === filters.department);
      }

      let reportData = {};

      switch (reportType) {
        case 'applications_summary':
          reportData = {
            total: applications.length,
            byStatus: applications.reduce((acc, app) => {
              acc[app.status] = (acc[app.status] || 0) + 1;
              return acc;
            }, {}),
            byLicenseType: applications.reduce((acc, app) => {
              acc[app.licenseTypeId] = (acc[app.licenseTypeId] || 0) + 1;
              return acc;
            }, {}),
            dailyBreakdown: applications.reduce((acc, app) => {
              const date = new Date(app.created_at).toISOString().split('T')[0];
              acc[date] = (acc[date] || 0) + 1;
              return acc;
            }, {})
          };
          break;

        case 'user_activity':
          reportData = {
            totalUsers: users.length,
            activeUsers: users.filter(user => user.status === 'active').length,
            byRole: users.reduce((acc, user) => {
              acc[user.role] = (acc[user.role] || 0) + 1;
              return acc;
            }, {}),
            byDepartment: users.reduce((acc, user) => {
              acc[user.department || 'Unassigned'] = (acc[user.department || 'Unassigned'] || 0) + 1;
              return acc;
            }, {}),
            registrationTrend: users.reduce((acc, user) => {
              const date = new Date(user.created_at).toISOString().split('T')[0];
              acc[date] = (acc[date] || 0) + 1;
              return acc;
            }, {})
          };
          break;

        case 'performance_metrics':
          const processingTimes = applications.map(app => {
            const created = new Date(app.created_at);
            const updated = new Date(app.updated_at || app.created_at);
            return Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          });

          reportData = {
            averageProcessingTime: processingTimes.length > 0 
              ? Math.round(processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length)
              : 0,
            completionRate: applications.length > 0 
              ? Math.round((applications.filter(app => ['approved', 'rejected'].includes(app.status)).length / applications.length) * 100)
              : 0,
            applicationsPerDay: applications.length / Math.max(Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)), 1),
            processingTimeDistribution: processingTimes.reduce((acc, time) => {
              const range = time <= 7 ? '0-7 days' : time <= 14 ? '8-14 days' : time <= 30 ? '15-30 days' : '30+ days';
              acc[range] = (acc[range] || 0) + 1;
              return acc;
            }, {})
          };
          break;

        default:
          return res.status(400).json({ message: 'Invalid report type' });
      }

      // Add metadata
      const report = {
        type: reportType,
        generatedAt: new Date().toISOString(),
        dateRange: { startDate, endDate },
        filters,
        data: reportData
      };

      if (format === 'csv') {
        // Convert to CSV format (simplified)
        const csvData = convertToCSV(reportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${reportType}_${startDate}_${endDate}.csv"`);
        return res.send(csvData);
      }

      res.json(report);
    } catch (error) {
      console.error('Report generation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Helper function to convert data to CSV
  function convertToCSV(data: any): string {
    if (typeof data === 'object' && data !== null) {
      const rows = [];
      const keys = Object.keys(data);
      
      // Add header
      rows.push(keys.join(','));
      
      // Add data row
      const values = keys.map(key => {
        const value = data[key];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      rows.push(values.join(','));
      
      return rows.join('\n');
    }
    return '';
  }

  const httpServer = createServer(app);
  return httpServer;
}
