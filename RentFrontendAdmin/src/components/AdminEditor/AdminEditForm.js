import React, { useState, useContext } from "react";
import "../../styles/adminform.css";
import Header from "../HeaderComponents/Header";
import { UserContext } from "../UserListComponents/UserContext";

const AdminEditForm = ({ onCancel }) => {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState(user);

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
        avatar: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(formData);
  };

  return (
    <div>
      <form className="admin-edit-form" onSubmit={handleSubmit}>
        <h2>Профиль администратора</h2>

        <div className="profile-photo">
          <div className="photo-container">
            <div className="photo-preview">
              {formData.avatar ? (
                <img src={formData.avatar} alt="" />
              ) : (
                <div className="empty-photo" />
              )}
            </div>
            <label className="photo-edit-button">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <img src="/images/edit-icon.png" alt="Изменить" />
            </label>
          </div>
        </div>

        <div className="fields-row">
          <div>
            <label>Почта:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Имя:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Фамилия:</label>
            <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
          </div>
        </div>

        <div className="fields-row">
          <div>
            <label>Дата рождения:</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
          </div>
          <div>
            <label>Пол:</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Мужской">Мужской</option>
              <option value="Женский">Женский</option>
            </select>
          </div>
          <div>
            <label>Роль:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Admin">Администратор</option>
              
              <option value="Пользователь">Пользователь</option>
            </select>
          </div>
        </div>

        <div className="fields-row">
          <div>
            <label>Дата регистрации:</label>
            <input type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="button-group">
          <button type="button" className="cancel-button" onClick={onCancel}>Отмена</button>
          <button type="submit" className="submit-button">Сохранить</button>
          
          
        </div>
      </form>
    </div>
  );
};

export default AdminEditForm;
