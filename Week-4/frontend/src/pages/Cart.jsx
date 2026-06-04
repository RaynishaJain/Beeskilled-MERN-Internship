import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Please log in to view your cart items.');
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await axios.get('https://beeskilled-mern-internship.onrender.com/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data);
      } catch (err) {
        console.error('Error fetching cart records', err);
      }
    };
    fetchCart();
  }, [token]);

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
        <h2 style={{ margin: 0 }}>Shopping Cart Overview</h2>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>← Back To Storefront</Link>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#777' }}>
          <h3>Your cart container is empty!</h3>
          <p>Head back to the catalog shop page to select tech items.</p>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
            {cart.items.map(item => item.productId && (
              <div key={item._id} style={{ display: 'flex', gap: '20px', padding: '15px', border: '1px solid #eaeaea', borderRadius: '6px', alignItems: 'center', backgroundColor: '#fafafa' }}>
                <img src={item.productId.image} alt={item.productId.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{item.productId.name}</h4>
                  <span style={{ color: '#666', fontSize: '14px' }}>Price: ${item.productId.price}</span>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                  Qty: {item.quantity}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderTop: '2px solid #eee', marginTop: '20px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Grand Total:</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>${calculateTotal()}</span>
          </div>
          <button onClick={() => alert('Checkout Simulation Activated! Your final capstone build order configuration is complete.')} style={{ width: '100%', padding: '15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}

export default Cart;