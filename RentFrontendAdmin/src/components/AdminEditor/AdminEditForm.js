import React, {useState, useContext, useEffect} from "react";
import "../../styles/adminform.css";
import defaultImg from "../../assets/default-avatar.jpg";
import {ReactComponent as EditIcon} from '../../assets/EditIcon.svg';
import userService from "../../api/userService";
import authService from "../../api/authService";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

const VALIDATION_RULES = {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    NAME_MAX_LENGTH: 50,
    SURNAME_MAX_LENGTH: 50,
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    MIN_AGE: 10,
    ALLOWED_FILE_TYPES: ['image/png', 'image/jpeg']
};

const AdminEditForm = ({onCancel}) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        role: 'ROLE_ADMIN',
        birthDate: '',
        gender: '',
        avatar: null,
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const { data: user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: () => authService.getInfo(),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                ...user,
                birthDate: user.birthDate?.split('T')[0] || '',
                avatar: user.imageDTO?.url || "/assets/default-avatar.jpg"
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
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
        setFormData(prev => ({
            ...prev,
            avatar: URL.createObjectURL(file),
        }));
    };

    const validateForm = () => {
        const errors = {};
        const today = new Date();
        const birthDate = new Date(formData.birthDate.split('T')[0]);
        const minBirthDate = new Date();
        minBirthDate.setFullYear(today.getFullYear() - VALIDATION_RULES.MIN_AGE);

        if (!formData.name.trim()) {
            errors.name = "Имя обязательно для заполнения";
        } else if (formData.name.length < VALIDATION_RULES.MIN_NAME_LENGTH) {
            errors.name = `Имя должно быть не короче ${VALIDATION_RULES.MIN_NAME_LENGTH} символов`;
        }

        if (!formData.surname.trim()) {
            errors.surname = "Фамилия обязательна для заполнения";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            errors.email = "Email обязателен для заполнения";
        } else if (!emailRegex.test(formData.email)) {
            errors.email = "Некорректный формат email";
        }

        if (!formData.birthDate) {
            errors.birthDate = "Дата рождения обязательна";
        } else if (birthDate > today) {
            errors.birthDate = "Дата рождения не может быть в будущем";
        } else if (birthDate > minBirthDate) {
            errors.birthDate = `Минимальный возраст - ${VALIDATION_RULES.MIN_AGE} лет`;
        }

        if (!formData.gender) {
            errors.gender = "Укажите пол";
        }

        if (Object.keys(errors).length > 0) {
            const errorMessage = Object.values(errors).join('\n');
            toast.error(`Ошибки валидации:\n${errorMessage}`, {
                autoClose: 8000,
                style: {whiteSpace: 'pre-line'}
            });
            return false;
        }
        return true;
    };

    const updateMutation = useMutation({
        mutationFn: (data) => userService.updateMe(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['user'] });
            await queryClient.refetchQueries({ queryKey: ['user'] });
            await queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success("Профиль успешно обновлен!");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Ошибка обновления профиля");
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("surname", formData.surname);
        data.append("email", formData.email);
        data.append("role", formData.role);
        data.append("birthDate", formData.birthDate);
        data.append("gender", formData.gender);
        if (selectedFile) {
            data.append("file", selectedFile);
        }

        updateMutation.mutate(data);
        setLoading(false);
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
                                    {formData?.avatar ? (
                                        <img src={formData.avatar} alt="avatar"/>
                                    ) : (
                                        <img src={defaultImg} alt="default" />
                                    )}
                                </div>
                                <label className="photo-edit-button">
                                    <input type="file" accept="image/*" onChange={handleImageChange}
                                           disabled={loading}/>
                                    <EditIcon width="20" height="20"/>
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
                                required/>
                        </div>
                        <div>
                            <label className="column-name">Имя</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                maxLength={VALIDATION_RULES.NAME_MAX_LENGTH}
                                required/>
                        </div>
                        <div>
                            <label className="column-name">Фамилия</label>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                maxLength={VALIDATION_RULES.SURNAME_MAX_LENGTH}
                                required/>
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
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div>
                            <label className="column-name">Пол</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">Не указан</option>
                                <option value="MALE">Мужской</option>
                                <option value="FEMALE">Женский</option>
                            </select>
                        </div>
                        <div>
                            <label className="column-name">Роль</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="ROLE_USER">Пользователь</option>
                                <option value="ROLE_ADMIN">Администратор</option>
                            </select>
                        </div>
                    </div>

                    {/*<div className="fields-row">*/}
                    {/*  <div>*/}
                    {/*    <label className="column-name">Дата регистрации</label>*/}
                    {/*    <input type="date" name="registrationDate" required />*/}
                    {/*  </div>*/}
                    {/*  <div></div>*/}
                    {/*  <div></div>*/}
                    {/*</div>*/}

                    <div className="footer-buttonss">
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