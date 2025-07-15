import express from 'express';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:Samolan123@localhost:5456/nbc2";
const JWT_SECRET = process.env.JWT_SECRET || 'nbc-portal-secret-key';

const app = express();
app.use(express.json());

const sql = postgres(DATABASE_URL);

// Simple login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = users[0];
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('User found:', { id: user.id, username: user.username, role: user.role });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', user.email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('Password verified successfully for user:', user.email);

    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
        department: user.department 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Token generated successfully for user:', user.email);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        department: user.department
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Test server is running" });
});

const port = 5001;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
}); 