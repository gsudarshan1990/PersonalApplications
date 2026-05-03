const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sample recipe data
let recipes = [
  {
    id: 1,
    title: 'Chocolate Chip Cookies',
    category: 'Dessert',
    prepTime: '15 min',
    cookTime: '12 min',
    servings: '24 cookies',
    image: '🍪',
    ingredients: ['2 cups flour', '1 cup butter', '3/4 cup sugar', '2 eggs', '2 cups chocolate chips'],
    instructions: 'Mix butter and sugar, add eggs, combine with flour, fold in chocolate chips, bake at 375°F for 12 minutes.'
  },
  {
    id: 2,
    title: 'Pasta Carbonara',
    category: 'Main Course',
    prepTime: '10 min',
    cookTime: '20 min',
    servings: '4',
    image: '🍝',
    ingredients: ['400g spaghetti', '200g bacon', '3 eggs', '100g parmesan', 'Black pepper', 'Salt'],
    instructions: 'Cook pasta, fry bacon, mix eggs with parmesan, combine everything with pasta water, season to taste.'
  },
  {
    id: 3,
    title: 'Caesar Salad',
    category: 'Salad',
    prepTime: '15 min',
    cookTime: '0 min',
    servings: '2',
    image: '🥗',
    ingredients: ['Romaine lettuce', 'Croutons', 'Parmesan', 'Caesar dressing', 'Lemon'],
    instructions: 'Toss lettuce with dressing, add croutons and parmesan, serve immediately with fresh lemon.'
  }
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

app.post('/api/recipes', (req, res) => {
  const newRecipe = {
    id: recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1,
    title: req.body.title,
    category: req.body.category,
    prepTime: req.body.prepTime,
    cookTime: req.body.cookTime,
    servings: req.body.servings,
    image: req.body.image || '🍽️',
    ingredients: req.body.ingredients || [],
    instructions: req.body.instructions
  };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

app.listen(PORT, () => {
  console.log(`Recipe app running on http://localhost:${PORT}`);
});
