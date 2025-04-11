import React from "react";
import { useNavigate } from "react-router-dom";
import AddUserForm from "./AddUserForm";
import "../../styles/usersList.css"; // 👈 подключаем стили той же страницы

const AddUserFormWrapper = () => {
  const navigate = useNavigate();

  const handleCancel = () => navigate("/users");

  const handleAdd = (user) => {
    // можно позже сделать глобальное состояние или API
    console.log("Добавлен пользователь:", user);
    navigate("/users");
  };

  return (
    <div className="users-list"> {/* 👈 одинаковый layout */}
      <AddUserForm addNewUser={handleAdd} onCancel={handleCancel} />
    </div>
  );
};

export default AddUserFormWrapper;
