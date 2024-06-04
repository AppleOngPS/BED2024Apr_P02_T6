const meals = {
  breakfast: [],
  lunch: [],
  dinner: [],
};

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

  const foodItem = {
    name,
    calories,
    carbs,
    protein,
    fats,
    sodium,
    image: "path/to/placeholder.jpg", // Placeholder image, replace with actual image path
  };

  // Adding the food item to RestDB
  fetch("https://yourdatabase.restdb.io/rest/foods", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": "your-api-key",
    },
    body: JSON.stringify(foodItem),
  })
    .then((response) => response.json())
    .then((data) => {
      meals[mealType].push(data); // Using the returned data
      displayFood(mealType);
      updateTotals();
      closeAddFoodModal();
    })
    .catch((error) => console.error("Error:", error));
}

function displayFood(mealType) {
  const mealList = document.getElementById(`${mealType}-list`);
  mealList.innerHTML = ""; // Clear previous items

  meals[mealType].forEach((food) => {
    const foodItem = document.createElement("div");
    foodItem.classList.add("meal-item");

    const foodImage = document.createElement("img");
    foodImage.src = food.image;
    foodItem.appendChild(foodImage);

    const details = document.createElement("div");
    details.classList.add("details");
    details.innerHTML = `
              <p>${food.name}</p>
              <p>kcal: ${food.calories} | c: ${food.carbs}g | p: ${food.protein}g | f: ${food.fats}g | sodium: ${food.sodium}mg</p>
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
  fetch("https://yourdatabase.restdb.io/rest/foods", {
    headers: {
      "Content-Type": "application/json",
      "x-apikey": "your-api-key",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((food) => {
        // Assuming each food item has a `mealType` property indicating breakfast, lunch, or dinner
        meals[food.mealType].push(food);
      });
      displayFood("breakfast");
      displayFood("lunch");
      displayFood("dinner");
      updateTotals();
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

  fetchFoodItems(); // Fetch and display food items after the page loads
});

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("addFoodModal");
  if (event.target == modal) {
    closeAddFoodModal();
  }
};
