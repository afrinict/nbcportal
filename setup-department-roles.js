import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Samolan123@localhost:5456/nbc2';
const client = postgres(connectionString);

async function setupDepartmentRoles() {
  try {
    console.log('Setting up department roles and permissions...');

    // First, ensure we have some departments
    const existingDepartments = await client`SELECT * FROM departments`;
    
    if (existingDepartments.length === 0) {
      console.log('No departments found. Creating sample departments...');
      
      const sampleDepartments = [
        {
          name: 'Technical Standards',
          code: 'TECH',
          description: 'Handles technical standards and equipment compliance',
          is_active: true
        },
        {
          name: 'Content Regulation',
          code: 'CONTENT',
          description: 'Manages content standards and broadcasting regulations',
          is_active: true
        },
        {
          name: 'Licensing',
          code: 'LICENSE',
          description: 'Processes license applications and renewals',
          is_active: true
        },
        {
          name: 'Compliance',
          code: 'COMPLIANCE',
          description: 'Ensures regulatory compliance and enforcement',
          is_active: true
        }
      ];

      for (const dept of sampleDepartments) {
        await client`
          INSERT INTO departments (name, code, description, is_active)
          VALUES (${dept.name}, ${dept.code}, ${dept.description}, ${dept.is_active})
        `;
      }
      
      console.log('Sample departments created successfully.');
    }

    // Get all departments
    const departments = await client`SELECT * FROM departments`;
    
    // Define the three role levels for each department
    const roleLevels = [
      {
        role: 'department_admin',
        permissions: {
          can_read: true,
          can_write: true,
          can_delete: true,
          can_manage_users: true,
          can_approve_applications: true,
          can_view_analytics: true,
          can_manage_roles: true,
          can_assign_applications: true
        },
        description: 'Full administrative access to department operations'
      },
      {
        role: 'write',
        permissions: {
          can_read: true,
          can_write: true,
          can_delete: false,
          can_manage_users: false,
          can_approve_applications: false,
          can_view_analytics: true,
          can_manage_roles: false,
          can_assign_applications: false
        },
        description: 'Can read and write but cannot delete or manage users'
      },
      {
        role: 'read_only',
        permissions: {
          can_read: true,
          can_write: false,
          can_delete: false,
          can_manage_users: false,
          can_approve_applications: false,
          can_view_analytics: true,
          can_manage_roles: false,
          can_assign_applications: false
        },
        description: 'Read-only access to department data'
      }
    ];

    // Create department permissions for each department and role level
    for (const dept of departments) {
      console.log(`Setting up roles for department: ${dept.name}`);
      
      for (const roleLevel of roleLevels) {
        // Check if permission already exists
        const existingPermission = await client`
          SELECT * FROM department_permissions 
          WHERE department_id = ${dept.id} AND role = ${roleLevel.role}
        `;

        if (existingPermission.length === 0) {
          await client`
            INSERT INTO department_permissions (department_id, role, permissions)
            VALUES (${dept.id}, ${roleLevel.role}, ${JSON.stringify(roleLevel.permissions)})
          `;
          
          console.log(`  ✓ Created ${roleLevel.role} role for ${dept.name}`);
        } else {
          console.log(`  - ${roleLevel.role} role already exists for ${dept.name}`);
        }
      }
    }

    console.log('\nDepartment roles setup completed successfully!');
    console.log('\nRole Summary:');
    console.log('=============');
    console.log('1. department_admin: Full access - can read, write, delete, manage users, approve applications');
    console.log('2. write: Limited access - can read, write, view analytics (cannot delete or manage users)');
    console.log('3. read_only: View only - can read and view analytics (cannot write, delete, or manage)');

  } catch (error) {
    console.error('Error setting up department roles:', error);
  } finally {
    await client.end();
  }
}

// Run the setup
setupDepartmentRoles(); 