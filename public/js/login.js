document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('LoginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const loginForm = event.target;
    const formData = {
      name: loginForm.querySelector('#exampleInputName').value,
      password: loginForm.querySelector('#exampleInputPassword').value
    };

    try {
      const queryString = `?name=${encodeURIComponent(formData.name)}&password=${encodeURIComponent(formData.password)}`;
      const response = await fetch(`http://localhost:3000/login${queryString}`, {
        method: 'GET', // Use GET method for login
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const loggedInUser = await response.json();
      console.log('Logged in user:', loggedInUser);
      // Store user data in local storage
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      // Redirect or perform actions upon successful login
      window.location.href = 'profile.html'; // Example redirect to profile page
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error: show error message to user
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Select the Sign Up button
  const signupButton = document.getElementById('signupButton');

  // Add click event listener
  signupButton.addEventListener('click', function() {
    // Navigate to signup.html
    window.location.href = '../html/signup.html';
  });
});
