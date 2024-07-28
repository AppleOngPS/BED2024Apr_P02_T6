document.addEventListener("DOMContentLoaded", function () {
  fetchRecipes();
  fetchRecipeCount();
  document.getElementById("addRecipeForm").onsubmit = function (event) {
    event.preventDefault();
    addRecipe();
  };

  const filterToggles = document.querySelectorAll(".filter-toggle");

  filterToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const filterBox = this.closest(".filter-box");
      filterBox.classList.toggle("expanded");
    });
  });

  document.getElementById("nameSearchForm").onsubmit = function (event) {
    event.preventDefault();
    searchByName();
  };

  document.querySelectorAll(".category").forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.dataset.category;
      if (category === "all") {
        fetchRecipes(); // Fetch all recipes if "All" is selected
      } else {
        fetchRecipesByCategory(category);
      }
    });
  });
});
function filterRecipes(category) {
  fetch("http://localhost:3000/api/recipes")
    .then((response) => response.json())
    .then((data) => {
      const filteredRecipes = data.filter(
        (recipe) => recipe.category.toLowerCase() === category
      );
      displayRecipes(filteredRecipes);
    })
    .catch((error) => console.error("Error:", error));
}

function fetchRecipes(page = 1, limit = 16) {
  fetch(`http://localhost:3000/api/recipes?page=${page}&limit=${limit}`)
    .then((response) => response.json())
    .then((data) => {
      displayRecipes(data.recipes, data.totalRecipes);
      displayPagination(
        data.totalPages,
        data.currentPage,
        data.totalRecipes,
        limit,
        fetchRecipes
      );
      updateTotalRecipeCount(data.totalRecipes);
    })
    .catch((error) => {
      console.error("Error:", error);
      displayRecipes([]);
    });
}

