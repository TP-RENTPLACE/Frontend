import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditAdForm from "./EditAdForm";

const EditAdFormWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingAd = location.state?.editingAd;

  const handleCancel = () => {
    navigate("/ads");
  };

  const handleUpdate = (updatedAd) => {
    // Можно прокинуть вверх через props или обновлять глобальное состояние, в зависимости от структуры
    // Здесь временно сохраняем в localStorage или обрабатываем через navigate state
    console.log("Updated Ad:", updatedAd);
    navigate("/ads");
  };

  return editingAd ? (
    <div className="ads-list">
    
    <EditAdForm editingAd={editingAd} addNewAd={handleUpdate} onCancel={handleCancel} />
    </div>
  ) : (
    <div style={{ padding: "20px" }}>Объявление для редактирования не найдено.</div>
  );
};

export default EditAdFormWrapper;
