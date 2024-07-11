document.getElementById('signupForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const signupForm = event.target;
  const formData = {
    name: signupForm.querySelector('#exampleInputName').value,
    password: signupForm.querySelector('#exampleInputPassword').value,
    email: signupForm.querySelector('#exampleInputEmail').value,
    contactNumber: signupForm.querySelector('#exampleInputContactNumber').value,
    age: signupForm.querySelector('#exampleInputAge').value,
    height: signupForm.querySelector('#exampleInputHeight').value,
    weight: signupForm.querySelector('#exampleInputWeight').value,
    weightGoal: signupForm.querySelector('#exampleInputWeightGoal').value,
    TargetCalarieIntake: signupForm.querySelector('#exampleInputTargetCalarieIntake').value
  };

  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('Failed to create user account');
    }

    const newUser = await response.json();
    console.log('New user created:', newUser);
    // Redirect to the login page or show a success message
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error creating user:', error);
    // Handle error: show error message to user
  }
});
document.addEventListener('DOMContentLoaded', function() {
  // Select the Sign Up button
  const loginButton = document.getElementById('loginButton');

  // Add click event listener
  loginButton.addEventListener('click', function() {
    // Navigate to signup.html
    window.location.href = '../html/login.html';
  });
});