import React, { useState, useContext, useEffect } from "react";
import "../../styles/adminform.css";
import { UserContext } from "../UserListComponents/UserContext";
import { ReactComponent as EditIcon } from '../../assets/EditIcon.svg';
import userService from "../../api/userService";

const AdminEditForm = ({ onCancel }) => {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState(user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        avatar: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.userId) return;

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("surname", formData.surname);
      data.append("email", formData.email);
      data.append("birthDate", formData.birthDate);
      data.append("gender", formData.gender);

      if (selectedFile) {
        data.append("file", selectedFile);
      }
      const response = await userService.update(3, data);

      setUser({
        ...response.data,
        avatar: selectedFile
            ? URL.createObjectURL(selectedFile)
            : user.avatar,
      });

      const updatedUser = await userService.getById(user.userId);
      setUser({
        ...updatedUser,
        avatar: updatedUser.imageDTO?.url || user.avatar,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка обновления профиля");
      console.error("Ошибка обновления:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        <div className="admin-form-wrapper">
          <form className="admin-edit-form" onSubmit={handleSubmit}>
            <h2>Профиль администратора</h2>

            <div className="profile-photo">
              <div className="photo-wrapper">
                <div className="photo-label">Фотография профиля</div>
                <div className="photo-container">
                  <div className="photo-preview">
                    {formData.avatar ? (
                        <img src={formData.avatar} alt="avatar" />
                    ) : (
                        <div className="empty-photo" />
                    )}
                  </div>
                  <label className="photo-edit-button">
                    <input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
                    <EditIcon width="20" height="20" />
                  </label>
                </div>
              </div>
            </div>

            <div className="fields-row">
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
            </div><div className="fields-row">
              <div>
                <label className="column-name">Дата рождения</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
              </div>
              <div>
                <label className="column-name">Пол</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Не указан</option>
                  <option value="MALE">Мужской</option>
                  <option value="FEMALE">Женский</option>
                </select>
              </div>
              <div></div>
              {/*<div>*/}
              {/*  <label className="column-name">Роль</label>*/}
              {/*  <select name="role">*/}
              {/*    <option value="Admin">Администратор</option>*/}
              {/*    <option value="Admin">Модератор</option>*/}
              {/*    <option value="Пользователь">Пользователь</option>*/}
              {/*  </select>*/}
              {/*</div>*/}
            </div>

            {/*<div className="fields-row">*/}
            {/*  <div>*/}
            {/*    <label className="column-name">Дата регистрации</label>*/}
            {/*    <input type="date" name="registrationDate" required />*/}
            {/*  </div>*/}
            {/*  <div></div>*/}
            {/*  <div></div>*/}
            {/*</div>*/}

            {error && <p className="error-message">{error}</p>}

            <div className="button-group">
              <button type="button" className="cancel-button" onClick={onCancel}>
                Отмена
              </button>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AdminEditForm;