function fetchRecipesByCategory(category, page = 1, limit = 16) {
  fetch(
    `http://localhost:3000/api/recipes/category/${encodeURIComponent(
      category
    )}?page=${page}&limit=${limit}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayRecipes(data.recipes, data.totalRecipes);
      displayPagination(
        data.totalPages,
        data.currentPage,
        data.totalRecipes,
        limit,
        (newPage, newLimit) =>
          fetchRecipesByCategory(category, newPage, newLimit)
      );
      updateTotalRecipeCount(data.totalRecipes);
    })
    .catch((error) => console.error("Error:", error));
}

function updateTotalRecipeCount(count) {
  const totalRecipesElement = document.getElementById("totalRecipes");
  if (totalRecipesElement) {
    totalRecipesElement.textContent = `Total Recipes: ${count}`;
  }
  // Update the results header as well
  const resultsHeader = document.querySelector(".results h2");
  if (resultsHeader) {
    resultsHeader.innerHTML = `Results <span id="recipeCount">(Total Recipes: ${count})</span>`;
  }
}

function displayPagination(
  totalPages,
  currentPage,
  totalRecipes,
  limit = 16,
  filterFunction
) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const maxVisiblePages = 3;

  for (let i = 1; i <= maxVisiblePages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.classList.add("page-button");
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => filterFunction(i, limit));

    if ((i === 2 && totalRecipes < 17) || (i === 3 && totalRecipes < 33)) {
      pageButton.style.display = "none";
    }

    paginationContainer.appendChild(pageButton);
  }

  if (totalRecipes <= limit) {
    paginationContainer.style.display = "none";
  } else {
    paginationContainer.style.display = "block";
  }
}

function displayRecipes(recipes, totalRecipes) {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = "";

  const resultsHeader = document.querySelector(".results h2");

  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    resultsHeader.innerHTML = `Results <span id="recipeCount">(Recipes found: 0)</span>`;
    recipeList.innerHTML = "<p>No recipes found matching your criteria.</p>";
    return;
  }

  resultsHeader.innerHTML = `Results <span id="recipeCount">(Total Recipes: ${totalRecipes})</span>`;

  recipes.forEach((recipe) => {
    if (!recipe) return;

    const recipeItem = document.createElement("div");
    recipeItem.classList.add("recipe-item");
    recipeItem.addEventListener("click", () => fetchRecipeDetails(recipe.id));

    const recipeImage = document.createElement("img");
    recipeImage.src = `../images/recipe-${recipe.id}.avif`;
    recipeImage.alt = recipe.name;

    const details = document.createElement("div");
    details.classList.add("details");
    details.innerHTML = `
      <p>${recipe.name || "Unnamed Recipe"}</p>
      <p>kcal: ${recipe.calories || "N/A"} | c: ${
      recipe.carbs || "N/A"
    }g | p: ${recipe.protein || "N/A"}g | f: ${recipe.fats || "N/A"}g</p>
    `;

    recipeItem.appendChild(recipeImage);
    recipeItem.appendChild(details);
    recipeList.appendChild(recipeItem);
  });

  updateRecipeCount(recipes.length);
}

function fetchRecipeDetails(id) {
  fetch(`http://localhost:3000/api/recipes/${id}`)
    .then((response) => response.json())
    .then((recipe) => {
      showRecipeDetails(recipe);
    })
    .catch((error) => console.error("Error:", error));
}

function showRecipeDetails(recipe) {
  const modal = document.getElementById("recipeModal");
  const modalContent = modal.querySelector(".modal-content");

  // Clear existing content
  modalContent.innerHTML = "";

  // Create and append close button
  const closeBtn = document.createElement("span");
  closeBtn.className = "close";
  closeBtn.innerHTML = "&times;";
  modalContent.appendChild(closeBtn);

  // Create and append recipe details
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "recipe-details";
  detailsContainer.innerHTML = `
    <h2>${recipe.name}</h2>
    <p><strong>Category:</strong> ${recipe.category}</p>
    <h3>Description</h3>
    <p>${recipe.description}</p>
    <h3>Ingredients</h3>
    <p>${recipe.ingredients}</p>
    <h3>Nutritional Information</h3>
    <div class="nutrition-info">
      <p><strong>Calories:</strong> ${recipe.calories}</p>
      <p><strong>Carbs:</strong> ${recipe.carbs}g</p>
      <p><strong>Protein:</strong> ${recipe.protein}g</p>
      <p><strong>Fats:</strong> ${recipe.fats}g</p>
    </div>
  `;
  modalContent.appendChild(detailsContainer);

  // Create and append edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit Recipe";
  editButton.className = "edit-button";
  editButton.onclick = () => openEditRecipeModal(recipe);
  modalContent.appendChild(editButton);

  // Create and append delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Recipe";
  deleteButton.className = "delete-button";
  modalContent.appendChild(deleteButton);

  // Event listeners
  closeBtn.onclick = closeRecipeModal;
  deleteButton.onclick = () => showConfirmModal(recipe.id);

  modal.style.display = "block";

  // Close modal when clicking outside
  window.onclick = function (event) {
    if (event.target == modal) {
      closeRecipeModal();
    }
  };
}

function showConfirmModal(recipeId) {
  const confirmModal = document.getElementById("confirmModal");
  const cancelButton = document.getElementById("cancelDelete");
  const confirmButton = document.getElementById("confirmDelete");

  confirmModal.style.display = "block";

  cancelButton.onclick = function () {
    confirmModal.style.display = "none";
  };

  confirmButton.onclick = function () {
    deleteRecipe(recipeId);
    closeRecipeModal();
    confirmModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == confirmModal) {
      confirmModal.style.display = "none";
    }
  };
}

function showModal(modalId, message) {
  return new Promise((resolve) => {
    const modal = document.getElementById(modalId);
    const span = modal.getElementsByClassName("close")[0];
    const messageElement = document.getElementById(
      modalId === "successModal" ? "successMessage" : "errorMessage"
    );
    messageElement.textContent = message;
    modal.style.display = "block";

    function closeModal() {
      modal.style.display = "none";
      if (modalId === "successModal") {
        location.reload();
      }
      resolve();
    }

    span.onclick = closeModal;

    // Add OK button to both modals
    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.onclick = closeModal;
    messageElement.parentNode.insertBefore(messageElement.nextSibling);

    if (modalId !== "successModal") {
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
          resolve();
        }
      };
    }
  });
}

function closeRecipeModal() {
  document.getElementById("recipeModal").style.display = "none";
}

