document.addEventListener("DOMContentLoaded", function () {
  fetchRecipes();
  document.getElementById("addRecipeForm").onsubmit = function (event) {
    event.preventDefault();
    addRecipe();
  };

  document.querySelectorAll(".category").forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.dataset.category;
      if (category === "all") {
        fetchRecipes(); // Fetch all recipes if "All" is selected
      } else {
        filterRecipes(category);
      }
    });
  });
});

function fetchRecipes() {
  fetch("http://localhost:3000/api/recipes")
    .then((response) => response.json())
    .then((data) => {
      displayRecipes(data);
    })
    .catch((error) => console.error("Error:", error));
}

function displayRecipes(recipes) {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeItem = document.createElement("div");
    recipeItem.classList.add("recipe-item");
    recipeItem.addEventListener("click", () => showRecipeDetails(recipe));

    const recipeImage = document.createElement("img");
    recipeImage.src = `../images/recipe-${recipe.id}.avif`;
    recipeImage.alt = recipe.name;

    const details = document.createElement("div");
    details.classList.add("details");
    details.innerHTML = `
      <p>${recipe.name}</p>
      <p>kcal: ${recipe.calories} | c: ${recipe.carbs}g | p: ${recipe.protein}g | f: ${recipe.fats}g</p>
    `;

    recipeItem.appendChild(recipeImage);
    recipeItem.appendChild(details);
    recipeList.appendChild(recipeItem);
  });
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
      showModal("successModal", "Recipe added successfully!").then(() => {
        fetchRecipes();
        closeAddRecipeModal();
      });
    })
    .catch((error) => {
      if (
        error.error ===
        "A recipe with this name already exists in the database."
      ) {
        showModal(
          "errorModal",
          "A recipe with this name already exists in the database. Please choose a different name."
        );
      } else {
        showModal(
          "errorModal",
          "An error occurred while adding the recipe. Please try again."
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
