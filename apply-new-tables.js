import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Samolan123@localhost:5456/nbc2';
const client = postgres(connectionString);

async function applyNewTables() {
  try {
    console.log('Applying new department tables...');

    // Create department_activities table
    await client`
      CREATE TABLE IF NOT EXISTS "department_activities" (
        "id" serial PRIMARY KEY NOT NULL,
        "department_id" integer NOT NULL,
        "user_id" integer NOT NULL,
        "action" text NOT NULL,
        "resource_type" text NOT NULL,
        "resource_id" integer,
        "details" jsonb,
        "created_at" timestamp DEFAULT now()
      )
    `;
    console.log('✓ Created department_activities table');

    // Create department_metrics table
    await client`
      CREATE TABLE IF NOT EXISTS "department_metrics" (
        "id" serial PRIMARY KEY NOT NULL,
        "department_id" integer NOT NULL,
        "metric_type" text NOT NULL,
        "value" integer NOT NULL,
        "period" text NOT NULL,
        "date" timestamp NOT NULL,
        "created_at" timestamp DEFAULT now()
      )
    `;
    console.log('✓ Created department_metrics table');

    // Create department_permissions table
    await client`
      CREATE TABLE IF NOT EXISTS "department_permissions" (
        "id" serial PRIMARY KEY NOT NULL,
        "department_id" integer NOT NULL,
        "role" text NOT NULL,
        "permissions" jsonb NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `;
    console.log('✓ Created department_permissions table');

    // Add foreign key constraints
    await client`
      ALTER TABLE "department_activities" 
      ADD CONSTRAINT IF NOT EXISTS "department_activities_department_id_departments_id_fk" 
      FOREIGN KEY ("department_id") REFERENCES "departments"("id")
    `;
    console.log('✓ Added department_activities foreign key');

    await client`
      ALTER TABLE "department_activities" 
      ADD CONSTRAINT IF NOT EXISTS "department_activities_user_id_users_id_fk" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
    `;
    console.log('✓ Added department_activities user foreign key');

    await client`
      ALTER TABLE "department_metrics" 
      ADD CONSTRAINT IF NOT EXISTS "department_metrics_department_id_departments_id_fk" 
      FOREIGN KEY ("department_id") REFERENCES "departments"("id")
    `;
    console.log('✓ Added department_metrics foreign key');

    await client`
      ALTER TABLE "department_permissions" 
      ADD CONSTRAINT IF NOT EXISTS "department_permissions_department_id_departments_id_fk" 
      FOREIGN KEY ("department_id") REFERENCES "departments"("id")
    `;
    console.log('✓ Added department_permissions foreign key');

    console.log('\n✅ All new department tables created successfully!');

  } catch (error) {
    console.error('Error applying new tables:', error);
  } finally {
    await client.end();
  }
}

// Run the setup
applyNewTables(); 