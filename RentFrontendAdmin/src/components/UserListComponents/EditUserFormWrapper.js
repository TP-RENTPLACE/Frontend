import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditUserForm from "./EditUserForm";

const EditUserFormWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingUser = location.state?.editingUser;

  const handleCancel = () => {
    navigate("/users");
  };

  const handleUpdate = () => {
    navigate("/users");
  };

  const handleDelete = () => {
    navigate("/users");
  };

  return editingUser ? (
    <div className="users-list">
      <EditUserForm
        editingUser={editingUser}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />
    </div>
  ) : (
    <div style={{ padding: "20px" }}>
      Пользователь для редактирования не найден.
    </div>
  );
};

export default EditUserFormWrapper;