function addRecipe(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  console.log("addRecipe function called"); // Debugging line
  const form = document.getElementById("addRecipeForm");
  const formData = new FormData(form);

  const name = formData.get("name");

  // Disable the submit button to prevent double submission
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  // First, check if the recipe already exists (case-insensitive)
  fetch(`http://localhost:3000/api/recipes/name/${encodeURIComponent(name)}`)
    .then((response) => {
      if (response.status === 404) {
        // Recipe doesn't exist, proceed with adding
        return null;
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.name.toLowerCase() === name.toLowerCase()) {
        // Recipe already exists (case-insensitive match), show prompt
        showRecipeExistsPrompt(data.name);
      } else {
        // No exact match found or response was 404, proceed with adding
        return addNewRecipe(formData);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showModal(
        "errorModal",
        `An error occurred while checking for existing recipe: ${error.message}`
      );
    })
    .finally(() => {
      // Re-enable the submit button
      if (submitButton) submitButton.disabled = false;
    });
}

function showRecipeExistsPrompt(recipeName) {
  // Remove any existing prompt
  const existingPrompt = document.querySelector(".recipe-exists-prompt");
  if (existingPrompt) {
    existingPrompt.remove();
  }

  const promptDiv = document.createElement("div");
  promptDiv.classList.add("recipe-exists-prompt");

  // Add inline styles to ensure the prompt is above everything
  promptDiv.style.position = "fixed";
  promptDiv.style.top = "0";
  promptDiv.style.left = "0";
  promptDiv.style.width = "100%";
  promptDiv.style.height = "100%";
  promptDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  promptDiv.style.display = "flex";
  promptDiv.style.justifyContent = "center";
  promptDiv.style.alignItems = "center";
  promptDiv.style.zIndex = "100000"; // Very high z-index

  promptDiv.innerHTML = `
    <div class="prompt-content" style="background-color: white; padding: 20px; border-radius: 5px; text-align: center; max-width: 80%; position: relative; z-index: 100001;">
      <h3>Recipe Already Exists</h3>
      <p>"${recipeName}" has already been added to the database.</p>
      <button id="closePrompt" style="margin-top: 10px; padding: 5px 10px; background-color: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">OK</button>
    </div>
  `;

  document.body.appendChild(promptDiv);

  document.getElementById("closePrompt").addEventListener("click", () => {
    document.body.removeChild(promptDiv);
  });

  // Close the prompt when clicking outside the content
  promptDiv.addEventListener("click", (event) => {
    if (event.target === promptDiv) {
      document.body.removeChild(promptDiv);
    }
  });
}

function addNewRecipe(formData) {
  // Check if all fields are filled, including the image
  const requiredFields = [
    "name",
    "category",
    "description",
    "ingredients",
    "calories",
    "carbs",
    "protein",
    "fats",
    "image",
  ];
  let allFieldsFilled = true;
  let missingFields = [];

  for (let field of requiredFields) {
    if (field === "image") {
      if (!formData.get("image").size) {
        allFieldsFilled = false;
        missingFields.push("Image");
      }
    } else if (!formData.get(field)) {
      allFieldsFilled = false;
      missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
    }
  }

  if (!allFieldsFilled) {
    showModal(
      "errorModal",
      `All fields must be filled, including the image. Missing fields: ${missingFields.join(
        ", "
      )}`
    );
    return;
  }

  return fetch("http://localhost:3000/api/recipes", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      return response.json();
    })
    .then((data) => {
      showModal("successModal", "Recipe added successfully!").then(() => {
        fetchRecipes();
        fetchRecipeCount();
        closeAddRecipeModal();
        document.getElementById("addRecipeForm").reset();
      });
    })
    .catch((error) => {
      console.error("Error details:", error);
      showModal(
        "errorModal",
        `An error occurred while adding the recipe: ${error.message}`
      );
    });
}
document.getElementById("addRecipeForm").addEventListener("submit", addRecipe);
let currentRecipe = null;

