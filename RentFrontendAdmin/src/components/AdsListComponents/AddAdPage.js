import React from "react";
import { useNavigate } from "react-router-dom";
import AddAdForm from "./AddAdForm";

const AddAdPage = () => {
  const navigate = useNavigate();

  const addNewAd = (newAd) => {
    console.log("Новое объявление:", newAd);

    // Здесь можно сохранить в глобальное хранилище или отправить на сервер
    // Пример: await api.post("/ads", newAd)

    navigate("/ads");
  };

  return (
    <div className="ads-list"> {/* Обертка для общих стилей */}
      <AddAdForm addNewAd={addNewAd} onCancel={() => navigate("/ads")} />
    </div>
  );
};

export default AddAdPage;