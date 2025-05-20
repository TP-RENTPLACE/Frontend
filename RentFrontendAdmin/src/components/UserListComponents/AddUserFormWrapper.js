import React from "react";
import { useNavigate } from "react-router-dom";
import AddUserForm from "./AddUserForm";
import "../../styles/usersList.css";

const AddUserFormWrapper = () => {
  const navigate = useNavigate();

  const handleCancel = () => navigate("/users");

  const handleAdd = () => {
    navigate("/users");
  };

  return (
    <div className="users-list">
      <AddUserForm addNewUser={handleAdd} onCancel={handleCancel} />
    </div>
  );
};

export default AddUserFormWrapper;