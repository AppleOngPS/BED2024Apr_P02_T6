// profile.js
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
  