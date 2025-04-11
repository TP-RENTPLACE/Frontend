import React, { useState } from "react";
import "../../styles/userform.css";
import Header from "../HeaderComponents/Header";

const AddUserForm = ({ addNewUser, editingUser, onCancel, onDelete }) => {
  const [formData, setFormData] = useState(
    editingUser || {
      email: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "Не указан",
      role: "Пользователь",
      registrationDate: new Date().toISOString().split("T")[0],
      photo: null,
    }
  );
  const [searchQuery, setSearchQuery] = useState("");
  

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
        photo: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: editingUser ? editingUser.id : Date.now(),
      ...formData,
    };
    addNewUser(newUser);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="add-ad-container">
      <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <form className="add-user-form" onSubmit={handleSubmit}>
        <h2>{editingUser ? "Изменение пользователя" : "Добавление пользователя"}</h2>

        <div className="profile-photo">
          <div className="photo-container">
            <label className="photo-upload">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <div className="photo-preview">
                {formData.photo ? (
                  <img src={formData.photo} alt="Фото профиля" />
                ) : (
                  <div className="empty-photo"></div>
                )}
                <div className="photo-edit-button">
                  <img src="/images/edit-icon.png" alt="Изменить" />
                </div>
              </div>
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
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label>Фамилия:</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
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
              <option value="Не указан">Не указан</option>
            </select>
          </div>
          <div>
            <label>Роль:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Пользователь">Пользователь</option>
              <option value="Менеджер">Менеджер</option>
              <option value="Администратор">Администратор</option>
            </select>
          </div>
        </div>

        <div className="fields-row registration-field">
          <div>
            <label>Дата регистрации:</label>
            <input type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="button-group">
        <button type="button" className="cancel-button" onClick={onCancel}>
            Отменить
          </button>
          <button type="submit" className="submit-button">
            {editingUser ? "Сохранить" : "Добавить"}
          </button>
          
          {editingUser && (
            <button type="button" className="delete-button" onClick={onDelete}>
              
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
