import bcrypt from 'bcrypt';
import { db } from './server/db.ts';
import { users } from './shared/schema.ts';

async function createUsers() {
  try {
    console.log('Creating users...');

    // Check if users already exist
    const existingUsers = await db.select().from(users);
    console.log('Existing users:', existingUsers.length);

    if (existingUsers.length > 0) {
      console.log('Users already exist. Skipping creation.');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create users
    const userData = [
      {
        username: 'testuser',
        email: 'testuser@example.com',
        password: passwordHash,
        fullName: 'Test User',
        phone: '+2348012345678',
        role: 'applicant',
        departmentId: null,
        unitId: null,
        subunitId: null,
        isActive: true
      },
      {
        username: 'staff',
        email: 'staff@nbc.gov.ng',
        password: passwordHash,
        fullName: 'NBC Staff',
        phone: '+2348012345679',
        role: 'staff',
        departmentId: null,
        unitId: null,
        subunitId: null,
        isActive: true
      },
      {
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
      }
    ];

    const createdUsers = await db.insert(users).values(userData).returning();
    console.log('Users created successfully:', createdUsers.map(u => ({ username: u.username, email: u.email, role: u.role })));

    console.log('\nLogin credentials:');
    console.log('1. Applicant: testuser@example.com / password123');
    console.log('2. Staff: staff@nbc.gov.ng / password123');
    console.log('3. Admin: admin@nbc.gov.ng / password123');

  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    process.exit(0);
  }
}

createUsers(); 