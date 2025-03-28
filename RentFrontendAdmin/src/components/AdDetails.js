import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/adDetails.css';

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Пример данных (замени на загрузку из API, если нужно)
  const adsData = [
    {
        "/images/ad-1.jpg",
        "/images/ad-2.jpg",
        "/images/ad-3.jpg",
        "/images/ad-4.jpg",
        "/images/ad-4"
      ],
    },
  ];

  const ad = adsData.find((ad) => ad.id === Number(id));

  if (!ad) {
    return <h2>Объявление не найдено</h2>;
  }

  const handleApprove = () => {
    console.log(`Объявление ${id} подтверждено`);
    navigate("/moderation"); // Возвращаемся к списку
  };

  const handleReject = () => {
    console.log(`Объявление ${id} отклонено`);
    navigate("/moderation"); // Возвращаемся к списку
  };

  return (
    <div className="ad-details-container">
      <h1>{ad.title}</h1>
      <p className="price">{ad.price}</p>
      <p className="address">{ad.address}</p>
      <p className="owner"><strong>Владелец:</strong> {ad.owner}</p>

      {/* Блок изображений */}
      <div className="images-section">
        <img src={ad.images[0]} alt="Главное фото" className="main-image" />
        <div className="thumbnail-container">
          {ad.images.slice(1).map((img, index) => (
            <img key={index} src={img} alt={`Фото ${index + 1}`} className="thumbnail" />
          ))}
        </div>
      </div>

      <p className="description">{ad.description}</p>

      {/* Кнопки модерации */}
      <div className="moderation-buttons">
        <button className="approve-button" onClick={handleApprove}>✔ Принять</button>
        <button className="reject-button" onClick={handleReject}>✘ Отклонить</button>
      </div>
    </div>
  );
};

export default AdDetails;
