import bcrypt from 'bcrypt';
import { db } from './server/db.ts';
import { users } from './shared/schema.ts';

async function testAuth() {
  try {
    console.log('Testing authentication system...');
    
    // Check if users exist
    const existingUsers = await db.select().from(users);
    console.log('Existing users:', existingUsers.length);
    
    if (existingUsers.length === 0) {
      console.log('No users found. Creating test admin user...');
      
      // Create admin user
      const passwordHash = await bcrypt.hash('password123', 10);
      
      const [adminUser] = await db.insert(users).values({
        username: 'admin',
        email: 'admin@nbc.gov.ng',
        password: passwordHash,
        fullName: 'NBC Administrator',
        phone: '+2348012345680',
        role: 'admin',
        departmentId: null,
        unitId: null,
        subunitId: null,
        isActive: true
      }).returning();
      
      console.log('Admin user created:', adminUser);
    } else {
      console.log('Users found:', existingUsers.map(u => ({ username: u.username, email: u.email, role: u.role })));
    }
    
    // Test password verification
    const testPassword = 'password123';
    const testHash = await bcrypt.hash(testPassword, 10);
    const isValid = await bcrypt.compare(testPassword, testHash);
    console.log('Password verification test:', isValid);
    
    console.log('\nTest credentials:');
    console.log('Email: admin@nbc.gov.ng');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error testing auth:', error);
  } finally {
    process.exit(0);
  }
}

testAuth(); 