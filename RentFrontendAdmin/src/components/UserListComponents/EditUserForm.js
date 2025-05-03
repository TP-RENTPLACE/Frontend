import React, { useState, useEffect } from "react";
import "../../styles/userform.css";
import Header from "../HeaderComponents/Header";
import { ReactComponent as EditIcon } from '../../assets/EditIcon.svg';
import userService from "../../api/userService";

const EditUserForm = ({ editingUser, onUpdate, onCancel, onDelete }) => {

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    birthDate: "",
    gender: "",
  });

  const genderMapping = {
    'Мужской': 'MALE',
    'Женский': 'FEMALE',
    'Не указан': ""
  };

  const reverseGenderMapping = {
    'MALE': 'Мужской',
    'FEMALE': 'Женский',
    'UNSPECIFIED': ''
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    setFormData(editingUser);
  }, [editingUser]);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || "",
        surname: editingUser.surname || "",
        email: editingUser.email || "",
        birthDate: editingUser.birthDate?.split('T')[0] || "",
        gender: reverseGenderMapping[editingUser.gender] || "",
      });
      setPreviewUrl(editingUser.imageDTO?.url || "");
    }
  }, [editingUser]);

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

      const serverGender = genderMapping[formData.gender] || '';
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("birthDate", formData.birthDate);

      formDataToSend.append("gender", serverGender);

      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      console.log(formDataToSend);
      const response = await userService.update(editingUser.userId, formDataToSend);

      onUpdate({
        ...response.data,
        imageDTO: selectedFile
            ? { url: URL.createObjectURL(selectedFile) }
            : editingUser.imageDTO
      });

    } catch (err) {
      setError(err.response?.data?.message || "Ошибка обновления пользователя");
      console.error("Ошибка обновления:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить пользователя?");
    if (!confirmDelete) return;

    setLoading(true);
    setError("");

    try {
      await userService.delete(editingUser.userId);
      onDelete(editingUser.userId);
      onCancel();
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка удаления пользователя");
      console.error("Ошибка удаления:", err);
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
      <form className="add-user-form" onSubmit={handleSubmit}>



        <h2>Изменение пользователя</h2><div className="profile-photo">
          <div className="photo-container">
            <div className="photo-preview">
              {previewUrl ? (
                <img src={previewUrl} alt="Photo" />
              ) : (
                <div className="empty-photo" />
              )}
            </div>
            <label className="photo-edit-button">
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
              <EditIcon width="20" height="20" />
            </label>
          </div>
        </div>

        <div className="fields-row">
          <div>
            <label className="column-name">Почта</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="column-name">Имя</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="column-name">Фамилия</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="fields-row">
          <div>
            <label className="column-name">Дата рождения</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="column-name">Пол</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Не указан">Не указан</option>
              <option value="Мужской">Мужской</option>
              <option value="Женский">Женский</option>
            </select>
          </div>
          <div>
            <label className="column-name">Роль</label>
            <select name="role"
            onChange={handleChange}
            >
              <option value="Пользователь">Пользователь</option>
              <option value="Модератор">Модератор</option>
              <option value="Администратор">Администратор</option>
            </select>
          </div>
        </div>

        <div className="fields-row">
          <div>
            <label className="column-name">Дата регистрации</label>
            <input type="date" name="registrationDate" onChange={handleChange} required />
          </div>
          <div></div>
          <div></div>
        </div>

        <div className="footer-buttons">
          <button type="button" className="cancel-button" onClick={handleDelete}>
            Удалить
          </button>
          <button type="submit" className="submit-button" onClick={handleSubmit}>
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;