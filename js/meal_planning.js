const meals = {
  breakfast: [],
  lunch: [],
  dinner: [],
  extras: [], // Add extras category
};

const apiKey = "665edb3cb526657bc4efd77e";
const baseUrl = "https://bed11-f956.restdb.io/rest/meal-planning";

// Initialization
document.addEventListener("DOMContentLoaded", function () {
  setupCalendar();

  document
    .getElementById("calendar-button")
    .addEventListener("click", openCalendarModal);
  document
    .getElementById("new-day-button")
    .addEventListener("click", function () {
      if (
        confirm(
          "Are you sure you want to start a new day? This will delete all current food items."
        )
      ) {
        resetMealData();
        deleteAllMealsFromDB();
      }
    });
});

// Calendar modal functions
function openCalendarModal() {
  document.getElementById("calendarModal").style.display = "block";
}

function closeCalendarModal() {
  document.getElementById("calendarModal").style.display = "none";
}

function setupCalendar() {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: function (fetchInfo, successCallback, failureCallback) {
      fetch(baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": apiKey,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const events = data.map((food) => ({
            title: `Calories: ${food.calories}`,
            start: new Date(food._created),
            extendedProps: {
              carbs: food.carbs,
              protein: food.protein,
              fats: food.fats,
              sodium: food.sodium,
            },
          }));
          successCallback(events);
        })
        .catch((error) => {
          console.error("Error:", error);
          failureCallback(error);
        });
    },
    eventClick: function (info) {
      const { title, start, extendedProps } = info.event;
      alert(
        `Date: ${start.toLocaleDateString()}\n` +
          `${title}\n` +
          `Carbs: ${extendedProps.carbs}g\n` +
          `Protein: ${extendedProps.protein}g\n` +
          `Fats: ${extendedProps.fats}g\n` +
          `Sodium: ${extendedProps.sodium}mg`
      );
    },
  });
  calendar.render();
}

// Check if it's a new day and reset data if necessary
function checkDateAndResetData() {
  const currentDate = new Date().toLocaleDateString();
  const lastAccessDate = localStorage.getItem("lastAccessDate");

  if (currentDate !== lastAccessDate) {
    localStorage.setItem("lastAccessDate", currentDate);
    resetMealData();
  } else {
    fetchFoodItems();
  }
}

// Reset meal data
function resetMealData() {
  meals.breakfast = [];
  meals.lunch = [];
  meals.dinner = [];
  meals.extras = [];
  updateTotals();
  displayFood("breakfast");
  displayFood("lunch");
  displayFood("dinner");
  displayFood("extras");
  deleteAllMealsFromDB(); // Delete all meals from the database at the start of a new day
}

function openAddFoodModal(mealType) {
  document.getElementById("addFoodModal").style.display = "block";
  document.getElementById("addFoodForm").onsubmit = function (event) {
    event.preventDefault();
    addFood(mealType);
  };
}

function closeAddFoodModal() {
  document.getElementById("addFoodModal").style.display = "none";
}

function addFood(mealType) {
  const name = document.getElementById("food-name").value;
  const calories = parseFloat(document.getElementById("food-calories").value);
  const carbs = parseFloat(document.getElementById("food-carbs").value);
  const protein = parseFloat(document.getElementById("food-protein").value);
  const fats = parseFloat(document.getElementById("food-fats").value);
  const sodium = parseFloat(document.getElementById("food-sodium").value);
  const imageFile = document.getElementById("food-image").files[0];

  const reader = new FileReader();
  reader.onloadend = function () {
    const image = reader.result;

    const foodItem = {
      name,
      calories,
      carbs,
      protein,
      fats,
      sodium,
      mealType, // Add the meal type
      image, // Base64 encoded image
      quantity: 1,
    };

    // Adding the food item to RestDB
    fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": apiKey,
      },
      body: JSON.stringify(foodItem),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Added food item:", data);
        meals[mealType].push(data);
        displayFood(mealType);
        updateTotals();
        closeAddFoodModal();
      })
      .catch((error) => console.error("Error:", error));
  };

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  } else {
    console.error("No image file selected.");
  }
}

