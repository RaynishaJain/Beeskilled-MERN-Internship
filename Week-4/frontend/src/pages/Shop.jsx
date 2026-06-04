import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Shop() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'Guest';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://beeskilled-mern-internship.onrender.com/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching product catalog', err);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    if (!token) {
      alert('Please log in to add items to your shopping cart!');
      navigate('/login');
      return;
    }
    try {
      await axios.post('https://beeskilled-mern-internship.onrender.com/api/cart/add', 
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product added to cart successfully!');
    } catch (err) {
      alert('Failed to synchronize item to cloud cart storage');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '2px solid #eee', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#111' }}>DevStore Capstone</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Welcome back, <strong>{userName}</strong>!</p>
        </div>
        <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#007bff' }}>Shop</Link>
          <Link to="/cart" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#333', border: '1px solid #ccc', padding: '6px 12px', borderRadius: '4px' }}>🛒 View Cart</Link>
          {token ? (
            <button onClick={handleLogout} style={{ padding: '8px 14px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
          ) : (
            <Link to="/login" style={{ padding: '8px 14px', backgroundColor: '#007bff', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>Login</Link>
          )}
        </nav>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))', gap: '25px' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '12px' }} />
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#222' }}>{product.name}</h3>
              <p style={{ color: '#666', fontSize: '13px', margin: '0 0 12px 0', height: '50px', overflow: 'hidden' }}>{product.description}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>${product.price}</span>
              <button onClick={() => addToCart(product._id)} style={{ padding: '8px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Add To Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;