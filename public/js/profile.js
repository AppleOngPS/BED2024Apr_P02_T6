// profile.js

document.addEventListener("DOMContentLoaded", async () => {
    try {
      // Fetch user details from backend
      const userId = getUserIdFromURL(); // Implement this function to extract user ID from URL
      const userDetails = await fetchUserDetails(userId);
  
      // Populate form fields with user details
      document.getElementById("exampleInputUsername").value = userDetails.name;
      document.getElementById("exampleInputGender").value = userDetails.gender;
      document.getElementById("exampleInputEmail").value = userDetails.email;
      document.getElementById("exampleInputMobileNumber").value = userDetails.contactNumber;
      document.getElementById("exampleInputAge").value = userDetails.age;
      document.getElementById("exampleInputHeight").value = userDetails.height;
      document.getElementById("exampleInputWeight").value = userDetails.weight;
      document.getElementById("exampleInputWeightGoal").value = userDetails.weightGoal;
      document.getElementById("exampleInputTargetCalorieGoal").value = userDetails.TargetCalarieIntake;
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Error fetching user details. Please try again later.");
    }
  });
  
  async function fetchUserDetails(userId) {
    try {
      const response = await fetch(`/api/users/${userId}`); // Replace with your backend endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  }
  
  function editProfile() {
    // Implement logic to enable editing of profile fields
    alert("Implement editProfile function");
  }
  
  function deleteAccount() {
    // Implement logic to delete user account
    alert("Implement deleteAccount function");
  }
  
  function getUserIdFromURL() {
    // Implement logic to extract user ID from URL (if needed)
    // Example: /profile/123 -> Extract 123
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 1];
  }
  