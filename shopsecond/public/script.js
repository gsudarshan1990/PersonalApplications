// DOM Elements
const recipesGrid = document.getElementById('recipesGrid');
const recipeModal = document.getElementById('recipeModal');
const recipeForm = document.getElementById('recipeForm');

// Load recipes on page load
document.addEventListener('DOMContentLoaded', () => {
  loadRecipes();
});

// Fetch all recipes
async function loadRecipes() {
  try {
    const response = await fetch('/api/recipes');
    const recipes = await response.json();
    displayRecipes(recipes);
  } catch (error) {
    console.error('Error loading recipes:', error);
  }
}

// Display recipes in grid
function displayRecipes(recipes) {
  recipesGrid.innerHTML = '';
  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <div class="recipe-image">${recipe.image}</div>
      <div class="recipe-content">
        <h3 class="recipe-title">${recipe.title}</h3>
        <span class="recipe-category">${recipe.category}</span>
        <div class="recipe-info">
          <div class="recipe-info-item">⏱️ ${recipe.prepTime}</div>
          <div class="recipe-info-item">🔥 ${recipe.cookTime}</div>
        </div>
        <div class="recipe-info">
          <div class="recipe-info-item">👥 ${recipe.servings}</div>
        </div>
      </div>
    `;
    card.onclick = () => showRecipeDetails(recipe);
    recipesGrid.appendChild(card);
  });
}

// Show recipe details in modal
async function showRecipeDetails(recipe) {
  const recipeDetails = document.getElementById('recipeDetails');
  const ingredientsList = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');
  
  recipeDetails.innerHTML = `
    <div class="modal-recipe-image">${recipe.image}</div>
    <h2 class="modal-recipe-title">${recipe.title}</h2>
    
    <div class="modal-recipe-info">
      <div>
        <strong>Prep Time:</strong> ${recipe.prepTime}
      </div>
      <div>
        <strong>Cook Time:</strong> ${recipe.cookTime}
      </div>
      <div>
        <strong>Servings:</strong> ${recipe.servings}
      </div>
      <div>
        <strong>Category:</strong> ${recipe.category}
      </div>
    </div>

    <div class="modal-section">
      <h3>📝 Ingredients</h3>
      <ul>
        ${ingredientsList}
      </ul>
    </div>

    <div class="modal-section">
      <h3>👨‍🍳 Instructions</h3>
      <p>${recipe.instructions}</p>
    </div>
  `;
  
  recipeModal.style.display = 'flex';
}

// Close recipe modal
function closeRecipeModal() {
  recipeModal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target === recipeModal) {
    recipeModal.style.display = 'none';
  }
}

// Show sections
function showHome() {
  document.getElementById('home').style.display = 'block';
  document.getElementById('recipes').style.display = 'none';
  document.getElementById('add').style.display = 'none';
  closeRecipeModal();
}

function showRecipes() {
  document.getElementById('home').style.display = 'none';
  document.getElementById('recipes').style.display = 'block';
  document.getElementById('add').style.display = 'none';
  closeRecipeModal();
  loadRecipes();
}

function showAddRecipe() {
  document.getElementById('home').style.display = 'none';
  document.getElementById('recipes').style.display = 'none';
  document.getElementById('add').style.display = 'block';
  closeRecipeModal();
}

// Handle form submission
recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const ingredients = document.getElementById('ingredients').value
    .split('\n')
    .map(i => i.trim())
    .filter(i => i);

  const newRecipe = {
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    prepTime: document.getElementById('prepTime').value,
    cookTime: document.getElementById('cookTime').value,
    servings: document.getElementById('servings').value,
    ingredients: ingredients,
    instructions: document.getElementById('instructions').value
  };

  try {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newRecipe)
    });

    if (response.ok) {
      alert('✅ Recipe added successfully!');
      recipeForm.reset();
      showRecipes();
    } else {
      alert('❌ Failed to add recipe');
    }
  } catch (error) {
    console.error('Error adding recipe:', error);
    alert('❌ Error adding recipe');
  }
});
