import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../styles/userform.css";
import Header from "../HeaderComponents/Header";
import { ReactComponent as EditIcon } from '../../assets/EditIcon.svg';
import userService from "../../api/userService";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import defaultImg from "../../assets/default-avatar.jpg";
import birthdayIcon from "../../assets/Birthday.svg";

const EditUserForm = ({ editingUser, onUpdate, onCancel, onDelete }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    role: "ROLE_USER",
    birthDate: "",
    gender: "",
  });

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
    'Не указан': "UNSPECIFIED"
  };

  const reverseGenderMapping = {
    'MALE': 'Мужской',
    'FEMALE': 'Женский',
    'UNSPECIFIED': 'Не указан'
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || "",
        surname: editingUser.surname || "",
        email: editingUser.email || "",
        role: editingUser.role || "ROLE_USER",
        birthDate: editingUser.birthDate?.split('T')[0] || "",
        gender: reverseGenderMapping[editingUser.gender] || "Не указан",
      });
      setPreviewUrl(editingUser.imageDTO?.url || "");
    }
  }, [editingUser]);

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!VALIDATION_RULES.ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Допустимые форматы: JPEG, PNG");
      return;
    }

    if (file.size > VALIDATION_RULES.MAX_FILE_SIZE) {
      toast.error("Максимальный размер файла - 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const updateMutation = useMutation({
    mutationFn: ({ userId, formData }) => userService.update(userId, formData),
    onSuccess: () => {
      toast.success("Пользователь обновлён");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate("/users", { replace: true });
    },
    onError: (err) => {
      const message = err.response?.data?.message || err.message;
      toast.error(`Ошибка обновления: ${message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId) => userService.delete(userId),
    onSuccess: () => {
      toast.success("Пользователь удалён");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate("/users", { replace: true });
    },
    onError: (err) => {
      const message = err.response?.data?.message || err.message;
      toast.error(`Ошибка удаления: ${message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    const serverGender = genderMapping[formData.gender] || 'UNSPECIFIED';

    Object.entries({ ...formData, gender: serverGender }).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    if (selectedFile) formDataToSend.append("file", selectedFile);

    updateMutation.mutate({ userId: editingUser.userId, formData: formDataToSend });
  };

  const handleDelete = () => {
    if (window.confirm("Удалить пользователя?")) {
      deleteMutation.mutate(editingUser.userId);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
      <div className="add-ad-container">
        <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
        <form className="add-user-form" onSubmit={handleSubmit}>
          <h2>Изменение пользователя</h2>

          <div className="profile-photo">
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
          <div className="fields-row"></div>
          <div className="fields-row"></div>

          <div className="footer-buttonss">
            <button
                type="button"
                className="cancel-button"
                onClick={handleDelete}
                disabled={loading}
            >
              {loading ? 'Удаление...' : 'Удалить'}
            </button>
            <button
                type="submit"
                className="submit-button"
                disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default EditUserForm;