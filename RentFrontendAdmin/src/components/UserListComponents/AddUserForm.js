import React, { useState } from "react";
import "../../styles/userform.css";
import Header from "../HeaderComponents/Header";
import { ReactComponent as EditIcon } from '../../assets/EditIcon.svg';

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
        <h2>{editingUser ? "Изменение пользователя" : "Добавить пользователя"}</h2>

        <div className="profile-photo">
          <div className="photo-container">
            <label className="photo-upload">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <div className="photo-preview">
                {formData.photo ? (
                  <img src={formData.photo}/>
                ) : (
                  <div className="empty-photo"></div>
                )}
                <div className="photo-edit-button">
                  <EditIcon width="20" height="20" />
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="fields-row">
          <div>
            <label className="column-name">Почта:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="column-name">Имя:</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label className="column-name">Фамилия:</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="fields-row">
          <div>
            <label className="column-name">Дата рождения:</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
          </div>
          <div>
            <label className="column-name">Пол:</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Мужской">Мужской</option>
              <option value="Женский">Женский</option>
              <option value="Не указан">Не указан</option>
            </select>
          </div>
          <div>
            <label className="column-name">Роль:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Пользователь">Пользователь</option>
              <option value="Менеджер">Менеджер</option>
              <option value="Администратор">Администратор</option>
            </select>
          </div>
        </div>

        <div className="fields-row registration-field">
          <div>
            <label className="column-name">Дата регистрации:</label>
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
