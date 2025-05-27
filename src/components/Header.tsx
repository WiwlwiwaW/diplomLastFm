/**
 * Header component that displays the application logo, search bar, and navigation.
 * 
 * @component
 * @example
 * return (
 *   <Header />
 * )
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  /**
   * Handles the search form submission
   * @param {React.FormEvent} e - The form event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <span className="logo">MusicApp</span>
        <span className="logo-sub">Discover new music</span>
      </div>
      
      <form onSubmit={handleSearch} className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for artists, tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
      
      <nav className="nav">
        <a href="/" className="nav-button active">Home</a>
      </nav>
    </header>
  );
};

export default Header;