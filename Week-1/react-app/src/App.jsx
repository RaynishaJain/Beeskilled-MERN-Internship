import React, { useState } from 'react';
import blogData from './posts.json';

// 1. REUSABLE COMPONENT: Header
const Header = ({ title, subtitle }) => (
  <header style={{ textAlign: 'center', marginBottom: '40px' }}>
    <h1 style={{ color: '#0f172a', fontSize: '3rem', marginBottom: '10px' }}>{title}</h1>
    <p style={{ color: '#64748b', fontSize: '1.2rem' }}>{subtitle}</p>
  </header>
);

// 2. REUSABLE COMPONENT: Card
const PostCard = ({ title, tech, description }) => (
  <div style={{
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '30px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }}>
    <div>
      <h3 style={{ color: '#1e293b', marginBottom: '10px', fontSize: '1.5rem' }}>{title}</h3>
      <span style={{ 
        fontSize: '0.9rem', 
        backgroundColor: '#eff6ff', 
        color: '#2563eb', 
        padding: '6px 16px', 
        borderRadius: '20px',
        fontWeight: 'bold'
      }}>{tech}</span>
      <p style={{ color: '#475569', marginTop: '15px', lineHeight: '1.8', fontSize: '1.05rem' }}>{description}</p>
    </div>
  </div>
);

// 3. REUSABLE COMPONENT: Button
const CustomButton = ({ label, onClick, type = "button" }) => (
  <button 
    type={type} 
    onClick={onClick} 
    style={{ 
      padding: '12px 30px', 
      backgroundColor: '#2563eb', 
      color: 'white', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem'
    }}
  >
    {label}
  </button>
);

// 4. REUSABLE COMPONENT: Form
const SearchForm = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '15px', marginBottom: '50px' }}>
      <input 
        type="text" 
        placeholder="Search projects by title or tech..." 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)}
        style={{ 
          flex: 1, 
          padding: '15px 20px', 
          borderRadius: '10px', 
          border: '1px solid #cbd5e1',
          fontSize: '1.1rem',
          outline: 'none'
        }}
      />
      <CustomButton label="Search" type="submit" />
    </form>
  );
};

// 5. REUSABLE COMPONENT: Footer
const Footer = () => (
  <footer style={{ 
    marginTop: '80px', 
    textAlign: 'center', 
    color: '#94a3b8', 
    fontSize: '1rem', 
    borderTop: '1px solid #e2e8f0', 
    padding: '40px 0' 
  }}>
    <p>© 2026 Raynisha Jain | Beeskilled MERN Internship Week 1</p>
  </footer>
);

export default function App() {
  const [allPosts] = useState(blogData);
  const [filteredPosts, setFilteredPosts] = useState(blogData);

  const handleSearch = (searchTerm) => {
    const results = allPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tech.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(results);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', width: '100vw', margin: 0, padding: 0, overflowX: 'hidden' }}>
      <div style={{ 
        width: '98%', 
        margin: '0 auto', 
        padding: '60px 1%', 
        fontFamily: '"Inter", "Segoe UI", sans-serif'
      }}>
        
        <Header 
          title="Raynisha's Tech Blog" 
          subtitle="SRM IST CSE | CGPA: 9.54 | Full Stack Developer" 
        />
        
        <SearchForm onSearch={handleSearch} />

        <main>
          <div style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', marginBottom: '30px', paddingBottom: '10px' }}>
            <h2 style={{ color: '#334155' }}>Featured Projects</h2>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
              gap: '25px' 
            }}>
              {filteredPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '60px', color: '#64748b', backgroundColor: '#fff', borderRadius: '12px', textAlign: 'center' }}>
              No projects found matching your search.
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}