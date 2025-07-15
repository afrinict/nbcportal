import postgres from 'postgres';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:Samolan123@localhost:5456/nbc2";

console.log('Connecting to database:', DATABASE_URL);

const sql = postgres(DATABASE_URL);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const result = await sql`
      INSERT INTO users (username, email, password, phone, full_name, role, is_verified)
      VALUES ('admin', 'admin@nbc.gov.ng', ${hashedPassword}, '08012345678', 'NBC Administrator', 'admin', true)
      RETURNING id, username, email, role
    `;
    
    console.log('Admin user created successfully:', result[0]);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sql.end();
  }
}

createAdminUser(); 