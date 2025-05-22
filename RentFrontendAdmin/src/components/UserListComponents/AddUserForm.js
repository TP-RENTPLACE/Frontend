import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../HeaderComponents/Header";
import { ReactComponent as EditIcon } from '../../assets/EditIcon.svg';
import userService from "../../api/userService";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import defaultImg from "../../assets/default-avatar.jpg";

const AddUserForm = ({ onCancel }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const VALIDATION_RULES = {
    NAME_MAX_LENGTH: 50,
    SURNAME_MAX_LENGTH: 50,
    MIN_AGE: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    ALLOWED_FILE_TYPES: ["image/jpeg", "image/png"]
  };

  const genderMapping = {
    'Мужской': 'MALE',
    'Женский': 'FEMALE',
    'Не указан': 'UNSPECIFIED'
  };

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    role: "ROLE_USER",
    birthDate: "",
    gender: "Не указан",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const birthDate = new Date(formData.birthDate);
    const minBirthDate = new Date();
    minBirthDate.setFullYear(today.getFullYear() - VALIDATION_RULES.MIN_AGE);

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Некорректный формат email";
    }

    if (!formData.name.trim()) errors.name = "Введите имя";
    if (formData.name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
      errors.name = `Максимум ${VALIDATION_RULES.NAME_MAX_LENGTH} символов`;
    }

    if (!formData.surname.trim()) errors.surname = "Введите фамилию";
    if (formData.surname.length > VALIDATION_RULES.SURNAME_MAX_LENGTH) {
      errors.surname = `Максимум ${VALIDATION_RULES.SURNAME_MAX_LENGTH} символов`;
    }

    if (!formData.birthDate) errors.birthDate = "Введите дату рождения";
    else if (birthDate > today) {
      errors.birthDate = "Дата рождения не может быть в будущем";
    } else if (birthDate > minBirthDate) {
      errors.birthDate = `Минимальный возраст - ${VALIDATION_RULES.MIN_AGE} лет`;
    }

    if (selectedFile) {
      if (!VALIDATION_RULES.ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        errors.file = "Допустимые форматы: JPEG, PNG, GIF";
      }
      if (selectedFile.size > VALIDATION_RULES.MAX_FILE_SIZE) {
        errors.file = "Максимальный размер файла - 5MB";
      }
    }

    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join('\n');
      toast.error(`Ошибки валидации:\n${errorMessage}`, {
        autoClose: 8000,
        style: { whiteSpace: 'pre-line' }
      });
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!VALIDATION_RULES.ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Допустимые форматы: JPEG, PNG, GIF");
      return;
    }

    if (file.size > VALIDATION_RULES.MAX_FILE_SIZE) {
      toast.error("Максимальный размер файла - 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const createUserMutation = useMutation({
    mutationFn: (formDataToSend) => userService.create(formDataToSend),
    onSuccess: () => {
      toast.success("Пользователь успешно создан!");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate("/users", { replace: true });
    },
    onError: (err) => {
      const errorMessage = err.message;
      toast.error(`Ошибка создания: ${errorMessage}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    const gender = genderMapping[formData.gender] || 'UNSPECIFIED';

    formDataToSend.append("name", formData.name);
    formDataToSend.append("surname", formData.surname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("birthDate", formData.birthDate);
    formDataToSend.append("gender", gender);

    if (selectedFile) {
      formDataToSend.append("file", selectedFile);
    }

    createUserMutation.mutate(formDataToSend);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
      <div className="add-ad-container">
        <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
        <form className="add-user-form" onSubmit={handleSubmit}>
          <h2>Добавить пользователя</h2>

          <div className="profile-photo">
            <div className="photo-wrapper">
              <div className="photo-label">Фотография профиля</div>
              <div className="photo-container">
                <div className="photo-preview">
                  {previewUrl ? (
                      <img src={previewUrl} alt="Фото профиля" />
                  ) : (
                      <img src={defaultImg} alt={defaultImg} />
                  )}
                </div>
                <label className="photo-edit-button">
                  <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                  />
                  <EditIcon width="20" height="20" />
                </label>
              </div>
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
                  disabled={loading}
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
                  disabled={loading}
                  maxLength={VALIDATION_RULES.NAME_MAX_LENGTH}
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
                  disabled={loading}
                  maxLength={VALIDATION_RULES.SURNAME_MAX_LENGTH}
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
                  disabled={loading}
                  max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="column-name">Пол</label>
              <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
              >
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
                  disabled={loading}
              >
                <option value="ROLE_USER">Пользователь</option>
                <option value="ROLE_ADMIN">Администратор</option>
              </select>
            </div>
          </div>

          <div className="fields-row"></div>
          <div className="fields-row"></div>
          <div className="fields-row"></div>
          <div className="fields-row"></div>
          <div className="fields-row"></div>
          <div className="fields-row"></div>
          <div className="fields-row"></div>
          <div className="fields-row"></div>
          <div className="fields-row"></div>

          <div className="footer-buttonss">
            <button
                type="button"
                className="cancel-button"
                onClick={onCancel}
                disabled={loading}
            >
              Отмена
            </button>
            <button
                type="submit"
                className="submit-button"
                disabled={loading}
            >
              {loading ? 'Создание...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default AddUserForm;