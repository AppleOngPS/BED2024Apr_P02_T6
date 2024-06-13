const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const validateBook = require("./validateBook"); // Update with the correct path
const signupController = require("./signupController"); 
const sql = require("mssql");
const dbConfig = require("./dbConfig");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Start server
const port = 3000;


app.put("/users/:id", validateBook, signupController.updateUserAcccount);

app.post("/users", signupController.createUserAccount); // Create user
app.get("/users", signupController.getAllUserAccount); // Get all users
app.get("/users/:id", signupController.getUserAccountById); // Get user by ID
app.put("/users/:id", signupController.updateUserAcccount); // Update user

// const signupForm = document.getElementById('signupForm');

// signupForm.addEventListener('submit', async (event) => {
//   event.preventDefault(); // Prevent default form submission
  
//   const formData = {
//     name: signupForm.name.value,
//     password: signupForm.password.value,
//     email: signupForm.email.value,
//     contactNumber: signupForm.contactNumber.value
//   };
  
//   try {
//     const response = await fetch('http://localhost:3000/users', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(formData)
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to create user account');
//     }
    
//     const newUser = await response.json();
//     console.log('New user created:', newUser);
    
//     // Optionally redirect or show success message
//   } catch (error) {
//     console.error('Error creating user:', error);
//     // Handle error: show error message to user
//   }
// });


// module.exports = app;

 app.listen(port, async () => {
   try {
     // Connect to the database
     await sql.connect(dbConfig);
     console.log("Database connection established successfully");
   } catch (err) {
    console.error("Database connection error:", err);
     // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
   }

   
  console.log(`Server listening on port ${port}`);
 });

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
