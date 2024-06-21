document.getElementById('signupForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const signupForm = event.target;
  const formData = {
    name: signupForm.querySelector('#exampleInputName').value,
    password: signupForm.querySelector('#exampleInputPassword').value,
    email: signupForm.querySelector('#exampleInputEmail').value,
    contactNumber: signupForm.querySelector('#exampleInputContactNumber').value
  };

  try {
    const response = await fetch('http://localhost:3001/users', {
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
