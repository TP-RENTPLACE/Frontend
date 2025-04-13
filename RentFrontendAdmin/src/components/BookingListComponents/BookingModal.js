import React, { useState } from "react";
import "../../styles/bookingModal.css";
import Header from "../HeaderComponents/Header";

const BookingModal = ({ onCancel, booking, onSave }) => {
  const isEditing = !!booking;

  const [formData, setFormData] = useState({
    id: booking?.id || Date.now(),
    listing: booking?.listing || "",
    tenant: booking?.tenant || "",
    landlord: booking?.landlord || "",
    checkIn: booking?.checkIn || "",
    checkOut: booking?.checkOut || "",
    price: booking?.price || "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSave === "function") {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <div className="modal">
        <h2>{isEditing ? "Редактировать бронь" : "Добавить бронь"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              <span className="column-name">Объявление:</span>
              <input
                type="text"
                name="listing"
                value={formData.listing}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="column-name">Арендатор (Email):</span>
              <input
                type="email"
                name="tenant"
                value={formData.tenant}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="column-name">Арендодатель (Email):</span>
              <input
                type="email"
                name="landlord"
                value={formData.landlord}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              <span className="column-name">Дата заезда:</span>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="column-name">Дата выезда:</span>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="column-name">Стоимость:</span>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" type="button" onClick={onCancel}>
              Отмена
            </button>
            <button className="add-btn" type="submit">
              {isEditing ? "Сохранить изменения" : "Добавить бронь"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