function openEditRecipeModal(recipe) {
  const modal = document.getElementById("editRecipeModal");
  modal.style.display = "block";

  // Populate the form with current recipe data
  document.getElementById("edit-recipe-id").value = recipe.id;
  document.getElementById("edit-recipe-name").value = recipe.name;
  document.getElementById("edit-recipe-category").value = recipe.category;
  document.getElementById("edit-recipe-description").value = recipe.description;
  document.getElementById("edit-recipe-ingredients").value = recipe.ingredients;
  document.getElementById("edit-recipe-calories").value = recipe.calories;
  document.getElementById("edit-recipe-carbs").value = recipe.carbs;
  document.getElementById("edit-recipe-protein").value = recipe.protein;
  document.getElementById("edit-recipe-fats").value = recipe.fats;

  // Store the current recipe for comparison later
  currentRecipe = {
    id: recipe.id,
    name: recipe.name,
    category: recipe.category,
    description: recipe.description,
    ingredients: recipe.ingredients,
    calories: recipe.calories,
    carbs: recipe.carbs,
    protein: recipe.protein,
    fats: recipe.fats,
  };
}
function closeAddRecipeModal() {
  document.getElementById("addRecipeModal").style.display = "none";
  clearAddRecipeForm();
}
function clearAddRecipeForm() {
  document.getElementById("addRecipeForm").reset();
  document.getElementById("recipe-image").value = "";
}
function updateRecipe(event) {
  event.preventDefault();
  const form = document.getElementById("editRecipeForm");
  const formData = new FormData(form);

  let changesDetected = false;
  const keysToCheck = [
    "name",
    "category",
    "description",
    "ingredients",
    "calories",
    "carbs",
    "protein",
    "fats",
  ];

  const jsonData = {};

  for (let key of keysToCheck) {
    let value = formData.get(key);

    // Convert numeric values to numbers for comparison
    if (
      key === "calories" ||
      key === "carbs" ||
      key === "protein" ||
      key === "fats"
    ) {
      value = parseInt(value);
    }

    jsonData[key] = value;

    if (value !== currentRecipe[key]) {
      changesDetected = true;
      console.log(
        `Change detected in ${key}: ${currentRecipe[key]} -> ${value}`
      );
    }
  }

  // Check if a new image is uploaded
  const imageFile = formData.get("image");
  if (imageFile && imageFile.size > 0) {
    changesDetected = true;
    console.log("New image uploaded");
  }

  if (!changesDetected) {
    showPrompt("No changes were made to the recipe.");
    return;
  }

  console.log("Changes detected, sending update request");

  // If changes were detected, proceed with the update
  fetch(`http://localhost:3000/api/recipes/${currentRecipe.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw err;
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Server response:", data);
      if (!changesDetected) {
        showPrompt("No changes were made to the recipe.");
      } else {
        showPrompt("Recipe updated successfully!");
        closeEditRecipeModal();
        fetchRecipes();
        closeRecipeModal();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      let errorMessage = "An error occurred while updating the recipe.";
      if (error.errors && Array.isArray(error.errors)) {
        errorMessage += " " + error.errors.join(", ");
      }
      showPrompt(errorMessage);
    });
}

function showPrompt(message, type = "info") {
  // Remove any existing prompt
  const existingPrompt = document.querySelector(".prompt-overlay");
  if (existingPrompt) {
    existingPrompt.remove();
  }

  // Create a new prompt
  const promptOverlay = document.createElement("div");
  promptOverlay.className = "prompt-overlay";

  const promptContent = document.createElement("div");
  promptContent.className = `prompt-content ${type}`;

  const messageElement = document.createElement("p");
  messageElement.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.textContent = "OK";
  closeButton.onclick = () => promptOverlay.remove();

  promptContent.appendChild(messageElement);
  promptContent.appendChild(closeButton);
  promptOverlay.appendChild(promptContent);

  // Append the prompt to the body
  document.body.appendChild(promptOverlay);
}
document
  .getElementById("editRecipeForm")
  .addEventListener("submit", updateRecipe);

function deleteRecipe(id) {
  fetch(`http://localhost:3000/api/recipes/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Deleted recipe:", data);
      fetchRecipes();
    })
    .catch((error) => console.error("Error:", error));
}

function openAddRecipeModal() {
  document.getElementById("addRecipeModal").style.display = "block";
}

