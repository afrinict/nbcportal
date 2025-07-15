import postgres from 'postgres';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:Samolan123@localhost:5456/nbc2";

console.log('Testing login logic...');

const sql = postgres(DATABASE_URL);

async function testLogin() {
  try {
    console.log('1. Testing database connection...');
    const result = await sql`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    
    console.log('2. Checking users table...');
    const users = await sql`SELECT id, username, email, role, password FROM users`;
    console.log('Users in database:', users.length);
    
    if (users.length > 0) {
      const user = users[0];
      console.log('3. Testing password verification...');
      console.log('User email:', user.email);
      console.log('User role:', user.role);
      console.log('Password hash length:', user.password.length);
      
      const isValidPassword = await bcrypt.compare('password123', user.password);
      console.log('Password verification result:', isValidPassword);
      
      if (isValidPassword) {
        console.log('✅ Login should work!');
      } else {
        console.log('❌ Password verification failed');
      }
    } else {
      console.log('❌ No users found in database');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sql.end();
  }
}

testLogin(); 