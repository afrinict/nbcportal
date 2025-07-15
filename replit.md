# NBC License Portal

## Overview

The NBC License Portal is a full-stack web application for the National Broadcasting Commission of Nigeria. It enables applicants to submit and track broadcasting license applications, manage documents, process payments, and provides administrative capabilities for NBC staff. The application features a React-based frontend, Express.js backend, PostgreSQL database with Drizzle ORM, and comprehensive authentication and authorization.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom NBC theme variables
- **State Management**: TanStack Query for server state, React Context for authentication
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with custom configuration for monorepo structure

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with middleware-based architecture
- **File Handling**: Multer for document uploads with local storage
- **Development**: tsx for development server, esbuild for production builds

### Database Architecture
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle with connection pooling
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: WebSocket-based connection via @neondatabase/serverless

## Key Components

### Authentication System
- JWT-based authentication with 24-hour tokens
- bcrypt for password hashing (10 rounds)
- Role-based access control (applicant, staff, admin)
- Middleware for route protection and user context injection

### License Management
- Multiple license types (FM, AM, TV, DTH) with configurable fees
- Application workflow with status tracking
- Document requirements management
- Progress tracking through application stages

### Document Management
- File upload system with type validation (PDF, images, Word documents)
- 10MB file size limit
- Unique filename generation with timestamps
- Document verification status tracking

### Payment Processing
- Transaction ID generation and tracking
- Payment status management (pending, completed, failed)
- Revenue calculation and reporting capabilities

### User Management
- Multi-role user system with different access levels
- Profile management with company information
- NIN and CAC number validation
- Department assignment for staff users

## Data Flow

### Application Submission Flow
1. User authentication and authorization check
2. License type selection with fee calculation
3. Application form completion with validation
4. Document upload and verification
5. Payment processing and confirmation
6. Application status tracking and notifications

### Administrative Workflow
1. Staff/admin authentication
2. Application review and status updates
3. Document verification
4. Payment confirmation
5. License issuance
6. Reporting and analytics

### Document Processing
1. File upload with validation
2. Unique filename generation
3. Storage in local uploads directory
4. Database record creation with metadata
5. Verification status tracking

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection with WebSocket support
- **drizzle-orm**: Type-safe database operations
- **bcrypt**: Secure password hashing
- **jsonwebtoken**: JWT token generation and verification
- **multer**: File upload handling
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React routing

### UI Dependencies
- **@radix-ui/***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management
- **lucide-react**: Icon library

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Frontend build tool with HMR
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Development Environment
- Replit configuration with Node.js 20, PostgreSQL 16, and web modules
- Vite development server on port 5000
- Hot module replacement for rapid development
- Automatic database provisioning

### Production Build
1. Frontend build via Vite to `dist/public`
2. Backend bundle via esbuild to `dist/index.js`
3. Static file serving from Express
4. Environment variable configuration for database and JWT secrets

### Database Management
- Drizzle migrations in `./migrations` directory
- Schema definition in `shared/schema.ts`
- Database push command for development: `npm run db:push`

## Changelog
- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.