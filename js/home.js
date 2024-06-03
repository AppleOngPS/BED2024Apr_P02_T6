document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".hamburger").addEventListener("click", function () {
    document.querySelector("ul").classList.toggle("active");
    document.querySelector(".overlay").classList.toggle("active");
  });

  function isCurrentDirectory() {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments[pathSegments.length - 2] !== "html";
  }

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
