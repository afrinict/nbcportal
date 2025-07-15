#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envTemplates = {
  development: `# Database Configuration (SQLite for local development)
DATABASE_URL=./nbc_portal.db

# JWT Configuration
JWT_SECRET=${crypto.randomBytes(32).toString('hex')}

# Environment
NODE_ENV=development

# Server Configuration
PORT=5000

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Optional: Database Pool Configuration
DB_POOL_MIN=2
DB_POOL_MAX=10

# Optional: File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Optional: Logging
LOG_LEVEL=debug
`,

  production: `# Database Configuration
DATABASE_URL=your-production-database-url

# JWT Configuration
JWT_SECRET=${crypto.randomBytes(32).toString('hex')}

# Environment
NODE_ENV=production

# Server Configuration
PORT=5000

# CORS Configuration
CORS_ORIGIN=https://your-domain.com

# Optional: Database Pool Configuration
DB_POOL_MIN=5
DB_POOL_MAX=20

# Optional: File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: Redis Configuration
REDIS_URL=redis://localhost:6379

# Optional: Logging
LOG_LEVEL=warn
`,

  staging: `# Database Configuration
DATABASE_URL=your-staging-database-url

# JWT Configuration
JWT_SECRET=${crypto.randomBytes(32).toString('hex')}

# Environment
NODE_ENV=staging

# Server Configuration
PORT=5000

# CORS Configuration
CORS_ORIGIN=https://staging.your-domain.com

# Optional: Database Pool Configuration
DB_POOL_MIN=3
DB_POOL_MAX=15

# Optional: File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Optional: Logging
LOG_LEVEL=info
`
};

function generateEnvFile(environment = 'development') {
  const template = envTemplates[environment];
  
  if (!template) {
    console.error(`❌ Unknown environment: ${environment}`);
    console.log('Available environments: development, staging, production');
    process.exit(1);
  }

  const envPath = path.join(process.cwd(), '.env');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Creating backup...');
    const backupPath = path.join(process.cwd(), '.env.backup');
    fs.copyFileSync(envPath, backupPath);
    console.log(`✅ Backup created: .env.backup`);
  }

  fs.writeFileSync(envPath, template);
  console.log(`✅ Generated .env file for ${environment} environment`);
  console.log(`📁 Location: ${envPath}`);
  
  if (environment === 'development') {
    console.log('\n🚀 Next steps:');
    console.log('1. Review and update the generated .env file');
    console.log('2. Run: npm run dev');
  } else {
    console.log('\n🔧 Remember to:');
    console.log('1. Update DATABASE_URL with your actual database URL');
    console.log('2. Update CORS_ORIGIN with your actual domain');
    console.log('3. Configure email settings if needed');
  }
}

function showHelp() {
  console.log(`
🔧 NBC Portal Environment Setup

Usage:
  node scripts/setup-env.js [environment]

Environments:
  development  - Local development with SQLite (default)
  staging      - Staging environment
  production   - Production environment

Examples:
  node scripts/setup-env.js
  node scripts/setup-env.js development
  node scripts/setup-env.js staging
  node scripts/setup-env.js production

Note: This script will generate a .env file with appropriate defaults.
For production, you should update the values with your actual configuration.
`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const environment = args[0] || 'development';

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

if (args.length > 1) {
  console.error('❌ Too many arguments');
  showHelp();
  process.exit(1);
}

console.log(`🔧 Setting up environment for: ${environment}`);
generateEnvFile(environment); 