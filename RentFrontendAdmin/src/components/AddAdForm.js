import React, { useState } from "react";
import "../styles/adform.css";

const AddAdForm = ({ addNewAd, updateAd, editingAd, onCancel }) => {
  const [formData, setFormData] = useState(
    editingAd
      ? { ...editingAd, images: editingAd.images || [] } // Если images нет, устанавливаем пустой массив
      : {
          title: "",
          price: "",
          address: "",
          owner: "",
          rooms: "",
          bedrooms: "",
          guests: "",
          beds: "",
          area: "",
          description: "",
          amenities: "",
          images: [], // Гарантируем, что это всегда массив
        }
  );

  const [selectedRent, setSelectedRent] = useState(
    editingAd?.rentType || "daily"
  );
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      const imageFiles = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      
      setFormData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...imageFiles.map(img => img.url)],
      }));
    }
  };
  

  const handleDeleteImage = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newAd = {
      id: editingAd ? editingAd.id : Date.now(),
      ...formData,
      rentType: selectedRent, // ← Добавляем тип аренды
      image: formData.images.length > 0 ? formData.images[0] : "/images/ad-image.jpg",
    };
    
    
  
    addNewAd(newAd);
  };

  return (
    <form className="add-ad-form" onSubmit={handleSubmit}>
      <h2 className="form-title">{editingAd ? "Редактировать объявление" : "Добавить объявление"}</h2>


      {/* Фото */}
      <div className="field-group">
        <label>Изображения:</label>
        <div className="image-preview-container">
          {formData.images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image} alt={`Preview ${index}`} />
              <button className="delete-image-btn" onClick={() => handleDeleteImage(index)}>
                🗑
              </button>
            </div>
          ))}
          <label htmlFor="file-input" className="image-upload-button">+</label>
          <input id="file-input" type="file" accept="image/*" multiple onChange={handleImageChange} />
        </div>
      </div>

      {/* Поля */}
      <div className="field">
        <label>Название:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="field">
        <label>Адрес:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </div>

      <div className="fields-container">
        <div className="fields-row">
          <div className="field">
            <label>Общая площадь (м²):</label>
            <input type="number" name="area" value={formData.area} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Количество гостей:</label>
            <input type="number" name="guests" value={formData.guests} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Количество комнат:</label>
            <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} required />
          </div>
        </div>

        <div className="fields-row">
          <div className="field">
            <label>Количество спален:</label>
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Количество кроватей:</label>
            <input type="number" name="beds" value={formData.beds} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Хозяин жилья (email):</label>
            <input type="email" name="owner" value={formData.owner} onChange={handleChange} required />
          </div>
        </div>
      </div>

      <div className="field rent-price">
        <label>Арендная плата:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      </div>

      <div className="rent-options">
        <button type="button" className={selectedRent === "daily" ? "active" : ""} onClick={() => setSelectedRent("daily")}>
          За сутки
        </button>
        <button type="button" className={selectedRent === "monthly" ? "active" : ""} onClick={() => setSelectedRent("monthly")}>
          В месяц
        </button>
      </div>

      <div className="desc-amenities-container">
        <div className="field description-field">
          <label>Описание:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="field amenities-field">
          <label>Основные удобства:</label>
          <textarea name="amenities" value={formData.amenities} onChange={handleChange} required />
        </div>
      </div>

      <div className="button-group">
        <button type="submit" className="submit-button">
          {editingAd ? "Сохранить" : "Добавить"}
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Отменить
        </button>
      </div>
    </form>
  );
};

export default AddAdForm;
