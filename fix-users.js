import { db } from './server/db.ts';
import { users } from './shared/schema.ts';
import { eq } from 'drizzle-orm';

async function fixUsers() {
  try {
    console.log('Connecting to database...');
    
    // Get all users
    const allUsers = await db.select().from(users);
    console.log(`Found ${allUsers.length} users in database`);
    
    // Update all users to be active and fix any missing fields
    for (const user of allUsers) {
      console.log(`Processing user: ${user.email} (${user.username})`);
      
      const updateData = {
        status: 'active',
        phone: user.phone || '+2340000000000', // Set default phone if missing
        isVerified: true, // Mark all users as verified
        updatedAt: new Date()
      };
      
      await db.update(users)
        .set(updateData)
        .where(eq(users.id, user.id));
      
      console.log(`Updated user: ${user.email}`);
    }
    
    console.log('All users have been updated successfully!');
    
    // Show final user list
    const finalUsers = await db.select().from(users);
    console.log('\nFinal user list:');
    finalUsers.forEach(user => {
      console.log(`- ${user.email} (${user.username}) - Role: ${user.role} - Status: ${user.status}`);
    });
    
  } catch (error) {
    console.error('Error fixing users:', error);
  } finally {
    process.exit(0);
  }
}

fixUsers(); 