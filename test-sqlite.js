import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('./data/nbc_portal.db');
console.log('Creating database at:', dbPath);

const db = new Database(dbPath);

// Create all tables from init-db.js
db.exec(`
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    head_of_department INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    department_id INTEGER NOT NULL,
    head_of_unit INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (department_id) REFERENCES departments (id)
  );

  CREATE TABLE IF NOT EXISTS subunits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    unit_id INTEGER NOT NULL,
    head_of_subunit INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (unit_id) REFERENCES units (id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    full_name TEXT NOT NULL,
    company_name TEXT,
    address TEXT,
    nin TEXT,
    cac_number TEXT,
    role TEXT NOT NULL DEFAULT 'applicant',
    department TEXT,
    unit TEXT,
    subunit TEXT,
    position TEXT,
    employee_id TEXT UNIQUE,
    is_verified INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    department_id INTEGER,
    department_role TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    FOREIGN KEY (department_id) REFERENCES departments (id)
  );

  CREATE TABLE IF NOT EXISTS license_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    application_fee REAL NOT NULL,
    license_fee REAL NOT NULL,
    validity_period INTEGER NOT NULL,
    required_documents TEXT,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    license_type_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    proposed_location TEXT,
    status TEXT NOT NULL DEFAULT 'submitted',
    current_stage TEXT DEFAULT 'initial_review',
    progress INTEGER DEFAULT 0,
    submitted_at INTEGER DEFAULT (unixepoch()),
    approved_at INTEGER,
    rejected_at INTEGER,
    rejection_reason TEXT,
    application_data TEXT,
    is_renewal INTEGER DEFAULT 0,
    parent_application_id INTEGER,
    department_id INTEGER,
    assigned_to INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (license_type_id) REFERENCES license_types (id),
    FOREIGN KEY (department_id) REFERENCES departments (id),
    FOREIGN KEY (assigned_to) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS workflow_stages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    department_id INTEGER,
    unit_id INTEGER,
    subunit_id INTEGER,
    description TEXT,
    estimated_duration INTEGER,
    required_documents TEXT,
    assigned_role TEXT DEFAULT 'reviewer',
    can_reject INTEGER DEFAULT 0,
    can_approve INTEGER DEFAULT 0,
    is_required INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (department_id) REFERENCES departments (id),
    FOREIGN KEY (unit_id) REFERENCES units (id),
    FOREIGN KEY (subunit_id) REFERENCES subunits (id)
  );

  CREATE TABLE IF NOT EXISTS application_workflow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    stage_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    assigned_to INTEGER,
    reviewed_by INTEGER,
    reviewed_at INTEGER,
    started_at INTEGER,
    completed_at INTEGER,
    due_date INTEGER,
    priority TEXT DEFAULT 'normal',
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (application_id) REFERENCES applications (id),
    FOREIGN KEY (stage_id) REFERENCES workflow_stages (id),
    FOREIGN KEY (assigned_to) REFERENCES users (id),
    FOREIGN KEY (reviewed_by) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS workflow_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    workflow_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    is_internal INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (application_id) REFERENCES applications (id),
    FOREIGN KEY (workflow_id) REFERENCES application_workflow (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    verified_by INTEGER,
    verified_at INTEGER,
    uploaded_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (application_id) REFERENCES applications (id),
    FOREIGN KEY (verified_by) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    transaction_id TEXT NOT NULL UNIQUE,
    payment_reference TEXT,
    amount REAL NOT NULL,
    payment_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT 'remita',
    paid_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (application_id) REFERENCES applications (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    application_id INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (application_id) REFERENCES applications (id)
  );

  CREATE TABLE IF NOT EXISTS licenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    license_number TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    license_type_id INTEGER NOT NULL,
    issued_at INTEGER DEFAULT (unixepoch()),
    expires_at INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    certificate_path TEXT,
    digital_signature TEXT,
    FOREIGN KEY (application_id) REFERENCES applications (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (license_type_id) REFERENCES license_types (id)
  );

  CREATE TABLE IF NOT EXISTS department_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    permissions TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (department_id) REFERENCES departments (id)
  );

  CREATE TABLE IF NOT EXISTS department_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id INTEGER,
    details TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (department_id) REFERENCES departments (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS department_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id INTEGER NOT NULL,
    metric_type TEXT NOT NULL,
    value INTEGER NOT NULL,
    period TEXT NOT NULL,
    date INTEGER NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (department_id) REFERENCES departments (id)
  );
`);

console.log('All tables created successfully!');
db.close(); 