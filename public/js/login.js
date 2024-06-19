

document.getElementById('LoginForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission
  
  const signupForm = event.target;
  const formData = {
    name: signupForm.querySelector('#exampleInputName').value,
    password: signupForm.querySelector('#exampleInputPassword').value,
  };
  
  try {
    const response = await fetch(`http://localhost:3001/users/search?name=${formData.name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to retrieve user account');
    }
    
    const users = await response.json();
    if (users.length > 0) {
      const user = users[0]; // Assuming the first user found
      console.log('Login successfully. Account Name:', user.name);
      // Redirect to the login page or handle success as needed
       window.location.href = '../html/profile.html';
    } else {
      console.error('User not found');
      // Handle case where user was not found
    }
  } catch (error) {
    console.error('Error logging in:', error);
    // Handle error: show error message to user
  }
});
