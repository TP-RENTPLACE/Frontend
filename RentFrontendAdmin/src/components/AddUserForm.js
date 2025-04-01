import React, { useState } from "react";
import "../styles/userform.css";

const AddUserForm = ({ addNewUser, editingUser, onCancel }) => {
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

  return (
    <form className="add-user-form" onSubmit={handleSubmit}>
      <h2>{editingUser ? "Редактировать пользователя" : "Добавить пользователя"}</h2>

      {/* Фото профиля с кнопкой редактирования */}
      <div className="profile-photo">
        <div className="photo-container">
          <img
            src={formData.photo || "/images/default-avatar.png"}
            alt="Фото профиля"
            className="user-photo-preview"
          />
          <label className="photo-edit-button">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <img src="/images/edit-icon.png" alt="Изменить" />
          </label>
        </div>
      </div>

      {/* Поля формы */}
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

      <div>
        <label>Дата регистрации:</label>
        <input type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange} required />
      </div>

      {/* Кнопки */}
      <div className="button-group">
        <button type="submit" className="submit-button">
          {editingUser ? "Сохранить" : "Добавить"}
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Отменить
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
