import './App.css';
import { useMemo, useState } from 'react';

const recipes = [
  {
    id: 1,
    name: 'Andhra Kodi Pulusu Meal',
    category: 'Dinner',
    region: 'Telugu',
    time: '30 min',
    spice: 'Hot',
    price: 289,
    rating: 4.9,
    badge: 'Andhra Special',
    description: 'Fiery Andhra-style chicken curry served with steamed rice and onion salad.',
  },
  {
    id: 2,
    name: 'Gongura Paneer',
    category: 'Lunch',
    region: 'Telugu',
    time: '22 min',
    spice: 'Medium',
    price: 229,
    rating: 4.8,
    badge: 'Telugu Favorite',
    description: 'Tangy gongura paneer finished with Andhra spices and a side of chutney.',
  },
  {
    id: 3,
    name: 'Pesarattu Dosa',
    category: 'Breakfast',
    region: 'Telugu',
    time: '18 min',
    spice: 'Mild',
    price: 149,
    rating: 4.7,
    badge: 'Morning Classic',
    description: 'Crisp green gram dosa served hot with ginger chutney and allam pachadi.',
  },
  {
    id: 4,
    name: 'Chettinad Veg Biryani',
    category: 'Dinner',
    region: 'Tamil',
    time: '32 min',
    spice: 'Hot',
    price: 259,
    rating: 4.9,
    badge: 'Tamil Nadu Hit',
    description: 'Fragrant biryani with Chettinad masala, vegetables, raita, and brinjal curry.',
  },
  {
    id: 5,
    name: 'Kothu Parotta',
    category: 'Lunch',
    region: 'Tamil',
    time: '20 min',
    spice: 'Medium',
    price: 219,
    rating: 4.8,
    badge: 'Street Style',
    description: 'Madurai-style kothu parotta chopped on the tawa with salna and onion raita.',
  },
  {
    id: 6,
    name: 'Filter Coffee Tres Leches',
    category: 'Dessert',
    region: 'Tamil',
    time: '12 min',
    spice: 'None',
    price: 129,
    rating: 4.6,
    badge: 'Cafe Twist',
    description: 'Soft milk cake infused with South Indian filter coffee and cocoa dust.',
  },
  {
    id: 7,
    name: 'Sambar Idli',
    category: 'Breakfast',
    region: 'Tamil',
    time: '15 min',
    spice: 'Mild',
    price: 119,
    rating: 4.8,
    badge: 'Comfort Bowl',
    description: 'Soft idlis soaked in hot sambar with ghee, podi, and coconut chutney.',
  },
  {
    id: 8,
    name: 'Royyala Vepudu Rice Plate',
    category: 'Dinner',
    region: 'Telugu',
    time: '28 min',
    spice: 'Hot',
    price: 319,
    rating: 4.9,
    badge: 'Coastal Telugu',
    description: 'Spicy Andhra prawn fry served with rice, rasam, and crunchy fryums.',
  },
];

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];
const paymentOptions = ['UPI', 'Credit Card', 'Debit Card', 'Cash on Delivery'];
const formatPrice = (value) => `Rs. ${value}`;

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState({});
  const [selectedPayment, setSelectedPayment] = useState('UPI');

  const clearCart = () => {
    setCart({});
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesCategory =
        selectedCategory === 'All' || recipe.category === selectedCategory;
      const matchesSearch = recipe.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const specialRecipes = useMemo(() => {
    const sourceRecipes =
      selectedCategory === 'All'
        ? recipes
        : recipes.filter((recipe) => recipe.category === selectedCategory);

    const teluguPick = sourceRecipes.find((recipe) => recipe.region === 'Telugu');
    const tamilPick = sourceRecipes.find((recipe) => recipe.region === 'Tamil');
    const picks = [teluguPick, tamilPick].filter(Boolean);

    if (picks.length > 0) {
      return picks;
    }

    return sourceRecipes.slice(0, 2);
  }, [selectedCategory]);

  const specialTitle =
    selectedCategory === 'All'
      ? 'One Telugu favorite and one Tamil classic.'
      : `${selectedCategory} specials from Telugu and Tamil kitchens.`;

  const addToCart = (recipe) => {
    setCart((currentCart) => ({
      ...currentCart,
      [recipe.id]: {
        recipe,
        quantity: (currentCart[recipe.id]?.quantity || 0) + 1,
      },
    }));
  };

  const updateQuantity = (recipeId, delta) => {
    setCart((currentCart) => {
      const item = currentCart[recipeId];
      if (!item) {
        return currentCart;
      }

      const nextQuantity = item.quantity + delta;
      if (nextQuantity <= 0) {
        const nextCart = { ...currentCart };
        delete nextCart[recipeId];
        return nextCart;
      }

      return {
        ...currentCart,
        [recipeId]: {
          ...item,
          quantity: nextQuantity,
        },
      };
    });
  };

  const cartItems = Object.values(cart);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.recipe.price * item.quantity,
    0
  );
  const deliveryFee = itemCount > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="app-shell">
      <section className="hero-panel">
        <nav className="topbar">
          <div className="topbar-copy">
            <h1>Shiva Food and Tiffins</h1>
            <p className="title-tagline">Order flavorful South Indian meals and food favorites for busy days.</p>
          </div>
          <div className="cart-pill">
            <span>{itemCount} items</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">Meals, tiffins, and favorites. Fast checkout.</p>
            <p className="hero-text">
              Discover South Indian meals, tiffins, and regional food favorites, filter by mood,
              and build your order in a few taps.
            </p>

            <div className="search-panel">
              <input
                type="text"
                placeholder="Search recipes"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <div className="category-row">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={category === selectedCategory ? 'chip active' : 'chip'}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="featured-stack">
            <div className="special-heading">
              <p className="eyebrow">Special Picks</p>
              <h2>{specialTitle}</h2>
            </div>
            {specialRecipes.map((recipe) => (
              <article key={recipe.id} className="featured-card special-card">
                <span className="featured-badge">{recipe.badge}</span>
                <h3>{recipe.name}</h3>
                <p>{recipe.description}</p>
                <div className="featured-meta">
                  <span>{recipe.category}</span>
                  <span>{recipe.time}</span>
                  <span>{recipe.spice}</span>
                </div>
                <div className="featured-footer">
                  <strong>{formatPrice(recipe.price)}</strong>
                  <button onClick={() => addToCart(recipe)}>Order Now</button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>

      <main className="content-grid">
        <section className="menu-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Regional Menu</p>
              <h3>Choose from meals, tiffins, and favorite food items</h3>
            </div>
            <span>{filteredRecipes.length} recipes</span>
          </div>

          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <article key={recipe.id} className="recipe-card">
                <span className="recipe-badge">{recipe.badge}</span>
                <div className="recipe-topline">
                  <h4>{recipe.name}</h4>
                  <span className="rating">★ {recipe.rating}</span>
                </div>
                <p>{recipe.description}</p>
                <div className="recipe-meta">
                  <span>{recipe.category}</span>
                  <span>{recipe.time}</span>
                  <span>{recipe.spice}</span>
                </div>
                <div className="recipe-footer">
                  <strong>{formatPrice(recipe.price)}</strong>
                  <button onClick={() => addToCart(recipe)}>Add to Order</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="order-panel">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Your Order</p>
              <h3>Checkout Summary</h3>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-state">
              <p>No recipes added yet.</p>
              <span>Pick a regional dish from the menu to start your order.</span>
            </div>
          ) : (
            <div className="order-list">
              {cartItems.map(({ recipe, quantity }) => (
                <div key={recipe.id} className="order-item">
                  <div className="order-details">
                    <strong>{recipe.name}</strong>
                    <span className="item-price">{formatPrice(recipe.price)} each</span>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(recipe.id, -1)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQuantity(recipe.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="payment-panel">
            <p className="eyebrow">Payment Option</p>
            <div className="payment-options">
              {paymentOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={option === selectedPayment ? 'payment-chip active' : 'payment-chip'}
                  onClick={() => setSelectedPayment(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="payment-note">Selected: {selectedPayment}</p>
          </div>

          <div className="summary-box">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{formatPrice(deliveryFee)}</strong>
            </div>
            <div>
              <span>Payment</span>
              <strong>{selectedPayment}</strong>
            </div>
            <div className="total-row">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div className="checkout-actions">
              <button
                type="button"
                className="clear-cart-button"
                onClick={clearCart}
                disabled={cartItems.length === 0}
              >
                Clear All Orders
              </button>
              <button className="checkout-button" disabled={cartItems.length === 0}>
                Place Order
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;







