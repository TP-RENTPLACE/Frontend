import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineWifi, AiOutlineCar } from "react-icons/ai";
import { FaSnowflake, FaDoorOpen } from "react-icons/fa";
import Header from "../HeaderComponents/Header";
import "../../styles/adDetails.css";
import image1 from "../../assets/image2.png";

const adData = [
  {
    id: 1,
    title: "Таунаус Hillside",
    price: "18000 ₽",
    period: "в месяц",
    address: "Мистолово, Английский проезд, 3/1",
    images: [image1, image1, image1, image1, image1],
    owner: "petr_petrov@gmail.com",
    description:
      "Просторный дом с удобствами. Очень удобное месторасположение, рядом парк, магазины, школы и детские сады.",
    amenities: [
      { name: "Wi-Fi", icon: <AiOutlineWifi /> },
      { name: "Парковка", icon: <AiOutlineCar /> },
      { name: "Кондиционер", icon: <FaSnowflake /> },
      { name: "Балкон", icon: <FaDoorOpen /> },
    ],
    details: ["360 м²", "5 комнат", "6 гостей", "3 спальни", "3 кровати"],
  },
  {
    id: 2,
    title: "Таунаус Hillside",
    price: "18000 ₽",
    period: "за сутки",
    address: "Мистолово, Английский проезд, 3/1",
    images: [image1, image1, image1, image1, image1],
    owner: "petr_petrov@gmail.com",
    description:
      "Просторный дом с удобствами. Очень удобное месторасположение, рядом парк, магазины, школы и детские сады.",
    amenities: [
      { name: "Wi-Fi", icon: <AiOutlineWifi /> },
      { name: "Парковка", icon: <AiOutlineCar /> },
      { name: "Кондиционер", icon: <FaSnowflake /> },
      { name: "Балкон", icon: <FaDoorOpen /> },
    ],
    details: ["360 м²", "5 комнат", "6 гостей", "3 спальни", "3 кровати"],
  },
];

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const ad = adData.find((a) => a.id === Number(id));

  if (!ad) {
    return <h2>Объявление не найдено</h2>;
  }

  const handleAction = (type) => {
    navigate("/moderation", {
      state: { rejectedId: ad.id, action: type },
    });
  };

  return (
    <div>
      <Header />
      <div className="ad-details-container">
        <div className="images-section">
          <img src={ad.images[0]} alt="Главное фото" className="main-image" />
          <div className="thumbnail-container">
            {ad.images.slice(1).map((img, index) => (
              <img key={index} src={img} alt={`Фото ${index + 1}`} className="thumbnail" />
            ))}
          </div>
        </div>

        <div className="ad-header">
          <h1>{ad.title}</h1>
          <p className="price">
            {ad.price} <span className="price-period">{ad.period}</span>
          </p>
        </div>

        <div className="ad-details-tags">
          {ad.details.map((detail, index) => (
            <span key={index} className="tag">{detail}</span>
          ))}
        </div>

        <h1>Описание</h1>
        <div className="description-container">
          <p className={`description ${expanded ? "expanded" : ""}`}>{ad.description}</p>
          <span className="show-more" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Скрыть" : "Показать полностью"}
          </span>
        </div>

        <h1>Основные удобства</h1>
        <ul className="amenities">
          {ad.amenities.map((amenity, index) => (
            <li key={index}>{amenity.icon} {amenity.name}</li>
          ))}
        </ul>

        <h1>Расположение</h1>
        <p className="location">{ad.address}</p>

        <h1>Информация о хозяине</h1>
        <div className="host-info">
          <img src={image1} alt="Аватар владельца" className="host-avatar" />
          <div className="host-details">
            <strong className="host-name">Ян Маслов</strong>
            <p className="host-email">{ad.owner}</p>
            <p className="host-member">Участник rentplace с марта 2025 года</p>
          </div>
        </div>

        <div className="moderation-buttons">
          <button className="reject-buttonn" onClick={() => handleAction("reject")}>Отклонить</button>
          <button className="approve-buttonn" onClick={() => handleAction("approve")}>Принять</button>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
