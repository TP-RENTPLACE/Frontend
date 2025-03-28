import React, { useState } from "react";
import '../styles/adform.css';  

const AddAdForm = ({ addNewAd, editingAd, onCancel }) => {
  const [formData, setFormData] = useState(
    editingAd || {
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
      image: null,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAd = {
      id: editingAd ? editingAd.id : Date.now(),
      title: formData.title,
      price: formData.price,
      address: formData.address,
      owner: formData.owner,
      rooms: formData.rooms,
      bedrooms: formData.bedrooms,
      guests: formData.guests,
      beds: formData.beds,
      area: formData.area,
      description: formData.description,
      amenities: formData.amenities,
      image: formData.image || "/images/ad-image.jpg",
    };

    addNewAd(newAd);
  };

  return (
    <form className="add-ad-form" onSubmit={handleSubmit}>
      <h2>{editingAd ? "Редактировать объявление" : "Добавить объявление"}</h2>

      {/* Загрузка изображения */}
      <div className="image-upload">
        <label>Изображение:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {formData.image && <img src={formData.image} alt="Preview" className="preview-image" />}
      </div>

      {/* Поля ввода: Название, Цена, Адрес */}
      <div className="fields-row">
        <div>
          <label>Название:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Цена за сутки:</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div>
          <label>Адрес:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
      </div>

      {/* Поля: Количество комнат, спален, гостей */}
      <div className="fields-row">
        <div>
          <label>Количество комнат:</label>
          <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} required />
        </div>

        <div>
          <label>Количество спален:</label>
          <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
        </div>

        <div>
          <label>Количество гостей:</label>
          <input type="number" name="guests" value={formData.guests} onChange={handleChange} required />
        </div>
      </div>

      {/* Поля: Количество кроватей, Хозяин жилья, Общая площадь */}
      <div className="fields-row">
        <div>
          <label>Количество кроватей:</label>
          <input type="number" name="beds" value={formData.beds} onChange={handleChange} required />
        </div>

        <div>
          <label>Хозяин жилья:</label>
          <input type="email" name="owner" value={formData.owner} onChange={handleChange} required />
        </div>

        <div>
          <label>Общая площадь (м²):</label>
          <input type="number" name="area" value={formData.area} onChange={handleChange} required />
        </div>
      </div>

      {/* Поля для описания и удобств */}
      <div>
        <label>Описание:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </div>

      <div>
        <label>Основные удобства:</label>
        <textarea name="amenities" value={formData.amenities} onChange={handleChange} required />
      </div>

      {/* Кнопки */}
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