function filterByCalories(page = 1, limit = 16) {
  const min = document.getElementById("calorieMin").value;
  const max = document.getElementById("calorieMax").value;
  if (!min && !max) {
    showModal(
      "errorModal",
      "Please enter the minimum and maximum calorie value."
    );
    return;
  }

  if ((min && !max) || (!min && max)) {
    showModal(
      "errorModal",
      "Please enter both minimum and maximum calorie values for a range search."
    );
    return;
  }

  fetch(
    `http://localhost:3000/api/recipes/calories?min=${min}&max=${max}&page=${page}&limit=${limit}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.recipes)) {
        displayRecipes(data.recipes, data.totalRecipes);
        displayPagination(
          data.totalPages,
          data.currentPage,
          data.totalRecipes,
          limit,
          (newPage, newLimit) => filterByCalories(newPage, newLimit)
        );
        updateTotalRecipeCount(data.totalRecipes);
      } else {
        console.error("Unexpected response format:", data);
        displayRecipes([]);
        displayPagination(1, 1, 0, limit, (newPage, newLimit) =>
          filterByCalories(newPage, newLimit)
        );
        updateTotalRecipeCount(0);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      displayRecipes([]);
      displayPagination(1, 1, 0, limit, (newPage, newLimit) =>
        filterByCalories(newPage, newLimit)
      );
      updateTotalRecipeCount(0);
    });
}

function filterByNutrient(page = 1, limit = 16) {
  const nutrient = document.getElementById("nutrientSelect").value;
  const min = document.getElementById("nutrientMin").value;
  const max = document.getElementById("nutrientMax").value;
  if (!min && !max) {
    showModal(
      "errorModal",
      "Please enter the minimum and maximum nutrient value."
    );
    return;
  }

  if ((min && !max) || (!min && max)) {
    showModal(
      "errorModal",
      `Please enter both minimum and maximum ${nutrient} values for a range search.`
    );
    return;
  }

  fetch(
    `http://localhost:3000/api/recipes/nutrient?nutrient=${nutrient}&min=${min}&max=${max}&page=${page}&limit=${limit}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data.recipes)) {
        displayRecipes(data.recipes, data.totalRecipes);
        displayPagination(
          data.totalPages,
          data.currentPage,
          data.totalRecipes,
          limit,
          (newPage, newLimit) => filterByNutrient(newPage, newLimit)
        );
        updateTotalRecipeCount(data.totalRecipes);
      } else {
        console.error("Unexpected response format:", data);
        displayRecipes([]);
        displayPagination(1, 1, 0, limit, (newPage, newLimit) =>
          filterByNutrient(newPage, newLimit)
        );
        updateTotalRecipeCount(0);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      displayRecipes([]);
      displayPagination(1, 1, 0, limit, (newPage, newLimit) =>
        filterByNutrient(newPage, newLimit)
      );
      updateTotalRecipeCount(0);
    });
}

function searchByIngredient(page = 1, limit = 16) {
  const ingredient = document.getElementById("ingredientSearch").value.trim();
  if (!ingredient) {
    showModal("errorModal", "Please enter an ingredient to search for.");
    return;
  }

  fetch(
    `http://localhost:3000/api/recipes/search?ingredient=${encodeURIComponent(
      ingredient
    )}&page=${page}&limit=${limit}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data.recipes) && data.recipes.length > 0) {
        displayRecipes(data.recipes, data.totalRecipes);
        displayPagination(
          data.totalPages,
          data.currentPage,
          data.totalRecipes,
          limit,
          (newPage, newLimit) => searchByIngredient(newPage, newLimit)
        );
        updateTotalRecipeCount(data.totalRecipes);
      } else {
        displayNoResults();
        // Hide pagination when no results are found
        const paginationContainer = document.getElementById("pagination");
        if (paginationContainer) {
          paginationContainer.style.display = "none";
        }
        // Update the total recipe count to 0
        updateTotalRecipeCount(0);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      displayNoResults();
      // Hide pagination on error
      const paginationContainer = document.getElementById("pagination");
      if (paginationContainer) {
        paginationContainer.style.display = "none";
      }
      // Update the total recipe count to 0
      updateTotalRecipeCount(0);
    });
}

function searchByName() {
  const name = document.getElementById("nameSearch").value;
  if (!name) {
    showModal("errorModal", "Please enter a recipe name to search for.");
    return;
  }
  fetch(`http://localhost:3000/api/recipes/name/${encodeURIComponent(name)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        displayRecipes([data], 1); // Display single recipe, total count is 1
      } else {
        displayRecipes([], 0); // No recipes found
      }
      // Remove pagination
      const paginationContainer = document.getElementById("pagination");
      if (paginationContainer) {
        paginationContainer.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      displayRecipes([], 0); // Error occurred
      // Remove pagination
      const paginationContainer = document.getElementById("pagination");
      if (paginationContainer) {
        paginationContainer.style.display = "none";
      }
    });
}

function displayNoResults() {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = "<p>No recipes found matching your search.</p>";
  updateRecipeCount(0);
  // Update the total recipes display
  updateTotalRecipeCount(0);
}

function fetchRandomRecipe() {
  fetch("http://localhost:3000/api/recipes/random")
    .then((response) => response.json())
    .then((recipe) => {
      showRecipeDetails(recipe);
    })
    .catch((error) => console.error("Error:", error));
}

function fetchRecipeCount() {
  fetch("http://localhost:3000/api/recipes/count")
    .then((response) => response.json())
    .then((data) => {
      updateRecipeCount(data.count);
    })
    .catch((error) => console.error("Error:", error));
}

function updateRecipeCount(count) {
  //document.getElementById("recipeCount").textContent = `Total recipes: ${count || 0}`;
}
document
  .getElementById("editRecipeForm")
  .addEventListener("submit", updateRecipe);
