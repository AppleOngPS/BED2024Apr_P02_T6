// document.addEventListener("DOMContentLoaded", function () {
//   fetchRecipes();
//   document.getElementById("addRecipeForm").onsubmit = function (event) {
//     event.preventDefault();
//     addRecipe();
//   };

//   document.querySelectorAll(".category").forEach((button) => {
//     button.addEventListener("click", function () {
//       const category = this.dataset.category;
//       if (category === "all") {
//         fetchRecipes(); // Fetch all recipes if "All" is selected
//       } else {
//         filterRecipes(category);
//       }
//     });
//   });
// });

// function fetchRecipes() {
//   fetch("http://localhost:3000/api/recipes")
//     .then((response) => response.json())
//     .then((data) => {
//       displayRecipes(data);
//     })
//     .catch((error) => console.error("Error:", error));
// }

// function displayRecipes(recipes) {
//   const recipeList = document.getElementById("recipe-list");
//   recipeList.innerHTML = "";
//   recipes.forEach((recipe) => {
//     const recipeItem = document.createElement("div");
//     recipeItem.classList.add("recipe-item");
//     recipeItem.addEventListener("click", () => showRecipeDetails(recipe));

//     const recipeImage = document.createElement("img");
//     recipeImage.src = `../images/recipe-${recipe.id}.avif`;
//     recipeImage.alt = recipe.name;

//     const details = document.createElement("div");
//     details.classList.add("details");
//     details.innerHTML = `
//       <p>${recipe.name}</p>
//       <p>kcal: ${recipe.calories} | c: ${recipe.carbs}g | p: ${recipe.protein}g | f: ${recipe.fats}g</p>
//     `;

//     recipeItem.appendChild(recipeImage);
//     recipeItem.appendChild(details);
//     recipeList.appendChild(recipeItem);
//   });
// }

// function showRecipeDetails(recipe) {
//   const modal = document.getElementById("recipeModal");
//   document.getElementById("modal-recipe-name").textContent = recipe.name;
//   document.getElementById("modal-recipe-category").textContent =
//     recipe.category;
//   document.getElementById("modal-recipe-description").textContent =
//     recipe.description;
//   document.getElementById("modal-recipe-ingredients").textContent =
//     recipe.ingredients;

//   modal.style.display = "block";

//   const closeBtn = modal.querySelector(".close");
//   closeBtn.onclick = function () {
//     modal.style.display = "none";
//   };

//   window.onclick = function (event) {
//     if (event.target == modal) {
//       modal.style.display = "none";
//     }
//   };
// }

// function showModal(modalId, message) {
//   return new Promise((resolve) => {
//     const modal = document.getElementById(modalId);
//     const span = modal.getElementsByClassName("close")[0];
//     document.getElementById(
//       modalId === "successModal" ? "successMessage" : "errorMessage"
//     ).textContent = message;
//     modal.style.display = "block";

//     function closeModal() {
//       modal.style.display = "none";
//       resolve();
//     }

//     span.onclick = closeModal;
//     window.onclick = function (event) {
//       if (event.target == modal) {
//         closeModal();
//       }
//     };
//   });
// }

// function closeRecipeModal() {
//   document.getElementById("recipeModal").style.display = "none";
// }

// function addRecipe() {
//   const form = document.getElementById("addRecipeForm");
//   const formData = new FormData(form);

//   fetch("http://localhost:3000/api/recipes", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => {
//       if (!response.ok) {
//         return response.json().then((err) => {
//           throw err;
//         });
//       }
//       return response.json();
//     })
//     .then((data) => {
//       showModal("successModal", "Recipe added successfully!").then(() => {
//         fetchRecipes();
//         closeAddRecipeModal();
//       });
//     })
//     .catch((error) => {
//       if (
//         error.error ===
//         "A recipe with this name already exists in the database."
//       ) {
//         showModal(
//           "errorModal",
//           "A recipe with this name already exists in the database. Please choose a different name."
//         );
//       } else {
//         showModal(
//           "errorModal",
//           "An error occurred while adding the recipe. Please try again."
//         );
//       }
//     });
// }

// function deleteRecipe(id) {
//   fetch(`http://localhost:3000/api/recipes/${id}`, {
//     method: "DELETE",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Deleted recipe:", data);
//       fetchRecipes();
//     })
//     .catch((error) => console.error("Error:", error));
// }

// function openAddRecipeModal() {
//   document.getElementById("addRecipeModal").style.display = "block";
// }

// function closeAddRecipeModal() {
//   document.getElementById("addRecipeModal").style.display = "none";
// }

// function filterRecipes(category) {
//   fetch("http://localhost:3000/api/recipes")
//     .then((response) => response.json())
//     .then((data) => {
//       const filteredRecipes = data.filter(
//         (recipe) => recipe.category.toLowerCase() === category
//       );
//       displayRecipes(filteredRecipes);
//     })
//     .catch((error) => console.error("Error:", error));
// }

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
      displayRecipes(data.recipes);
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

function updateTotalRecipeCount(count) {
  const totalRecipesElement = document.getElementById("totalRecipes");
  if (totalRecipesElement) {
    totalRecipesElement.textContent = `Total Recipes: ${count}`;
  }
}

