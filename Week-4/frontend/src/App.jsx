import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';

// A dynamic Route Guard component that acts as a security bouncer
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If no validation token is found, automatically redirect straight to the Sign In panel!
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Secure the main shop view using the security wrapper guard */}
        <Route path="/" element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        } />
        
        {/* Secure the shopping checkout matrix using the same wrapper guard */}
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />

        {/* Public authentication panels */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;