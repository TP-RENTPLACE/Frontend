import React from "react";
import { FiSearch } from "react-icons/fi";
import "../styles/searchBar.css";

const SearchBar = ({ searchQuery, handleSearchChange }) => {
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      
      <input
        
        type="text"
        placeholder="Поиск..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
