import React, { useState } from "react";
import "../../styles/adform.css";
import { ReactComponent as Image } from "../../assets/Camera.svg";
import Header from "../HeaderComponents/Header";
import { ReactComponent as Ruble } from "../../assets/Ruble.svg";
import { ReactComponent as Trash} from "../../assets/Trash.svg";






const AddAdForm = ({ addNewAd, updateAd, editingAd, onCancel }) => {
  const [formData, setFormData] = useState(
    editingAd
      ? { ...editingAd, images: editingAd.images || [] }
      : {
          title: "",
          price: "",
          address: "",
          ownerEmail: "",
          rooms: "",
          bedrooms: "",
          guests: "",
          beds: "",
          area: "",
          description: "",
          amenities: "",
          images: [],
        }
  );
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
   
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
        images: [...prevState.images, ...imageFiles.map((img) => img.url)],
      }));
    }
  };

  const handleDeleteImage = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };


    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      
      const formDataToSend = new FormData();
      formDataToSend.append("propertyStatus", "ON_MODERATION"); 
      formDataToSend.append("address", formData.address);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("rating", parseFloat(formData.rating) || 0); 
      formDataToSend.append("cost", parseFloat(formData.price) || 0); 
      formDataToSend.append("area", parseFloat(formData.area) || 0); 
      formDataToSend.append("bedrooms", parseInt(formData.bedrooms) || 0);
      formDataToSend.append("sleepingPlaces", parseInt(formData.guests) || 0);
      formDataToSend.append("bathrooms", parseInt(formData.bathrooms) || 0); 
      formDataToSend.append("maxGuests", parseInt(formData.guests) || 0); 
    
     
      formDataToSend.append(
        "owner",
        JSON.stringify({
          userId: 1, 
          name: "", 
          surname: "", 
          birthDate: "", 
          registrationDate: "", 
          email: formData.ownerEmail, 
          image: null, 
        })
      );
    
     
      formData.images.forEach((image) => {
        formDataToSend.append("images", image); 
      });
    
     
      formDataToSend.append("categories", JSON.stringify([]));  
      formDataToSend.append("facilities", JSON.stringify([]));  
      formDataToSend.append("longTermRent", false); 
    

    };

  return (
    <div className="add-ad-container">
      <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <form className="add-ad-form" onSubmit={handleSubmit}>
        <h2 className="form-title">{"Добавить объявление"}</h2>

        <div className="field-group">
          <label className="ccolumn-name">Изображения</label>
          <div className="image-preview-container">
            {formData.images.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={image} alt={`Preview ${index}`} />
                <button className="delete-image-btn" onClick={() => handleDeleteImage(index)} type="button">
                  <Trash/>
                </button>
              </div>
            ))}
            <label htmlFor="file-input" className="image-upload-button">
              <div className="upload-content">
                <span>Добавить фото</span>
                <Image className="upload-icon" />
              </div>
            </label>

            <input id="file-input" type="file" accept="image/*" multiple onChange={handleImageChange} />
          </div>
        </div>

        <div className="field">
          <label className="ccolumn-name">Название</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="field">
          <label className="ccolumn-name">Адрес</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="fields-container">
          <div className="fields-row">
            <div className="field">
              <label className="ccolumn-name">Общая площадь (м²)</label>
              <input type="number" name="area" value={formData.area} onChange={handleChange} required />
            </div>
            <div className="field">
              <label className="ccolumn-name">Количество гостей</label>
              <input type="number" name="guests" value={formData.guests} onChange={handleChange} required />
            </div>
            <div className="field">
              <label className="ccolumn-name">Количество комнат</label>
              <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} required />
            </div>
          </div>

          <div className="fields-row">
            <div className="field">
              <label className="ccolumn-name">Количество спален</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
            </div>
            <div className="field">
              <label className="ccolumn-name">Количество кроватей</label>
              <input type="number" name="beds" value={formData.beds} onChange={handleChange} required />
            </div>
            <div className="field">
              <label className="ccolumn-name">Хозяин жилья (email)</label>
              <input type="email" name="owner" value={formData.owner} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="field rent-price">
        <label className="ccolumn-name" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          Арендная плата, 
          <Ruble style={{ width: "18px", height: "18px", fill: "black" }} />
        </label>

          <div className="rent-options">
          <button type="button" className={selectedRent === "daily" ? "active" : ""} onClick={() => setSelectedRent("daily")}>
            За сутки
          </button>
          <button type="button" className={selectedRent === "monthly" ? "active" : ""} onClick={() => setSelectedRent("monthly")}>
            В месяц
          </button>
        </div>
          <input className="field" type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>


          <div className="fields-container">
            <div className="fields-row">
              <div className="field description-field">
                <div className="field">
                  <label className="ccolumn-name">Описание</label>
                  <textarea className="custom-textarea" name="description" value={formData.description} onChange={handleChange} required />
                </div>
              </div>
              <div className="field amenities-field">
                <div className="field">
                  
                <label className="ccolumn-name">Основные удобства</label>
                <textarea className="custom-textarea" name="amenities" value={formData.amenities} onChange={handleChange} required />
                </div>
              </div>
              <div className="field">

              </div>
            </div>
        </div>

        <div className="button-group">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className="submit-button">
            {editingAd ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdForm;
