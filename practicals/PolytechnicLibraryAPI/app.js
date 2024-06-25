const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');
const dbConfig = require('./dbConfig'); // Ensure dbconfig.js is correctly defined
const path = require('path');

const app = express();
const port = 3001;

// Serve static files (CSS, JS, images, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool
let pool;

async function startServer() {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Database connection established successfully');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

startServer();

// Routes for User Management

// GET all users
app.get('/users', async (req, res) => {
  try {
    const request = pool.request();
    const result = await request.query('SELECT * FROM users');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// GET user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = pool.request();
    request.input('id', sql.Int, id);
    const result = await request.query('SELECT * FROM users WHERE id = @id');
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// POST create a new user
app.post('/users', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }

    const request = pool.request();
    request.input('username', sql.NVarChar, username);
    request.input('passwordHash', sql.NVarChar, password); // Assuming passwordHash is stored as a string
    request.input('role', sql.NVarChar, role); // Assuming role is stored as a string

    const result = await request.query(`
      INSERT INTO users (username, passwordHash, role)
      VALUES (@username, @passwordHash, @role);
    `);

    console.log('User created successfully:', result);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET user by username (search)
app.get('/users/search', async (req, res) => {
  const { username } = req.query;

  try {
    const request = pool.request();
    request.input('username', sql.NVarChar, username);

    const result = await request.query('SELECT * FROM users WHERE username = @username');

    if (result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res.status(404).json({ message: 'No users found with that username' });
    }
  } catch (error) {
    console.error('Error retrieving users by username:', error);
    res.status(500).json({ error: 'Failed to retrieve users by username' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
