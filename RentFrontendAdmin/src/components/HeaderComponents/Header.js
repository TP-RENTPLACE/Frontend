import React, { useContext } from "react";
import SearchBar from "./SearchBar";
import { FiMenu } from "react-icons/fi";
import { UserContext } from "../UserListComponents/UserContext";
import "../../styles/header.css";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LogoIcon } from "../../assets/sidebarLogo.svg";


const Header = ({ searchQuery, handleSearchChange }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="search-container">
        <button className="menu-button">
          <FiMenu size={24} />
        </button>
        <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      </div>

      <div
      className="user-profile"
      onClick={() => navigate("/settings")}
      style={{ cursor: "pointer" }}
    >
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
