import React, { useState } from "react";
import "../../styles/bookingModal.css";
import Header from "../HeaderComponents/Header";
import { ReactComponent as Ruble } from "../../assets/Ruble.svg";

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
      <div className="modal booking-modal-wrapper">
        <form className="add-user-form" onSubmit={handleSubmit}>
          <h2>{isEditing ? "Редактировать бронь" : "Добавить бронь"}</h2>

          <div className="fields-row">
            <div>
              <label className="column-name">Объявление</label>
              <input
                type="text"
                name="listing"
                value={formData.listing}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="column-name">Арендатор (Email)</label>
              <input
                type="email"
                name="tenant"
                value={formData.tenant}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="column-name">Арендодатель (Email)</label>
              <input
                type="email"
                name="landlord"
                value={formData.landlord}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="fields-row">
            <div>
              <label className="column-name">Дата начала проживания</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="column-name">Дата окончания проживания</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="column-name">
                Стоимость проживания, <Ruble style={{ width: "18px", height: "18px", fill: "black" }} />
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

            
 
              <div className="footer-buttonss">
                <button type="button" className="cancell-button" onClick={onCancel}>Отмена</button>
                <button type="submit" className="submitt-button">{isEditing ? "Сохранить" : "Добавить"}</button>
              </div>
            

        </form>
      </div>
    </div>
  );
};

export default BookingModal;
