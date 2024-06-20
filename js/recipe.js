document.addEventListener("DOMContentLoaded", function () {
  fetchRecipes();
  document.getElementById("addRecipeForm").onsubmit = function (event) {
    event.preventDefault();
    addRecipe();
  };
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
    recipeImage.src = `http://localhost:3000/${recipe.image}`;
    recipeItem.appendChild(recipeImage);

    const details = document.createElement("div");
    details.classList.add("details");
    details.innerHTML = `
      <p>${recipe.name}</p>
      <p>${recipe.category}</p>
      <p>${recipe.description}</p>
      <p>${recipe.ingredients}</p>
      <button onclick="deleteRecipe(${recipe.id})">Delete</button>
    `;
    recipeItem.appendChild(details);

    recipeList.appendChild(recipeItem);
  });
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
  fetch(`http://localhost:3000/api/recipes`)
    .then((response) => response.json())
    .then((data) => {
      const filteredRecipes = data.filter(
        (recipe) => recipe.category === category
      );
      displayRecipes(filteredRecipes);
    })
    .catch((error) => console.error("Error:", error));
}
