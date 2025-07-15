import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:Samolan123@localhost:5456/nbc2');

async function fixUsersSchema() {
  try {
    console.log('Fixing users table schema...');
    
    // Add missing columns
    const alterQueries = [
      // Add department_id column if it doesn't exist
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id)`,
      
      // Add department_role column if it doesn't exist
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS department_role TEXT`,
      
      // Add status column if it doesn't exist
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'`,
      
      // Update existing users to have active status
      `UPDATE users SET status = 'active' WHERE status IS NULL`,
      
      // Update existing users to be verified
      `UPDATE users SET is_verified = true WHERE is_verified IS NULL`
    ];
    
    for (const query of alterQueries) {
      console.log(`Executing: ${query}`);
      await sql.unsafe(query);
    }
    
    console.log('Users table schema updated successfully!');
    
    // Verify the changes
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('\nUpdated users table columns:');
    columns.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
  } catch (error) {
    console.error('Error fixing users schema:', error);
  } finally {
    await sql.end();
  }
}

fixUsersSchema(); 