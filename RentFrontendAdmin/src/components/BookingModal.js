import React, { useState } from "react";
import "../styles/bookingModal.css";

const BookingModal = ({ onCancel, booking, onSave }) => {
  const isEditing = !!booking;

  const [formData, setFormData] = useState({
    id: booking?.id || Date.now(), // Генерируем ID, если это новая бронь
    listing: booking?.listing || "",
    tenant: booking?.tenant || "",
    landlord: booking?.landlord || "",
    checkIn: booking?.checkIn || "",
    checkOut: booking?.checkOut || "",
    price: booking?.price || "",
  });

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
      <div className="modal">
        <h2>{isEditing ? "Редактировать бронь" : "Добавить бронь"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Объявление:
              <input type="text" name="listing" value={formData.listing} onChange={handleChange} required />
            </label>

            <label>
              Арендатор (Email):
              <input type="email" name="tenant" value={formData.tenant} onChange={handleChange} required />
            </label>

            <label>
              Арендодатель (Email):
              <input type="email" name="landlord" value={formData.landlord} onChange={handleChange} required />
            </label>
          </div>

          <div className="form-row">
            <label>
              Дата заезда:
              <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required />
            </label>

            <label>
              Дата выезда:
              <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required />
            </label>

            <label>
              Стоимость:
              <input type="text" name="price" value={formData.price} onChange={handleChange} required />
            </label>
          </div>

          <div className="modal-actions">
            <button className="add-btn" type="submit">
              {isEditing ? "Сохранить изменения" : "Добавить бронь"}
            </button>
            <button className="cancel-btn" type="button" onClick={onCancel}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
