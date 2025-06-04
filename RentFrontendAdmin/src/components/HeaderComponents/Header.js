import React from "react";
import SearchBar from "./SearchBar";
import { FiMenu } from "react-icons/fi";
import defaultImg from "../../assets/default-avatar.jpg";
import "../../styles/header.css";
import { useNavigate } from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import authService from "../../api/authService";


const Header = ({ searchQuery, handleSearchChange }) => {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getInfo,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

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
      <img src={user?.imageDTO?.url || defaultImg} alt="Фото" className="user-avatar" />
      <div className="user-info">
        <span className="user-name">{user?.name} {user?.surname}</span>
        <span className="user-role">Администратор</span>
      </div>
    </div>
    </header>
  );
};

export default Header;