function displayFood(mealType) {
  const mealList = document.getElementById(`${mealType}-list`);
  mealList.innerHTML = ""; // Clear previous items

  meals[mealType].forEach((food) => {
    const foodItem = document.createElement("div");
    foodItem.classList.add("meal-item");

    const foodImage = document.createElement("img");
    foodImage.src = food.image;
    foodImage.classList.add("food-image");
    foodItem.appendChild(foodImage);

    const details = document.createElement("div");
    details.classList.add("details");
    details.innerHTML = `
      <p>${food.name}</p>
      <p>kcal: ${food.calories} | c: ${food.carbs}g | p: ${food.protein}g | f: ${food.fats}g | sodium: ${food.sodium}mg</p>
      <p>Quantity: ${food.quantity}</p>
    `;
    foodItem.appendChild(details);

    mealList.appendChild(foodItem);
  });

  const addItemDiv = document.createElement("div");
  addItemDiv.classList.add("add-item");
  addItemDiv.innerText = "+ Add Item";
  addItemDiv.onclick = () => openAddFoodModal(mealType);
  mealList.appendChild(addItemDiv);
}

function updateTotals() {
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFats = 0;
  let totalSodium = 0;

  for (let mealType in meals) {
    meals[mealType].forEach((food) => {
      totalCalories += food.calories;
      totalCarbs += food.carbs;
      totalProtein += food.protein;
      totalFats += food.fats;
      totalSodium += food.sodium;
    });
  }

  document.getElementById("total-calories").innerText = totalCalories;
  document.getElementById("total-carbs").innerText = totalCarbs;
  document.getElementById("total-protein").innerText = totalProtein;
  document.getElementById("total-fats").innerText = totalFats;
  document.getElementById("total-sodium").innerText = totalSodium;
}

function fetchFoodItems() {
  fetch(baseUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched food items:", data); // Log fetched data
      // Clear current meals
      meals.breakfast = [];
      meals.lunch = [];
      meals.dinner = [];
      meals.extras = [];

      data.forEach((food) => {
        // Assuming each food item has a `mealType` property indicating breakfast, lunch, dinner, or extras
        if (meals[food.mealType]) {
          meals[food.mealType].push(food);
        }
      });
      displayFood("breakfast");
      displayFood("lunch");
      displayFood("dinner");
      displayFood("extras"); // Display extra's category
      updateTotals();
    })
    .catch((error) => console.error("Error:", error));
}

// Function to delete all meals from the database
function deleteAllMealsFromDB() {
  fetch(baseUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Deleted all meals:", data);
    })
    .catch((error) => console.error("Error:", error));
}

// Add event listener to format and display current date
document.addEventListener("DOMContentLoaded", function () {
  function formatDate(date) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  }

  const currentDate = new Date();
  document.getElementById("current-date").textContent = formatDate(currentDate);

  checkDateAndResetData(); // Check the date and reset data if necessary
  fetchFoodItems(); // Fetch and display food items after the page loads
});

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("addFoodModal");
  if (event.target == modal) {
    closeAddFoodModal();
  }
};
document
  .getElementById("new-day-button")
  .addEventListener("click", function () {
    if (
      confirm(
        "Are you sure you want to start a new day? This will delete all current food items."
      )
    ) {
      resetMealData(); // Reset meal data in the app
      deleteAllMealsFromDB(); // Delete all meals from the database
    }
  });

// Function to reset meal data (clear meals object and update display)
function resetMealData() {
  meals.breakfast = [];
  meals.lunch = [];
  meals.dinner = [];
  meals.extras = [];
  updateTotals();
  displayFood("breakfast");
  displayFood("lunch");
  displayFood("dinner");
  displayFood("extras");
}

// Function to delete all meals from the database
function deleteAllMealsFromDB() {
  fetch(baseUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Deleted all meals successfully.");
      } else {
        console.error("Failed to delete meals.");
      }
    })
    .catch((error) => console.error("Error:", error));
}
