import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:Samolan123@localhost:5456/nbc2');

async function checkUsersTable() {
  try {
    console.log('Checking users table structure...');
    
    // Get table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('\nUsers table columns:');
    columns.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Check if there are any users
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`\nTotal users: ${userCount[0].count}`);
    
    // Get a sample user
    const sampleUser = await sql`SELECT * FROM users LIMIT 1`;
    if (sampleUser.length > 0) {
      console.log('\nSample user:');
      console.log(JSON.stringify(sampleUser[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error checking users table:', error);
  } finally {
    await sql.end();
  }
}

checkUsersTable(); 