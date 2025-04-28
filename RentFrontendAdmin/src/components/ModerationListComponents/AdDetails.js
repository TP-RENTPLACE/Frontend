import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AiOutlineWifi, AiOutlineCar } from "react-icons/ai";
import { FaSnowflake, FaDoorOpen } from "react-icons/fa";
import Header from "../HeaderComponents/Header";
import "../../styles/adDetails.css";
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";
import image4 from "../../assets/image4.png";

const adData = [
  {
    id: 1,
    title: "Таунаус Hillside",
    price: "18000 ₽",
    period: "в месяц",
    address: "Мистолово, Английский проезд, 3/1",
    images: [image1, image2, image3, image4, image4],
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
    images: [image2, image2, image2, image2, image2],
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
    return <h11>Объявление не найдено</h11>;
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
          <div className="image-wrapper">
            <img src={ad.images[0]} alt="Главное фото" className="main-image" />
            <Link
              to={`/gallery/${ad.id}`}
              state={{ images: ad.images }} // ПЕРЕДАЕМ КАРТИНКИ в галерею
            >
              <button className="show-all-button">Показать все</button>
            </Link>
          </div>
          <div className="thumbnail-container">
            {ad.images.slice(1).map((img, index) => (
              <img key={index} src={img} alt={`Фото ${index + 1}`} className="thumbnail" />
            ))}
          </div>
        </div>

        <div className="ad-header">
          <h11>{ad.title}</h11>
          <p className="price">
            {ad.price} <span className="price-period">{ad.period}</span>
          </p>
        </div>

        <div className="ad-details-tags">
          {ad.details.map((detail, index) => (
            <span key={index} className="tag">{detail}</span>
          ))}
        </div>

        <h11>Описание</h11>
        <div className="description-container">
          <p className={`description ${expanded ? "expanded" : ""}`}>{ad.description}</p>
          <span className="show-more" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Скрыть" : "Показать полностью"}
          </span>
        </div>

        <h11>Основные удобства</h11>
        <ul className="amenities">
          {ad.amenities.map((amenity, index) => (
            <li key={index}>{amenity.icon} {amenity.name}</li>
          ))}
        </ul>

        <h11>Расположение</h11>
        <p className="location">{ad.address}</p>

        <h11>Хозяин</h11>
        <div className="host-wrapper">
          <div className="host-info">
            <img src={image1} alt="Аватар владельца" className="host-avatar" />
            <div className="host-details">
              <strong className="host-name">Ян Маслов</strong>
              <p className="host-email">{ad.owner}</p>
            </div>
          </div>
          <p className="host-member">Участник rentplace с марта 2025 года</p>
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
