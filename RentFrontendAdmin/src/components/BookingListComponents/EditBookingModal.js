import React, { useState } from "react";
import "../../styles/bookingModal.css";
import Header from "../HeaderComponents/Header";

const EditBookingModal = ({ booking, onCancel, onSave }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
        <h2>Редактировать бронь</h2>
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
            <button className="cancel-btn" type="button" onClick={onCancel}>
              Отмена
            </button>
            <button className="add-btn" type="submit">
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;
