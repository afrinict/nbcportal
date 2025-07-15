import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL);

async function createApplicant() {
  try {
    console.log('Creating applicant user...');
    
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const [user] = await sql`
      INSERT INTO users (
        username, 
        email, 
        password, 
        full_name, 
        phone, 
        role, 
        department, 
        unit, 
        subunit,
        is_verified
      ) VALUES (
        'applicant1',
        'applicant@example.com',
        ${passwordHash},
        'John Applicant',
        '+2348012345678',
        'applicant',
        null,
        null,
        null,
        true
      ) RETURNING id, username, email, role
    `;
    
    console.log('Applicant user created successfully:');
    console.log('ID:', user.id);
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('\nLogin credentials:');
    console.log('Email: applicant@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error creating applicant user:', error);
  } finally {
    await sql.end();
  }
}

createApplicant(); 