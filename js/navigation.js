document.addEventListener("DOMContentLoaded", function () {
  const header = document.createElement("header");
  header.innerHTML = `
        <nav style="background-color: #4CAF50; font-size: 16px;">
            <div class="logo">
                <a href="index.html" style="color: white;">AMA Health Hub</a>
            </div>
            <input type="checkbox" id="click">
            <label for="click" class="mainicon">
                <div class="menu">
                    <i class="bi bi-list"></i>
                </div>
            </label>
            <ul>
                <li><a href="${
                  isCurrentDirectory() ? "index.html" : "../index.html"
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
                  isCurrentDirectory() ? "html/food.html" : "food.html"
                }">Food</a></li>
                <li><a href="${
                  isCurrentDirectory() ? "html/profile.html" : "../profile.html"
                }">Profile</a></li>
                <li id="points-display" style="color: white;"></li>
                <div class="main-icon">
                    <img src="../images/menu-icon.png" class="hamburger">
                </div>
                <div class="overlay"></div>
            </ul>
        </nav>
    `;

  document.body.insertBefore(header, document.body.firstChild);

  document.querySelector(".hamburger").addEventListener("click", function () {
    document.querySelector("ul").classList.toggle("active");
    document.querySelector(".overlay").classList.toggle("active");
  });

  document.querySelectorAll("nav ul li a").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelector("ul").classList.remove("active");
      document.querySelector(".overlay").classList.remove("active");
    });
  });

  // check the link based on directory
  function isCurrentDirectory() {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments[pathSegments.length - 2] !== "html";
  }

  // Update the navigation points display when points change.
  function updatePointsDisplay(points) {
    const pointsDisplay = document.getElementById("points-display");
    if (pointsDisplay) {
      pointsDisplay.textContent = `Points: ${points}`;
    }
  }

  function handleNavClick(event) {
    incrementPoints(updatePointsDisplay);
  }

  document.addEventListener("ChatbotLoaded", () => {
    let navVisible = true;
    const navElement = document.querySelector("nav");
    chatbotToggler.addEventListener("click", () => {
      navElement.style.display = navVisible ? "none" : "flex";
      navVisible = !navVisible;
    });
    closeBtn.addEventListener(
      "click",
      () => (navElement.style.display = "flex")
    );
  });

  document.addEventListener("DOMContentLoaded", () => {
    const user = getUser();
    if (user) {
      updatePointsDisplay(user.Points);
    }
  });
});
