import { db } from './server/db.ts';

async function checkDatabase() {
  try {
    console.log('Checking database structure...');
    
    // Check if users table exists and get its structure
    const result = await db.execute(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\nUsers table structure:');
    if (result && result.rows) {
      result.rows.forEach(row => {
        console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    } else {
      console.log('No columns found or result structure is different');
      console.log('Result:', result);
    }
    
    // Check if there are any users
    const userCount = await db.execute('SELECT COUNT(*) as count FROM users');
    console.log(`\nTotal users in database: ${userCount.rows ? userCount.rows[0].count : 'Unknown'}`);
    
    // Get sample user data
    const sampleUsers = await db.execute('SELECT id, username, email, role, status FROM users LIMIT 5');
    console.log('\nSample users:');
    if (sampleUsers && sampleUsers.rows) {
      sampleUsers.rows.forEach(user => {
        console.log(`- ${user.email} (${user.username}) - Role: ${user.role} - Status: ${user.status}`);
      });
    } else {
      console.log('No users found or result structure is different');
      console.log('Sample users result:', sampleUsers);
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    process.exit(0);
  }
}

checkDatabase(); 