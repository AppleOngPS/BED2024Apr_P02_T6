
document.addEventListener('DOMContentLoaded', async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
      if (!loggedInUser) {
        throw new Error('User not logged in');
      }
  
      const { name, password } = loggedInUser;
  
      const response = await fetch(`http://localhost:3000/users`);
  
      if (!response.ok) {
        const errorMessage = `Error fetching user data: ${response.statusText}`;
        throw new Error(errorMessage);
      }
  
      const users = await response.json();
      console.log('User data:', users);
  
      // Find the specific user by name and password
      const userData = users.find(user => user.name === name && user.password === password);
  
      if (!userData) {
        throw new Error('User not found');
      }
  
      // Update UI with fetched user data
      displayUserData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Error fetching user data. Please try again.');
    }
  });

  async function fetchUserData(name, password) {
    try {
      const queryString = `?name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`;
      const response = await fetch(`http://localhost:3000/user${queryString}`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching user data: ${error.message}`);
    }
  }
// Event listener for Save button
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveButton').addEventListener('click', async () => {
    try {
      const updatedUserData = {
        name: document.getElementById('usernameInput').value,
        email: document.getElementById('exampleInputEmail').value,
        contactNumber: document.getElementById('exampleInputMobileNumber').value,
        age: parseInt(document.getElementById('exampleInputAge').value, 10),
        height: parseInt(document.getElementById('exampleInputHeight').value, 10),
        weight: parseInt(document.getElementById('exampleInputWeight').value, 10),
        weightGoal: parseInt(document.getElementById('exampleInputWeightGoal').value, 10),
        TargetCalarieIntake: parseInt(document.getElementById('exampleInputTargetCalorieGoal').value, 10)
      
      };

      const response = await fetch('http://localhost:3000/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUserData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      alert('Profile updated successfully');
      // Optionally, redirect to another page or update UI as needed
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  });
  

  // Event listener for Delete Account button
  document.getElementById('deleteButton').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        
        if (!loggedInUser) {
          throw new Error('User not logged in');
        }
  
        const { name, password } = loggedInUser;
  
        const deleteUrl = `http://localhost:3000/users?name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`;
  
        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`Failed to delete user account. Status: ${response.status}, ${response.statusText}`);
        }
  
        alert('Account deleted successfully');
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html'; // Redirect to login page after successful deletion
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account. Please try again.');
      }
    }
  });
});

  
  function displayUserData(userData) {
    document.getElementById('usernameInput').value = userData.name;
    document.getElementById('exampleInputEmail').value = userData.email;
    document.getElementById('exampleInputMobileNumber').value = userData.contactNumber;
    document.getElementById('exampleInputAge').value = userData.age;
    document.getElementById('exampleInputHeight').value = userData.height;
    document.getElementById('exampleInputWeight').value = userData.weight;
    document.getElementById('exampleInputWeightGoal').value = userData.weightGoal;
    document.getElementById('exampleInputTargetCalorieGoal').value = userData.TargetCalarieIntake;
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Select the Sign Up button
    const logoutButton = document.getElementById('logoutButton');
  
    // Add click event listener
    logoutButton.addEventListener('click', function() {
      // Navigate to signup.html
      window.location.href = '../html/login.html';
    });
  });
  