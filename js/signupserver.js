const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const dbConfig = require('./dbConfig'); // Ensure dbconfig.js is correctly defined

const app = express();
const port = 3001;

// Middleware
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

// POST endpoint for user creation
app.post('/users', async (req, res) => {
  const { name, password, email, contactNumber } = req.body;

  try {
    const request = pool.request();
    request.input('name', sql.NVarChar, name);
    request.input('password', sql.Int, password); // Assuming password is stored as integer
    request.input('email', sql.NVarChar, email);
    request.input('contactNumber', sql.Int, contactNumber);

    const result = await request.query(`
      INSERT INTO AccountUser (name, password, email, contactNumber)
      VALUES (@name, @password, @email, @contactNumber);
    `);

    console.log('User created successfully:', result);
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Serve static files from the 'public' directory
app.use(express.static('../html'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
