import React, {useEffect, useState} from "react";

import Header from "../HeaderComponents/Header";
import { ReactComponent as EditIcon } from '../../assets/EditIcon.svg';
import userService from "../../api/userService";
import {useNavigate} from "react-router-dom";

import birthdayIcon from "../../assets/Birthday.svg";

const AddUserForm = ({ addNewUser, editingUser, onCancel, onDelete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    role: "ROLE_USER",
    birthDate: "",
    gender: "",
  });

  useEffect(() => {
    setFormData({
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      role: formData.role,
      birthDate: formData.birthDate,
      gender: formData.gender,
    });
  }, []);

  const genderMapping = {
    'Мужской': 'MALE',
    'Женский': 'FEMALE',
    'Не указан': ''
  };

  const reverseGenderMapping = {
    'MALE': 'Мужской',
    'FEMALE': 'Женский',
    'UNSPECIFIED': 'Не указан'
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      const gender = genderMapping[formData.gender] || "";
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("birthDate", formData.birthDate);

      formDataToSend.append("gender", gender);

      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      console.log(formData);
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await userService.create(formDataToSend);

      addNewUser({
        ...response.data,
        imageDTO: selectedFile
            ? { url: URL.createObjectURL(selectedFile) }
            : editingUser.imageDTO
      });

      onCancel();
      navigate("/users", { state: { refresh: true } });

    } catch (err) {
      setError(err.response?.data?.message || "Ошибка обновления пользователя");
      console.error("Ошибка обновления:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="add-ad-container">
      <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <form className="add-user-form">
        <h2>{ "Добавить пользователя"}</h2>
          
          <div className="profile-photo">
            <div className="photo-wrapper">
              <div className="photo-label">Фотография профиля</div>
              <div className="photo-container">
                <div className="photo-preview">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Photo" />
                  ) : (
                    <div className="empty-photo" />
                  )}
                </div>
                <label className="photo-edit-button">
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  <EditIcon width="20" height="20" />
                </label>
              </div>
            </div>
          </div><div className="fields-row">
          <div>
            <label className="column-name">Почта</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="column-name">Имя</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="column-name">Фамилия</label>
            <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
          </div>
        </div>

        <div className="fields-row">
        <div>
          <label className="column-name">Дата рождения</label>
          <div className="date-field-with-icon">
            <input
              type="date"
              id="birthDateAddInput"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
            <img
              src={birthdayIcon}
              alt="calendar"
              className="custom-calendar-icon"
              onClick={() => document.getElementById("birthDateAddInput")?.showPicker?.()}
            />
          </div>
        </div>

          <div>
            <label className="column-name">Пол</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Не указан">Не указан</option>
              <option value="Мужской">Мужской</option>
              <option value="Женский">Женский</option>
            </select>

          </div>
          <div>
            <label className="column-name">Роль</label>
            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
            >
              <option value="ROLE_USER">Пользователь</option>
              {/*<option value="Модератор">Модератор</option>*/}
              <option value="ROLE_ADMIN">Администратор</option>
            </select>
          </div>
        </div>

        <div className="fields-row">
          <div>
            <label className="column-name">Дата регистрации</label>
            <div className="date-field-with-icon">
            <input
              type="date"
              id="registrationDateAddInput"
              name="registrationDate"
              required
            />
            <img
              src={birthdayIcon}
              alt="calendar"
              className="custom-calendar-icon"
              onClick={() => document.getElementById("registrationDateAddInput")?.showPicker?.()}
            />
          </div>

          </div>
          <div></div>
          <div></div>
        </div>

        <div className="footer-buttons">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className="submit-button" onClick={handleSubmit}>
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;