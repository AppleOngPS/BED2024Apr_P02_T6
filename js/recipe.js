document.addEventListener("DOMContentLoaded", function () {
  fetchRecipes();
  document.getElementById("addRecipeForm").onsubmit = function (event) {
    event.preventDefault();
    addRecipe();
  };

  document.querySelectorAll(".category").forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.dataset.category;
      filterRecipes(category);
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

    const recipeImage = document.createElement("img");
    recipeImage.src = `../images/recipe-${recipe.id}.avif`;
    recipeImage.alt = recipe.name;
    recipeImage.addEventListener("click", () => showRecipeDetails(recipe)); // Ensure this event listener is properly set

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

function showRecipeDetails(recipe) {
  document.getElementById("modal-recipe-name").innerText = recipe.name;
  document.getElementById("modal-recipe-category").innerText = recipe.category;
  document.getElementById("modal-recipe-description").innerText =
    recipe.description;
  document.getElementById("modal-recipe-ingredients").innerText =
    recipe.ingredients;
  document.getElementById("recipeModal").style.display = "block";
}

function closeRecipeModal() {
  document.getElementById("recipeModal").style.display = "none";
}

function addRecipe() {
  const formData = new FormData(document.getElementById("addRecipeForm"));

  fetch("http://localhost:3000/api/recipes", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Added recipe:", data);
      fetchRecipes();
      closeAddRecipeModal();
    })
    .catch((error) => console.error("Error:", error));
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
