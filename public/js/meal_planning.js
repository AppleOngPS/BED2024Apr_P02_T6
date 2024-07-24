const meals = {
  breakfast: [],
  lunch: [],
  dinner: [],
  extras: [],
};

const apiKey = "669f4b5ef3a6b21dce3a79f3";
const baseUrl = "https://bed11-f956.restdb.io/rest/meal-planning";

// Calendar variables
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Target nutritional values (example values, adjust as needed)
const targetNutrition = {
  get calories() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    return loggedInUser ? parseInt(loggedInUser.TargetCalarieIntake) : 2000; // Default to 2000 if not set
  },
  carbs: 250,
  protein: 150,
  fats: 65,
  sodium: 2300,
};
const consumedNutrition = {
  get calories() {
    return this.calculateTotal("calories");
  },
  get carbs() {
    return this.calculateTotal("carbs");
  },
  get protein() {
    return this.calculateTotal("protein");
  },
  get fats() {
    return this.calculateTotal("fats");
  },
  get sodium() {
    return this.calculateTotal("sodium");
  },
  calculateTotal(nutrient) {
    let total = 0;
    for (let mealType in meals) {
      meals[mealType].forEach((food) => {
        total += food[nutrient] * food.quantity;
      });
    }
    return Math.round(total);
  },
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

function showDayDetails(year, month, day) {
  // Create a Date object for the clicked date
  const clickedDate = new Date(year, month, day);

  // Format the date as YYYY-MM-DD
  const formattedDate = `${clickedDate.getFullYear()}-${String(
    clickedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(clickedDate.getDay()).padStart(2, "0")}`;

  let dailyNutrition;

  // Check if the selected date is today
  const today = new Date();
  const isToday =
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate();

  if (isToday) {
    // Use current day's totals for today
    dailyNutrition = {
      calories: parseInt(document.getElementById("total-calories").innerText),
      carbs: parseInt(document.getElementById("total-carbs").innerText),
      protein: parseInt(document.getElementById("total-protein").innerText),
      fats: parseInt(document.getElementById("total-fats").innerText),
      sodium: parseInt(document.getElementById("total-sodium").innerText),
    };
  } else {
    // For past days, use stored data
    const storedData = localStorage.getItem(formattedDate);
    if (storedData) {
      dailyNutrition = JSON.parse(storedData);
    } else {
      dailyNutrition = {
        calories: 0,
        carbs: 0,
        protein: 0,
        fats: 0,
        sodium: 0,
      };
    }
  }

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
        <td>${consumedNutrition.calories} kcal</td>
        <td>${targetNutrition.calories} kcal</td>
      </tr>
      <tr>
        <td>Carbs</td>
        <td>${consumedNutrition.carbs} g</td>
        <td>${targetNutrition.carbs} g</td>
      </tr>
      <tr>
        <td>Protein</td>
        <td>${consumedNutrition.protein} g</td>
        <td>${targetNutrition.protein} g</td>
      </tr>
      <tr>
        <td>Fats</td>
        <td>${consumedNutrition.fats} g</td>
        <td>${targetNutrition.fats} g</td>
      </tr>
      <tr>
        <td>Sodium</td>
        <td>${consumedNutrition.sodium} mg</td>
        <td>${targetNutrition.sodium} mg</td>
      </tr>
    </table>
  `;

  const modal = document.getElementById("nutritionModal");
  const modalContentDiv = document.getElementById("nutritionModalContent");
  modalContentDiv.innerHTML = modalContent;
  modal.style.display = "block";
}

function fetchCaloriesForDate(year, month, day) {
  const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  const storedData = localStorage.getItem(formattedDate);
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    return parsedData.calories;
  }
  return 0; // Return 0 if no data is stored for this date
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

  // Clear the stored data for the current date
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;
  localStorage.removeItem(formattedDate);
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

  // First, check if the food item already exists
  fetch(`${baseUrl}?q={"name":"${name}"}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        // Food item already exists, show prompt
        showFoodExistsPrompt(name);
      } else {
        // Food item doesn't exist, proceed with adding
        addNewFoodItem(
          name,
          calories,
          carbs,
          protein,
          fats,
          sodium,
          mealType,
          imageFile
        );
      }
    })
    .catch((error) =>
      console.error("Error checking for existing food:", error)
    );
}

function showFoodExistsPrompt(foodName) {
  const promptDiv = document.createElement("div");
  promptDiv.classList.add("food-exists-prompt");
  promptDiv.innerHTML = `
    <div class="prompt-content">
      <h3>Food Already Exists</h3>
      <p>"${foodName}" has already been added to the database.</p>
      <button id="closePrompt">OK</button>
    </div>
  `;

  document.body.appendChild(promptDiv);

  document.getElementById("closePrompt").addEventListener("click", () => {
    document.body.removeChild(promptDiv);
  });
}

function addNewFoodItem(
  name,
  calories,
  carbs,
  protein,
  fats,
  sodium,
  mealType,
  imageFile
) {
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
  if (meals[mealType][index].quantity === 1 && change === -1) {
    showDeleteFoodPrompt(mealType, index);
  } else {
    meals[mealType][index].quantity += change;
    if (meals[mealType][index].quantity < 1) {
      meals[mealType][index].quantity = 1;
    }
    displayFood(mealType);
    updateTotals();
  }
}
function showDeleteFoodPrompt(mealType, index) {
  const foodName = meals[mealType][index].name;
  const promptDiv = document.createElement("div");
  promptDiv.classList.add("delete-food-prompt");
  promptDiv.innerHTML = `
    <div class="prompt-content">
      <h3>Delete Food Item</h3>
      <p>Are you sure you want to remove "${foodName}" from your meal plan?</p>
      <div class="prompt-buttons">
        <button id="confirmDelete">Yes, Remove</button>
        <button id="cancelDelete">No, Keep</button>
      </div>
    </div>
  `;

  document.body.appendChild(promptDiv);

  document.getElementById("confirmDelete").addEventListener("click", () => {
    deleteFoodItem(mealType, index);
    document.body.removeChild(promptDiv);
  });

  document.getElementById("cancelDelete").addEventListener("click", () => {
    document.body.removeChild(promptDiv);
  });
}
function deleteFoodItem(mealType, index) {
  const foodItem = meals[mealType][index];
  fetch(`${baseUrl}/${foodItem._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
    },
  })
    .then((response) => response.json())
    .then(() => {
      meals[mealType].splice(index, 1);
      displayFood(mealType);
      updateTotals();
    })
    .catch((error) => console.error("Error deleting food item:", error));
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

  // Update the display
  document.getElementById("total-calories").textContent = totalCalories;
  document.getElementById("total-carbs").textContent = totalCarbs;
  document.getElementById("total-protein").textContent = totalProtein;
  document.getElementById("total-fats").textContent = totalFats;
  document.getElementById("total-sodium").textContent = totalSodium;

  // Store the data for the current date
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
  const dailyData = {
    calories: totalCalories,
    carbs: totalCarbs,
    protein: totalProtein,
    fats: totalFats,
    sodium: totalSodium,
  };
  localStorage.setItem(formattedDate, JSON.stringify(dailyData));

  // Update the calendar display
  generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
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
