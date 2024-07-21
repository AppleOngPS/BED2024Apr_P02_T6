// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  // Add click event listener to the hamburger menu
  document.querySelector(".hamburger").addEventListener("click", function () {
    // Toggle the 'active' class on the navigation menu and overlay
    document.querySelector("ul").classList.toggle("active");
    document.querySelector(".overlay").classList.toggle("active");
  });

  // Function to check if the current page is in the root directory
  function isCurrentDirectory() {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments[pathSegments.length - 2] !== "html";
  }

  // Function to update the points display on the page
  function updatePointsDisplay(points) {
    const pointsDisplay = document.getElementById("points-display");
    if (pointsDisplay) {
      pointsDisplay.textContent = `Points: ${points}`;
    }
  }

  // Function to handle navigation click events
  function handleNavClick(event) {
    incrementPoints(updatePointsDisplay);
  }

  // Event listener for when the chatbot is loaded
  document.addEventListener("ChatbotLoaded", () => {
    let navVisible = true;
    const navElement = document.querySelector("nav");

    // Toggle navigation visibility when chatbot is toggled
    chatbotToggler.addEventListener("click", () => {
      navElement.style.display = navVisible ? "none" : "flex";
      navVisible = !navVisible;
    });

    // Show navigation when chatbot is closed
    closeBtn.addEventListener(
      "click",
      () => (navElement.style.display = "flex")
    );
  });

  // Update points display when the DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    const user = getUser();
    if (user) {
      updatePointsDisplay(user.Points);
    }
  });
});
