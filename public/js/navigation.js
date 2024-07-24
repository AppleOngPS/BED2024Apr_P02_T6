// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  // Create a new header element
  const header = document.createElement("header");

  // Set the inner HTML of the header to create the navigation structure
  header.innerHTML = `
        <nav style="background-color: #4CAF50; font-size: 16px;">
          <div class="logo" style="padding-left: 20px;">
            <div style="color: white; display: flex; align-items: center;">
                <img src="${
                  isCurrentDirectory()
                    ? "images/icon.avif"
                    : "../images/icon.avif"
                }" alt="AMA Health Hub Icon" style="height: 45px; margin-right: 10px;">
                <span>AMA Health Hub</span>
            </div>
          </div>
            <input type="checkbox" id="click">
            <label for="click" class="mainicon">
                <div class="menu">
                    <i class="bi bi-list"></i>
                </div>
            </label>
            <ul>
                <!-- Navigation menu items with dynamic linking based on current directory -->
                <li><a href="${
                  isCurrentDirectory() ? "index.html" : "index.html"
                }">Home</a></li>
                <li><a href="${
                  isCurrentDirectory() ? "html/recipe.html" : "recipe.html"
                }">Recipe</a></li>
                <li><a href="${
                  isCurrentDirectory() ? "html/quiz.html" : "quiz.html"
                }">Quiz</a></li>
                <li><a href="${
                  isCurrentDirectory()
                    ? "html/meal_planning.html"
                    : "meal_planning.html"
                }">Meal Planning</a></li>
                <li><a href="${
                  isCurrentDirectory()
                    ? "html/community.html"
                    : "community.html"
                }">Community</a></li>
                                <li><a href="${
                                  isCurrentDirectory()
                                    ? "html/Reward.html"
                                    : "Reward.html"
                                }">Reward</a></li>
                 <li><a href="${
                   isCurrentDirectory() ? "html/profile.html" : "profile.html"
                 }">Profile</a></li>
                <li><a href="${
                  isCurrentDirectory() ? "html/login.html" : "login.html"
                }">Login</a></li>
                <li id="points-display" style="color: white;"></li>
                <div class="main-icon">
                    <img src="../images/menu-icon.png" class="hamburger">
                </div>
                <div class="overlay"></div>
            </ul>
        </nav>
    `;

  // Insert the header at the beginning of the body
  document.body.insertBefore(header, document.body.firstChild);

  // Add click event listener to the hamburger menu icon
  document.querySelector(".hamburger").addEventListener("click", function () {
    document.querySelector("ul").classList.toggle("active");
    document.querySelector(".overlay").classList.toggle("active");
  });

  // Add click event listeners to all navigation menu items
  document.querySelectorAll("nav ul li a").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelector("ul").classList.remove("active");
      document.querySelector(".overlay").classList.remove("active");
    });
  });

  // Function to check if the current page is in the root directory
  function isCurrentDirectory() {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments[pathSegments.length - 2] !== "html";
  }

  // Function to update the points display in the navigation
  function updatePointsDisplay(points) {
    const pointsDisplay = document.getElementById("points-display");
    if (pointsDisplay) {
      pointsDisplay.textContent = `Points: ${points}`;
    }
  }

  // Function to handle navigation click events (not implemented in this code)
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

  // Update points display when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    const user = getUser();
    if (user) {
      updatePointsDisplay(user.Points);
    }
  });
});
