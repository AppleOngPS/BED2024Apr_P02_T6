document.addEventListener("DOMContentLoaded", function () {
  const addItemBtn = document.getElementById("add-item-btn");
  const foodModal = document.getElementById("foodModal");
  const foodForm = document.getElementById("foodForm");
  const foodList = document.getElementById("food-list");
  const submitBtn = document.getElementById("submit-btn");
  const modalTitle = document.getElementById("modal-title");
  const foodId = document.getElementById("food-id");

  addItemBtn.addEventListener("click", () => {
    openModal("Create Item");
  });

  foodForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(foodForm);
    if (submitBtn.innerText === "Create Item") {
      createFoodItem(formData);
    } else {
      updateFoodItem(foodId.value, formData);
    }
  });

  function openModal(title) {
    modalTitle.innerText = title;
    foodModal.style.display = "block";
  }

  function closeModal() {
    foodModal.style.display = "none";
    foodForm.reset();
  }

  function createFoodItem(formData) {
    fetch("http://localhost:3000/api/foods", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Created food item:", data);
        closeModal();
        fetchFoodItems();
      })
      .catch((error) => console.error("Error:", error));
  }

  function updateFoodItem(id, formData) {
    fetch(`http://localhost:3000/api/foods/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Updated food item:", data);
        closeModal();
        fetchFoodItems();
      })
      .catch((error) => console.error("Error:", error));
  }

  function deleteFoodItem(id) {
    fetch(`http://localhost:3000/api/foods/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Deleted food item:", data);
        fetchFoodItems();
      })
      .catch((error) => console.error("Error:", error));
  }

  function fetchFoodItems() {
    fetch("http://localhost:3000/api/foods")
      .then((response) => response.json())
      .then((data) => {
        foodList.innerHTML = "";
        data.forEach((food) => {
          const foodItem = document.createElement("div");
          foodItem.classList.add("food-item");
          foodItem.innerHTML = `
              <img src="${food.image}" alt="${food.name}">
              <p>${food.name}</p>
              <button onclick="viewFoodItem(${food.id})">View</button>
              <button onclick="deleteFoodItem(${food.id})">Delete</button>
            `;
          foodList.appendChild(foodItem);
        });
      })
      .catch((error) => console.error("Error:", error));
  }

  function viewFoodItem(id) {
    fetch(`http://localhost:3000/api/foods/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("View food item:", data);
        foodId.value = data.id;
        document.getElementById("food-name").value = data.name;
        document.getElementById("food-group").value = data.group_type;
        document.getElementById("food-description").value = data.description;
        document.getElementById("food-nutrients").value = data.nutrients;
        submitBtn.innerText = "Update Item";
        openModal("View Food Item");
      })
      .catch((error) => console.error("Error:", error));
  }

  fetchFoodItems();

  window.onclick = function (event) {
    if (event.target === foodModal) {
      closeModal();
    }
  };
});
