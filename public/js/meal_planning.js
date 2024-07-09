const meals = {
  breakfast: [],
  lunch: [],
  dinner: [],
  extras: [],
};

const apiKey = "668d0271a7d61d3f9c5c1416";
const baseUrl = "https://bedass1-fc80.restdb.io/rest/meal-planning";

// Calendar variables
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Target nutritional values (example values, adjust as needed)
const targetNutrition = {
  calories: 2000,
  carbs: 250,
  protein: 150,
  fats: 65,
  sodium: 2300,
};

// Initialization
document.addEventListener("DOMContentLoaded", function () {
  generateCalendar(currentMonth, currentYear);

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
      }
    });

  checkDateAndResetData();

  const nutritionModal = document.getElementById("nutritionModal");
  const closeNutritionBtn =
    document.getElementsByClassName("close-nutrition")[0];

  closeNutritionBtn.onclick = function () {
    closeNutritionModal();
  };

  window.onclick = function (event) {
    if (event.target == nutritionModal) {
      closeNutritionModal();
    }
  };

  // Add event listeners for add food buttons
  document
    .getElementById("add-breakfast")
    .addEventListener("click", () => openAddFoodModal("breakfast"));
  document
    .getElementById("add-lunch")
    .addEventListener("click", () => openAddFoodModal("lunch"));
  document
    .getElementById("add-dinner")
    .addEventListener("click", () => openAddFoodModal("dinner"));
  document
    .getElementById("add-extras")
    .addEventListener("click", () => openAddFoodModal("extras"));
});

// Calendar modal functions
function openCalendarModal() {
  document.getElementById("calendarModal").style.display = "block";
  generateCalendar(currentMonth, currentYear);
}

function closeCalendarModal() {
  document.getElementById("calendarModal").style.display = "none";
}

function generateCalendar(month, year) {
  let firstDay = new Date(year, month).getDay();
  let daysInMonth = 32 - new Date(year, month, 32).getDate();

  let tbl = document.getElementById("calendar-body");
  tbl.innerHTML = "";

  document.getElementById("monthYear").innerHTML = `${getMonthName(
    month
  )} ${year}`;

  let date = 1;
  for (let i = 0; i < 6; i++) {
    let row = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        let cell = document.createElement("td");
        let cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth) {
        break;
      } else {
        let cell = document.createElement("td");
        let cellContent = document.createElement("div");
        cellContent.classList.add("calendar-day");
        cellContent.innerHTML = date;

        let caloriesDiv = document.createElement("div");
        caloriesDiv.classList.add("calendar-calories");

        // Here you would fetch the calorie data for this date
        let calories = fetchCaloriesForDate(year, month, date);
        caloriesDiv.innerHTML = `${calories} / ${targetNutrition.calories} kcal`;

        cell.appendChild(cellContent);
        cell.appendChild(caloriesDiv);
        cell.addEventListener("click", () => showDayDetails(year, month, date));
        row.appendChild(cell);
        date++;
      }
    }
    tbl.appendChild(row);
  }
}

function getMonthName(monthIndex) {
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
  return months[monthIndex];
}

function fetchCaloriesForDate(year, month, day) {
  // Implement this function to fetch calorie data from your database
  // For now, we'll return a random number
  return Math.floor(Math.random() * targetNutrition.calories);
}

function showDayDetails(year, month, day) {
  const formattedDate = `${year}-${month + 1}-${day}`;
  const dailyNutrition = fetchNutritionForDate(formattedDate);

  const modalContent = `
    <h3>Nutritional Details for ${formattedDate}</h3>
    <table class="nutrition-table">
      <tr>
        <th>Nutrient</th>
        <th>Consumed</th>
        <th>Target</th>
      </tr>
      <tr>
        <td>Calories</td>
        <td>${dailyNutrition.calories} kcal</td>
        <td>${targetNutrition.calories} kcal</td>
      </tr>
      <tr>
        <td>Carbs</td>
        <td>${dailyNutrition.carbs} g</td>
        <td>${targetNutrition.carbs} g</td>
      </tr>
      <tr>
        <td>Protein</td>
        <td>${dailyNutrition.protein} g</td>
        <td>${targetNutrition.protein} g</td>
      </tr>
      <tr>
        <td>Fats</td>
        <td>${dailyNutrition.fats} g</td>
        <td>${targetNutrition.fats} g</td>
      </tr>
      <tr>
        <td>Sodium</td>
        <td>${dailyNutrition.sodium} mg</td>
        <td>${targetNutrition.sodium} mg</td>
      </tr>
    </table>
  `;

  const modal = document.getElementById("nutritionModal");
  const modalContentDiv = document.getElementById("nutritionModalContent");
  modalContentDiv.innerHTML = modalContent;
  modal.style.display = "block";
}

function fetchNutritionForDate(date) {
  // Implement this function to fetch actual nutrition data from your database
  // For now, we'll return random values
  return {
    calories: Math.floor(Math.random() * targetNutrition.calories),
    carbs: Math.floor(Math.random() * targetNutrition.carbs),
    protein: Math.floor(Math.random() * targetNutrition.protein),
    fats: Math.floor(Math.random() * targetNutrition.fats),
    sodium: Math.floor(Math.random() * targetNutrition.sodium),
  };
}

function closeNutritionModal() {
  document.getElementById("nutritionModal").style.display = "none";
}

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
  deleteAllMealsFromDB();
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
      mealType,
      image,
      quantity: 1,
    };

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

  meals[mealType].forEach((food, index) => {
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
      <p>Quantity: <button onclick="changeQuantity('${mealType}', ${index}, -1)">-</button> ${food.quantity} <button onclick="changeQuantity('${mealType}', ${index}, 1)">+</button></p>
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

function changeQuantity(mealType, index, change) {
  meals[mealType][index].quantity += change;
  if (meals[mealType][index].quantity < 1) {
    meals[mealType][index].quantity = 1;
  }
  displayFood(mealType);
  updateTotals();
}

function updateTotals() {
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFats = 0;
  let totalSodium = 0;

  for (let mealType in meals) {
    meals[mealType].forEach((food) => {
      totalCalories += food.calories * food.quantity;
      totalCarbs += food.carbs * food.quantity;
      totalProtein += food.protein * food.quantity;
      totalFats += food.fats * food.quantity;
      totalSodium += food.sodium * food.quantity;
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
      console.log("Fetched food items:", data);
      meals.breakfast = [];
      meals.lunch = [];
      meals.dinner = [];
      meals.extras = [];

      data.forEach((food) => {
        if (meals[food.mealType]) {
          meals[food.mealType].push(food);
        }
      });
      displayFood("breakfast");
      displayFood("lunch");
      displayFood("dinner");
      displayFood("extras");
      updateTotals();
    })
    .catch((error) => console.error("Error:", error));
}

function deleteAllMealsFromDB() {
  fetch(baseUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const deletePromises = data.map((item) =>
        fetch(`${baseUrl}/${item._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-apikey": apiKey,
          },
        })
      );

      Promise.all(deletePromises)
        .then(() => {
          console.log("Deleted all meals successfully.");
          fetchFoodItems(); // Refresh the displayed meals
        })
        .catch((error) => console.error("Error deleting meals:", error));
    })
    .catch((error) => console.error("Error fetching meals to delete:", error));
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

  checkDateAndResetData();
  fetchFoodItems();
});

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("addFoodModal");
  if (event.target == modal) {
    closeAddFoodModal();
  }
};

document.getElementById("prevMonth").addEventListener("click", () => {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  generateCalendar(currentMonth, currentYear);
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  generateCalendar(currentMonth, currentYear);
});
