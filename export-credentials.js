import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:Samolan123@localhost:5456/nbc2');

async function exportCredentials() {
  try {
    console.log('Exporting user credentials...');
    
    // Get all users
    const users = await sql`
      SELECT 
        id,
        username,
        email,
        password,
        phone,
        full_name,
        company_name,
        role,
        department,
        unit,
        subunit,
        position,
        employee_id,
        department_id,
        department_role,
        status,
        is_verified,
        created_at
      FROM users 
      ORDER BY id;
    `;
    
    console.log(`Found ${users.length} users`);
    
    // Create credentials content
    let credentialsContent = `NBC License Portal - User Credentials
===============================================
Generated on: ${new Date().toLocaleString()}
Total Users: ${users.length}

`;

    users.forEach((user, index) => {
      credentialsContent += `User ${index + 1}:
--------------
ID: ${user.id}
Username: ${user.username}
Email: ${user.email}
Password: ${user.password}
Phone: ${user.phone}
Full Name: ${user.full_name}
Company: ${user.company_name || 'N/A'}
Role: ${user.role}
Department: ${user.department || 'N/A'}
Unit: ${user.unit || 'N/A'}
Subunit: ${user.subunit || 'N/A'}
Position: ${user.position || 'N/A'}
Employee ID: ${user.employee_id || 'N/A'}
Department ID: ${user.department_id || 'N/A'}
Department Role: ${user.department_role || 'N/A'}
Status: ${user.status}
Verified: ${user.is_verified}
Created: ${user.created_at}

`;
    });

    // Add default passwords for known users
    credentialsContent += `
Default Passwords:
=================
Note: These are the default passwords used during development.
In production, users should change their passwords.

`;

    users.forEach((user, index) => {
      let defaultPassword = 'password123'; // Default password
      
      // You can add specific passwords for known users here
      if (user.email === 'admin@nbc.gov.ng') {
        defaultPassword = 'password123';
      }
      
      credentialsContent += `${user.email}: ${defaultPassword}\n`;
    });

    // Write to file
    const fs = await import('fs');
    fs.writeFileSync('credentials.txt', credentialsContent);
    
    console.log('✅ Credentials exported to credentials.txt');
    console.log(`📁 File location: ${process.cwd()}/credentials.txt`);
    
    // Also display in console
    console.log('\n' + credentialsContent);
    
  } catch (error) {
    console.error('Error exporting credentials:', error);
  } finally {
    await sql.end();
  }
}

exportCredentials(); 