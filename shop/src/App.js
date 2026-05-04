import React, { useState } from 'react';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 16599,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      description: "Premium wireless headphones with noise cancellation"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 24899,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      description: "Fitness tracking smartwatch with heart rate monitor"
    },
    {
      id: 3,
      name: "Laptop",
      price: 82999,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
      description: "High-performance laptop for work and gaming"
    },
    {
      id: 4,
      name: "Smartphone",
      price: 58099,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
      description: "Latest smartphone with advanced camera features"
    },
    {
      id: 5,
      name: "Gaming Mouse",
      price: 6639,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop",
      description: "RGB gaming mouse with customizable buttons"
    },
    {
      id: 6,
      name: "Mechanical Keyboard",
      price: 12449,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
      description: "RGB mechanical keyboard with blue switches"
    }
  ];

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">ShopHub</h1>
          <nav className="nav">
            <button className="nav-link">Home</button>
            <button className="nav-link">Products</button>
            <button className="nav-link">About</button>
            <button className="nav-link">Contact</button>
          </nav>
          <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
            <span className="cart-count">{getTotalItems()}</span>
            🛒
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <section className="hero">
            <h2>Welcome to ShopHub</h2>
            <p>Discover amazing products at great prices in India</p>
          </section>

          <section className="products-section">
            <h3>Featured Products</h3>
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-modal" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Shopping Cart</h3>
              <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: ₹{getTotalPrice().toLocaleString('en-IN')}</strong>
                </div>
                <button className="checkout-btn">Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 ShopHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
