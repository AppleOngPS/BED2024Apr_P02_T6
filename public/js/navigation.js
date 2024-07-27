document.addEventListener("DOMContentLoaded", function () {
  // Include Bootstrap CSS
  const bootstrapCSS = document.createElement("link");
  bootstrapCSS.rel = "stylesheet";
  bootstrapCSS.href =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
  document.head.appendChild(bootstrapCSS);

  // Include your custom CSS
  const customCSS = document.createElement("link");
  customCSS.rel = "stylesheet";
  customCSS.href = isCurrentDirectory()
    ? "css/navigation.css"
    : "./css/navigation.css";
  document.head.appendChild(customCSS);

  // Include Bootstrap JS
  const bootstrapJS = document.createElement("script");
  bootstrapJS.src =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js";
  document.body.appendChild(bootstrapJS);

  // Create a new header element
  const header = document.createElement("header");

  // Set the inner HTML of the header to create the navigation structure
  header.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #4CAF50; font-size: 16px;">
      <div class="container-fluid">
        <a class="navbar-brand" href="#" style="padding-left: 20px;">
          <div style="color: white; display: flex; align-items: center;">
            <img src="${
              isCurrentDirectory() ? "images/icon.avif" : "../images/icon.avif"
            }" alt="AMA Health Hub Icon" style="height: 45px; margin-right: 10px;">
            <span>AMA Health Hub</span>
          </div>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${
                isCurrentDirectory() ? "html/recipe.html" : "recipe.html"
              }">Recipe</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${
                isCurrentDirectory() ? "html/quiz.html" : "quiz.html"
              }">Quiz</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${
                isCurrentDirectory()
                  ? "html/meal_planning.html"
                  : "meal_planning.html"
              }">Meal Planning</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${
                isCurrentDirectory()
                  ? "html/community-page.html"
                  : "community-page.html"
              }">Community</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${
                isCurrentDirectory() ? "html/Reward.html" : "Reward.html"
              }">Reward</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${
                isCurrentDirectory() ? "html/profile.html" : "profile.html"
              }">Profile</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${
                isCurrentDirectory() ? "html/login.html" : "login.html"
              }">Login</a>
            </li>
            <li id="points-display" class="nav-item" style="color: white; padding-top: 8px;"></li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  // Insert the header at the beginning of the body
  document.body.insertBefore(header, document.body.firstChild);

  // Add click event listener to the hamburger menu icon
  document
    .querySelector(".navbar-toggler")
    .addEventListener("click", function () {
      document.querySelector(".navbar-collapse").classList.toggle("show");
    });

  // Add click event listeners to all navigation menu items
  document.querySelectorAll("nav ul li a").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelector(".navbar-collapse").classList.remove("show");
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

  // Simulate getting user data and updating points display
  document.addEventListener("DOMContentLoaded", () => {
    const user = getUser(); // Assume this function gets the user data
    if (user) {
      updatePointsDisplay(user.Points);
    }
  });
});
