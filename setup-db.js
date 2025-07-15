import bcrypt from 'bcrypt';
import path from 'path';
import { db } from './server/db.ts';
import { users, departments, units, subunits, licenseTypes } from './shared/schema.ts';

const dbPath = 'F:/Projects/NBC/data/nbc_portal.db';
console.log('Using database at:', dbPath);
// The rest of the setup script uses drizzle-orm, which will use this path via db.ts

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create departments
    const [dept1] = await db.insert(departments).values({
      name: 'Technical Standards',
      code: 'TECH',
      description: 'Technical standards and compliance',
      headOfDepartment: null,
      isActive: true
    }).returning();

    const [dept2] = await db.insert(departments).values({
      name: 'Licensing',
      code: 'LIC',
      description: 'License management and processing',
      headOfDepartment: null,
      isActive: true
    }).returning();

    console.log('Departments created:', dept1, dept2);

    // Create units
    const [unit1] = await db.insert(units).values({
      name: 'Broadcasting Standards',
      code: 'BS',
      description: 'Broadcasting standards enforcement',
      departmentId: dept1.id,
      headOfUnit: null,
      isActive: true
    }).returning();

    const [unit2] = await db.insert(units).values({
      name: 'License Processing',
      code: 'LP',
      description: 'License application processing',
      departmentId: dept2.id,
      headOfUnit: null,
      isActive: true
    }).returning();

    console.log('Units created:', unit1, unit2);

    // Create subunits
    const [subunit1] = await db.insert(subunits).values({
      name: 'FM Radio Standards',
      code: 'FMR',
      description: 'FM Radio broadcasting standards',
      unitId: unit1.id,
      headOfSubunit: null,
      isActive: true
    }).returning();

    const [subunit2] = await db.insert(subunits).values({
      name: 'TV Standards',
      code: 'TVS',
      description: 'Television broadcasting standards',
      unitId: unit1.id,
      headOfSubunit: null,
      isActive: true
    }).returning();

    console.log('Subunits created:', subunit1, subunit2);

    // Create license types
    const licenseTypeData = [
      { name: 'FM Radio License', category: 'FM', description: 'Frequency Modulation Radio Broadcasting License', applicationFee: 50000, licenseFee: 50000, validityPeriod: 5, isActive: true },
      { name: 'AM Radio License', category: 'AM', description: 'Amplitude Modulation Radio Broadcasting License', applicationFee: 50000, licenseFee: 50000, validityPeriod: 5, isActive: true },
      { name: 'Television License', category: 'TV', description: 'Television Broadcasting License', applicationFee: 50000, licenseFee: 50000, validityPeriod: 5, isActive: true },
      { name: 'DTH License', category: 'DTH', description: 'Direct-to-Home Satellite Broadcasting License', applicationFee: 50000, licenseFee: 50000, validityPeriod: 5, isActive: true }
    ];

    const licenseTypesCreated = await db.insert(licenseTypes).values(licenseTypeData).returning();
    console.log('License types created:', licenseTypesCreated);

    // Hash passwords
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
        departmentId: dept1.id,
        unitId: unit1.id,
        subunitId: subunit1.id,
        isActive: true
      },
      {
        username: 'admin',
        email: 'admin@nbc.gov.ng',
        password: passwordHash,
        fullName: 'NBC Administrator',
        phone: '+2348012345680',
        role: 'admin',
        departmentId: dept2.id,
        unitId: unit2.id,
        subunitId: null,
        isActive: true
      }
    ];

    const usersCreated = await db.insert(users).values(userData).returning();
    console.log('Users created:', usersCreated.map(u => ({ username: u.username, email: u.email, role: u.role })));

    console.log('Database setup completed successfully!');
    console.log('\nLogin credentials:');
    console.log('1. Applicant: testuser@example.com / password123');
    console.log('2. Staff: staff@nbc.gov.ng / password123');
    console.log('3. Admin: admin@nbc.gov.ng / password123');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    process.exit(0);
  }
}

setupDatabase(); 