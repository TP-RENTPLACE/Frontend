import React, { useState } from "react";
import {Link, useParams, useNavigate, useLocation} from "react-router-dom";
import Header from "../HeaderComponents/Header";
import "../../styles/adDetails.css";
import image1 from "../../assets/image1.png";

const AdDetails = ({ onCancel }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const editingProperty = location.state?.editingProperty;

  if (!editingProperty) {
    return <div className="error-message">Объявление не найдено</div>;
  }

  const handleAction = (type) => {
    navigate("/moderation", {
      state: { rejectedId: editingProperty.propertyId, action: type },
    });
  };

  // Форматирование данных для отображения
  const propertyDetails = [
    { value: `${editingProperty.area} м²`},
    { label: "комнаты", value: editingProperty.rooms },
    { label: "спальни", value: editingProperty.bedrooms },
    { label: "гости", value: editingProperty.maxGuests },
    { label: "кровати", value: editingProperty.sleepingPlaces },
    { label: "ванные", value: editingProperty.bathrooms },
  ];

  return (
      <div>
        <Header />
        <div className="ad-details-container">
          <div className="images-section">
            <div className="image-wrapper">
              <img
                  src={editingProperty.imagesDTOs?.[0]?.url || image1}
                  alt="Главное фото"
                  className="main-image"
              />
              <Link
                  to={`/gallery/${editingProperty.propertyId}`}
                  state={{ images: editingProperty.imagesDTOs }}
              >
                <button className="show-all-button">Показать все</button>
              </Link>
            </div>
            <div className="thumbnail-container">
              {editingProperty.imagesDTOs?.slice(1).map((img, index) => (
                  <img
                      key={index}
                      src={img.url}
                      alt={`Фото ${index + 1}`}
                      className="thumbnail"
                  />
              ))}
            </div>
          </div>

          <div className="ad-header">
            <h1 className="property-title">{editingProperty.title}</h1>
            <p className="price">
              {editingProperty.cost}₽
              <span className="price-period">
              {editingProperty.longTermRent ? " в месяц" : " за сутки"}
            </span>
            </p>
          </div>

          <div className="ad-details-tags">
            {propertyDetails.map((detail, index) => (
                <div key={index} className="tag">
                  <span className="detail-value">{detail.value} </span>
                  <span>{detail.label} </span>
                </div>
            ))}
          </div>

          <h2 className="section-title">Описание</h2>
          <div className="description-container">
            <p className={`description ${expanded ? "expanded" : ""}`}>
              {editingProperty.description}
            </p>
            {editingProperty.description?.length > 200 && (
                <span
                    className="show-more"
                    onClick={() => setExpanded(!expanded)}
                >
              {expanded ? "Скрыть" : "Показать полностью"}
            </span>
            )}
          </div>

          <h2 className="section-title">Основные удобства</h2>
          <ul className="amenities">
            {editingProperty.facilitiesDTOs?.map((facility, index) => (
                <li key={index} className="amenity-item">
                  {facility.name}
                </li>
            ))}
          </ul>

          <h2 className="section-title">Расположение</h2>
          <p className="location">{editingProperty.address}</p><h2 className="section-title">Хозяин</h2>
          <div className="host-wrapper">
            <div className="host-info">
              <img
                  src={editingProperty.ownerDTO?.avatar || image1}
                  alt="Аватар владельца"
                  className="host-avatar"
              />
              <div className="host-details">
                <strong className="host-name">
                  {editingProperty.ownerDTO?.name} {editingProperty.ownerDTO?.surname}
                </strong>
                <p className="host-email">{editingProperty.ownerDTO?.email}</p>
              </div>
            </div>
            <p className="host-member">
              Участник rentplace с 2025 года
            </p>
          </div>

          {editingProperty.propertyStatus === "ON_MODERATION" && (
              <div className="moderation-buttons">
                <button
                    className="reject-buttonn"
                    onClick={() => handleAction("reject")}
                >
                  Отклонить
                </button>
                <button
                    className="approve-buttonn"
                    onClick={() => handleAction("approve")}
                >
                  Принять
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default AdDetails;