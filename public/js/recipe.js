document.addEventListener("DOMContentLoaded", function () {
  const categories = document.querySelectorAll(".category");
  const recipeList = document.querySelector(".recipe-list");

  categories.forEach((category) => {
    category.addEventListener("click", function () {
      const selectedCategory = this.getAttribute("data-category");
      filterRecipes(selectedCategory);
    });
  });

  function filterRecipes(category) {
    fetch("https://restdb.io/rest/yourdatabase", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "x-apikey": "your-api-key",
        "cache-control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        recipeList.innerHTML = "";
        const filteredRecipes = data.filter(
          (recipe) => recipe.category === category
        );
        filteredRecipes.forEach((recipe) => {
          const recipeItem = document.createElement("div");
          recipeItem.classList.add("recipe-item");
          recipeItem.innerHTML = `
                    <img src="${recipe.image}" alt="${recipe.name}">
                    <div class="details">
                        <p>${recipe.name}</p>
                        <p>Calories: ${recipe.calories}</p>
                        <p>Proteins: ${recipe.proteins}</p>
                        <p>Fats: ${recipe.fats}</p>
                    </div>
                `;
          recipeList.appendChild(recipeItem);
        });
      })
      .catch((error) => console.error("Error:", error));
  }

  function displayRecipes(recipes) {
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = ""; // Clear previous results

    recipes.forEach((recipe) => {
      const recipeItem = document.createElement("div");
      recipeItem.classList.add("recipe-item");

      const recipeImage = document.createElement("img");
      recipeImage.src = recipe.image;
      recipeItem.appendChild(recipeImage);

      const details = document.createElement("div");
      details.classList.add("details");
      details.innerHTML = `
                <p>kcal: ${recipe.kcal}</p>
                <p>protein: ${recipe.protein}g</p>
                <p>fat: ${recipe.fat}g</p>
            `;
      recipeItem.appendChild(details);

      recipeList.appendChild(recipeItem);
    });
  }
  document.addEventListener("DOMContentLoaded", () => displayRecipes(recipes));
});
