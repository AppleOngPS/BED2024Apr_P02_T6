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
//GET endpoint to retreive user account
app.get('/users', async (req, res) => {
  try {
    const request = pool.request();

    const result = await request.query(`
      SELECT * FROM AccountUser;
    `);

    console.log('Retrieved users:', result.recordset);
    res.json(result.recordset); // Send retrieved users as JSON response
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

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




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
