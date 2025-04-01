import React, { useContext } from "react";
import SearchBar from "./SearchBar";
import { FiMenu } from "react-icons/fi";
import { UserContext } from "./UserContext";
import "../styles/header.css";

const Header = ({ searchQuery, handleSearchChange }) => {
  const { user } = useContext(UserContext);

  return (
    <header className="header">
      <div className="search-container">
        <button className="menu-button">
          <FiMenu size={24} />
        </button>
        <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      </div>

      <div className="user-profile">
        <img src={user.avatar} alt={user.name} className="user-avatar" />
        <div className="user-info">
          <span className="user-name">{user.name} {user.surname}</span>
          <span className="user-role">{user.role}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