function fetchRecipesByCategory(category, page = 1, limit = 16) {
  fetch(
    `http://localhost:3000/api/recipes/category/${encodeURIComponent(
      category
    )}?page=${page}&limit=${limit}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayRecipes(data.recipes);
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

// function displayRecipes(recipes) {
//   const recipeList = document.getElementById("recipe-list");
//   recipeList.innerHTML = "";

//   // Ensure recipes is always an array
//   const recipeArray = Array.isArray(recipes) ? recipes : [recipes];

//   recipeArray.forEach((recipe) => {
//     const recipeItem = document.createElement("div");
//     recipeItem.classList.add("recipe-item");
//     recipeItem.addEventListener("click", () => fetchRecipeDetails(recipe.id));

//     const recipeImage = document.createElement("img");
//     recipeImage.src = `../images/recipe-${recipe.id}.avif`;
//     recipeImage.alt = recipe.name;

//     const details = document.createElement("div");
//     details.classList.add("details");
//     details.innerHTML = `
//       <p>${recipe.name}</p>
//       <p>kcal: ${recipe.calories} | c: ${recipe.carbs}g | p: ${recipe.protein}g | f: ${recipe.fats}g</p>
//     `;

//     recipeItem.appendChild(recipeImage);
//     recipeItem.appendChild(details);
//     recipeList.appendChild(recipeItem);
//   });

//   updateRecipeCount(recipeArray.length);
// }

function displayRecipes(recipes) {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = "";

  const resultsHeader = document.querySelector(".results h2");

  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    resultsHeader.innerHTML = `Results <span id="recipeCount">(Recipes found: 0)</span>`;
    recipeList.innerHTML = "<p>No recipes found matching your criteria.</p>";
    return;
  }

  resultsHeader.innerHTML = `Results <span id="recipeCount">(Recipes found: ${recipes.length})</span>`;

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
  `;
  modalContent.appendChild(detailsContainer);

  // Create and append delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Recipe";
  deleteButton.className = "delete-button";
  modalContent.appendChild(deleteButton);

  // Event listeners
  closeBtn.onclick = closeRecipeModal;
  deleteButton.onclick = function () {
    showConfirmModal(recipe.id);
  };

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
      resolve();
    }

    span.onclick = closeModal;

    // Add OK button to both modals
    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.onclick = closeModal;
    messageElement.parentNode.insertBefore(
      //okButton,
      messageElement.nextSibling
    );

    window.onclick = function (event) {
      if (event.target == modal) {
        closeModal();
      }
    };
  });
}

function closeRecipeModal() {
  document.getElementById("recipeModal").style.display = "none";
}

function addRecipe() {
  const form = document.getElementById("addRecipeForm");
  const formData = new FormData(form);

  const name = formData.get("name");

  // First, check if the recipe already exists (case-insensitive)
  fetch(`http://localhost:3000/api/recipes/name/${encodeURIComponent(name)}`)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          // Recipe doesn't exist, proceed with adding
          return addNewRecipe(formData);
        } else {
          throw new Error("Error checking for existing recipe");
        }
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.name.toLowerCase() === name.toLowerCase()) {
        // Recipe already exists (case-insensitive match), show prompt
        showRecipeExistsPrompt(data.name);
      } else {
        // No exact match found, proceed with adding
        return addNewRecipe(formData);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showModal(
        "errorModal",
        `An error occurred while checking for existing recipe: ${error.message}`
      );
    });
}

function showRecipeExistsPrompt(recipeName) {
  const promptDiv = document.createElement("div");
  promptDiv.classList.add("recipe-exists-prompt");
  promptDiv.innerHTML = `
    <div class="prompt-content">
      <h3>Recipe Already Exists</h3>
      <p>"${recipeName}" has already been added to the database.</p>
      <button id="closePrompt">OK</button>
    </div>
  `;

  document.body.appendChild(promptDiv);

  document.getElementById("closePrompt").addEventListener("click", () => {
    document.body.removeChild(promptDiv);
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

  fetch("http://localhost:3000/api/recipes", {
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

function closeAddRecipeModal() {
  document.getElementById("addRecipeModal").style.display = "none";
}

function filterByCalories(page = 1, limit = 16) {
  const min = document.getElementById("calorieMin").value;
  const max = document.getElementById("calorieMax").value;
  fetch(
    `http://localhost:3000/api/recipes/calories?min=${min}&max=${max}&page=${page}&limit=${limit}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.recipes)) {
        displayRecipes(data.recipes);
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
        displayRecipes(data.recipes);
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

function searchByIngredient() {
  const ingredient = document.getElementById("ingredientSearch").value;
  fetch(
    `http://localhost:3000/api/recipes/search?ingredient=${encodeURIComponent(
      ingredient
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayRecipes(data);
    })
    .catch((error) => console.error("Error:", error));
}

function searchByName() {
  const name = document.getElementById("nameSearch").value;
  fetch(`http://localhost:3000/api/recipes/name/${encodeURIComponent(name)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        displayRecipes([data]); // Display single recipe as an array
      } else {
        displayRecipes([]); // Empty array if no recipe found
      }
      // Remove pagination
      const paginationContainer = document.getElementById("pagination");
      if (paginationContainer) {
        paginationContainer.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      displayRecipes([]); // Empty array on error
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
