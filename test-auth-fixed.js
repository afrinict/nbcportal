import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:Samolan123@localhost:5456/nbc2');

async function testAuth() {
  try {
    console.log('Testing authentication with fixed schema...');
    
    // Test login with admin user
    const loginData = {
      email: 'admin@nbc.gov.ng',
      password: 'password123'
    };
    
    console.log('Attempting login with:', loginData.email);
    
    // Make HTTP request to login endpoint
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Login successful!');
      console.log('User:', result.user);
      console.log('Token received:', result.token ? 'Yes' : 'No');
    } else {
      const error = await response.json();
      console.log('❌ Login failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await sql.end();
  }
}

testAuth(); 