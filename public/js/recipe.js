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

  document.getElementById("nameSearchForm").onsubmit = function (event) {
    event.preventDefault();
    searchByName();
  };

  document.querySelectorAll(".category").forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.dataset.category;
      if (category === "all") {
        fetchRecipes();
      } else {
        fetchRecipesByCategory(category);
      }
    });
  });
});

function fetchRecipes(page = 1, limit = 16) {
  fetch(`http://localhost:3000/api/recipes?page=${page}&limit=${limit}`)
    .then((response) => response.json())
    .then((data) => {
      displayRecipes(data.recipes);
      displayPagination(data.totalPages, data.currentPage);
    })
    .catch((error) => {
      console.error("Error:", error);
      displayRecipes([]);
    });
}

function fetchRecipesByCategory(category) {
  fetch(`http://localhost:3000/api/recipes/category/${category}`)
    .then((response) => response.json())
    .then((data) => {
      displayRecipes(data);
      updateRecipeCount(data.length);
    })
    .catch((error) => console.error("Error:", error));
}
function displayPagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.classList.add("page-button");
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => fetchRecipes(i));
    paginationContainer.appendChild(pageButton);
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

  // Move the recipe count beside the results
  const resultsHeader = document.querySelector(".results h2");

  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    resultsHeader.innerHTML = `Results <span id="recipeCount">(Total recipes: 0)</span>`;
    recipeList.innerHTML = "<p>No recipes found matching your criteria.</p>";
    return;
  }

  resultsHeader.innerHTML = `Results <span id="recipeCount">(Total recipes: ${recipes.length})</span>`;

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
    document.getElementById(
      modalId === "successModal" ? "successMessage" : "errorMessage"
    ).textContent = message;
    modal.style.display = "block";

    function closeModal() {
      modal.style.display = "none";
      resolve();
    }

    span.onclick = closeModal;
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

  fetch("http://localhost:3000/api/recipes", {
    method: "POST",
    body: formData,
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
      showModal("successModal", "Food added successfully!").then(() => {
        fetchRecipes();
        fetchRecipeCount();
        closeAddRecipeModal();
      });
    })
    .catch((error) => {
      if (
        error.error ===
        "A food item with this name already exists in the database."
      ) {
        showModal(
          "errorModal",
          "A food item with this name already exists in the database. Please choose a different food."
        );
      } else {
        showModal(
          "errorModal",
          "An error occurred while adding the food. Please try again."
        );
      }
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

function filterByCalories() {
  const min = document.getElementById("calorieMin").value;
  const max = document.getElementById("calorieMax").value;
  fetch(`http://localhost:3000/api/recipes/calories?min=${min}&max=${max}`)
    .then((response) => response.json())
    .then((data) => {
      displayRecipes(data);
    })
    .catch((error) => console.error("Error:", error));
}

function filterByNutrient() {
  const nutrient = document.getElementById("nutrientSelect").value;
  const min = document.getElementById("nutrientMin").value;
  const max = document.getElementById("nutrientMax").value;

  fetch(
    `http://localhost:3000/api/recipes/nutrient?nutrient=${nutrient}&min=${min}&max=${max}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayRecipes(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      displayRecipes([]);
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
      if (data && Array.isArray(data)) {
        displayRecipes(data);
      } else if (data && typeof data === "object") {
        displayRecipes([data]); // Single recipe wrapped in an array
      } else {
        displayRecipes([]); // Empty array if no recipes found
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      displayRecipes([]); // Empty array on error
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
