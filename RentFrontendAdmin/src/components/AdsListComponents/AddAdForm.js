import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import "../../styles/adform.css";
import {ReactComponent as Ruble} from "../../assets/Ruble.svg";
import Header from "../HeaderComponents/Header";
import {ReactComponent as Image} from "../../assets/Camera.svg";
import {ReactComponent as Trash} from "../../assets/Trash.svg";
import categoryService from "../../api/categoryService";
import facilityService from "../../api/facilityService";
import userService from "../../api/userService";
import PropertyService from "../../api/propertyService";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const VALIDATION_RULES = {
    TITLE_MAX_LENGTH: 100,
    ADDRESS_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 2000,
    MIN_IMAGES: 3,
    MAX_IMAGES: 20,
    MIN_NUMBER_VALUE: 0,
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    ALLOWED_FILE_TYPES: ["image/jpeg", "image/png"]
};

const AddAdForm = ({onCancel}) => {
    const navigate = useNavigate();
    const [propertyStatuses] = useState([
        "PUBLISHED",
        "ON_MODERATION",
        "REJECTED",
        "NOT_PUBLISHED"
    ]);

    const [categories, setCategories] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [owners, setOwners] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        propertyStatus: "ON_MODERATION",
        title: "",
        address: "",
        description: "",
        longTermRent: false,
        cost: 0,
        area: 0,
        rooms: 0,
        bedrooms: 0,
        sleepingPlaces: 0,
        bathrooms: 2,
        maxGuests: 0,
        ownerId: "",
        categoriesIds: [],
        facilitiesIds: [],
        images: []
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [cats, facs, ownersRes] = await Promise.all([
                    categoryService.getAll(),
                    facilityService.getAll(),
                    userService.getAll()
                ]);

                setCategories(cats);
                setFacilities(facs);
                setOwners(ownersRes);
            } catch (err) {
                toast.error(`Ошибка загрузки данных: ${err.message}`);
            }
        };
        loadInitialData();
    }, []);

    const validateForm = () => {
        const errors = {};
        const totalImages = formData.images.length;

        const numberFields = [
            'area', 'maxGuests', 'rooms',
            'bedrooms', 'sleepingPlaces', 'cost'
        ];

        numberFields.forEach(field => {
            if (formData[field] <= VALIDATION_RULES.MIN_NUMBER_VALUE) {
                errors[field] = 'Значение должно быть положительным';
            }
        });

        if (!formData.title.trim()) errors.title = 'Введите название';
        if (formData.title.length > VALIDATION_RULES.TITLE_MAX_LENGTH) {
            errors.title = `Максимум ${VALIDATION_RULES.TITLE_MAX_LENGTH} символов`;
        }

        if (!formData.address.trim()) errors.address = 'Введите адрес';
        if (formData.address.length > VALIDATION_RULES.ADDRESS_MAX_LENGTH) {
            errors.address = `Максимум ${VALIDATION_RULES.ADDRESS_MAX_LENGTH} символов`;
        }

        if (!formData.description.trim()) errors.description = 'Введите описание';
        if (formData.description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
            errors.description = `Максимум ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} символов`;
        }

        if (totalImages < VALIDATION_RULES.MIN_IMAGES) {
            errors.images = `Минимум ${VALIDATION_RULES.MIN_IMAGES} фотографии`;
        }
        if (totalImages > VALIDATION_RULES.MAX_IMAGES) {
            errors.images = `Максимум ${VALIDATION_RULES.MAX_IMAGES} фотографий`;
        }

        if (formData.categoriesIds.length === 0) errors.categoriesIds = 'Выберите категории';
        if (formData.facilitiesIds.length === 0) errors.facilitiesIds = 'Выберите удобства';
        if (!formData.ownerId) errors.ownerId = 'Выберите владельца';

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

    const queryClient = useQueryClient();

    const createPropertyMutation = useMutation({
        mutationFn: (formDataToSend) => PropertyService.create(formDataToSend),
        onSuccess: async () => {
            toast.success("Объявление успешно создано!");
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['properties'] }),
                queryClient.invalidateQueries({ queryKey: ['moderation'] })
            ]);
            navigate("/ads", { replace: true });
        },
        onError: (err) => {
            const errorMessage = err.message;
            toast.error(`Ошибка создания: ${errorMessage}`);
        },
    });


    const handleNumberInput = (e) => {
        const {name, value} = e.target;
        const numericValue = Math.max(VALIDATION_RULES.MIN_NUMBER_VALUE, Number(value));
        setFormData(prev => ({...prev, [name]: numericValue}));
    };

    const handleTextInput = (e) => {
        const {name, value, maxLength} = e.target;
        const newValue = value.slice(0, maxLength);
        setFormData(prev => ({...prev, [name]: newValue}));
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const formatSelectedValues = (ids, data) => {
        return data
            .filter(item => ids.includes(item.categoryId || item.facilityId))
            .map(item => item.name)
            .join(", ");
    };

    const handleMultiSelect = (e, field) => {
        const options = Array.from(e.target.selectedOptions, opt => Number(opt.value));
        setFormData(prev => ({...prev, [field]: options}));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const currentTotal = formData.images.length;
        const potentialTotal = currentTotal + files.length;

        if (potentialTotal > VALIDATION_RULES.MAX_IMAGES) {
            toast.error(`Максимальное количество фотографий: ${VALIDATION_RULES.MAX_IMAGES}`);
            e.target.value = null;
            return;
        }

        const validFiles = [];
        const errors = [];

        files.forEach(file => {
            if (!VALIDATION_RULES.ALLOWED_FILE_TYPES.includes(file.type)) {
                errors.push(`Файл ${file.name}: недопустимый тип. Допустимы только JPEG и PNG.`);
                return;
            }

            if (file.size > VALIDATION_RULES.MAX_FILE_SIZE) {
                errors.push(`Файл ${file.name}: размер превышает 5MB.`);
                return;
            }

            validFiles.push(file);
        });

        if (errors.length > 0) {
            errors.forEach(err => toast.error(err));
        }

        const newImages = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));

        e.target.value = null;
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(formData.images[index].preview);

        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
        toast.info("Изображение удалено из загрузки");
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'categoriesIds' || key === 'facilitiesIds') {
                    value.forEach(v => formDataToSend.append(key, v.toString()));
                } else if (key !== 'images') {
                    formDataToSend.append(key, value.toString());
                }
            });

            formData.images.forEach(img => {
                formDataToSend.append("files", img.file, img.file.name);
            });

            createPropertyMutation.mutate(formDataToSend);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            toast.error(`Ошибка создания: ${errorMessage}`);

            if (err.response?.data?.errors) {
                const serverErrors = err.response.data.errors
                    .map(e => `${e.field}: ${e.message}`)
                    .join('\n');
                toast.error(`Ошибки сервера:\n${serverErrors}`, {
                    autoClose: 10000,
                    style: {whiteSpace: 'pre-line'}
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="add-ad-container">
            <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange}/>
            <form className="add-ad-form" onSubmit={handleSubmit}>
                <h2 className="form-title">Добавить объявление</h2>

                <div className="field-group">
                    <label className="ccolumn-name">
                        Изображения ({formData.images.length}/{VALIDATION_RULES.MAX_IMAGES})
                    </label>
                    <div className="image-preview-container">
                        {formData.images.map((image, index) => (
                            <div key={index} className="image-preview">
                                <img src={image.preview} alt={`Preview ${index}`}/>
                                <button
                                    className="delete-image-btn"
                                    onClick={() => removeImage(index)}
                                    type="button"
                                >
                                    <Trash/>
                                </button>
                            </div>
                        ))}
                        <label htmlFor="file-input" className="image-upload-button">
                            <div className="upload-content">
                                <span>Добавить фото</span>
                                <Image className="upload-icon"/>
                            </div>
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            disabled={formData.images.length >= VALIDATION_RULES.MAX_IMAGES}
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="ccolumn-name">
                        Название ({formData.title.length}/{VALIDATION_RULES.TITLE_MAX_LENGTH})
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleTextInput}
                        maxLength={VALIDATION_RULES.TITLE_MAX_LENGTH}
                        required
                    />
                </div>

                <div className="field">
                    <label className="ccolumn-name">
                        Адрес ({formData.address.length}/{VALIDATION_RULES.ADDRESS_MAX_LENGTH})
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleTextInput}
                        maxLength={VALIDATION_RULES.ADDRESS_MAX_LENGTH}
                        required
                    />
                </div>

                <div className="fields-container">
                    <div className="fields-row">
                        <div className="field">
                            <label className="ccolumn-name">Общая площадь (м²)</label>
                            <input
                                type="number"
                                name="area"
                                value={formData.area}
                                onChange={handleNumberInput}
                                min={VALIDATION_RULES.MIN_NUMBER_VALUE}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="ccolumn-name">Количество гостей</label>
                            <input
                                type="number"
                                name="maxGuests"
                                value={formData.maxGuests}
                                onChange={handleNumberInput}
                                min={VALIDATION_RULES.MIN_NUMBER_VALUE}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="ccolumn-name">Количество комнат</label>
                            <input
                                type="number"
                                name="rooms"
                                value={formData.rooms}
                                onChange={handleNumberInput}
                                min={VALIDATION_RULES.MIN_NUMBER_VALUE}
                                required
                            />
                        </div>
                    </div>

                    <div className="fields-row">
                        <div className="field">
                            <label className="ccolumn-name">Количество спален</label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleNumberInput}
                                min={VALIDATION_RULES.MIN_NUMBER_VALUE}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="ccolumn-name">Количество кроватей</label>
                            <input
                                type="number"
                                name="sleepingPlaces"
                                value={formData.sleepingPlaces}
                                onChange={handleNumberInput}
                                min={VALIDATION_RULES.MIN_NUMBER_VALUE}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="ccolumn-name">Хозяин жилья (email)</label>
                            <select
                                name="ownerId"
                                value={formData.ownerId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Выберите владельца</option>
                                {owners.map((owner) => (
                                    <option key={owner.userId} value={owner.userId}>
                                        {owner.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="fields-row">
                    <div className="field">
                        <label className="ccolumn-name">Категории</label>
                        <select
                            multiple
                            name="categoriesIds"
                            value={formData.categoriesIds}
                            onChange={(e) => handleMultiSelect(e, 'categoriesIds')}
                            className="multi-select"
                            required
                        >
                            <option>{formatSelectedValues(formData.categoriesIds, categories) || "Выберите категории..."}</option>
                            {categories.map(category => (
                                <option
                                    key={category.categoryId}
                                    value={category.categoryId}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label className="ccolumn-name">Удобства</label>
                        <select
                            multiple
                            name="facilitiesIds"
                            value={formData.facilitiesIds}
                            onChange={(e) => handleMultiSelect(e, 'facilitiesIds')}
                            className="multi-select"
                            required
                        >
                            <option>{formatSelectedValues(formData.facilitiesIds, facilities) || "Выберите удобства..."}</option>
                            {facilities.map(facility => (
                                <option
                                    key={facility.facilityId}
                                    value={facility.facilityId}
                                >
                                    {facility.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label className="ccolumn-name">Статус</label>
                        <select
                            name="propertyStatus"
                            value={formData.propertyStatus}
                            onChange={handleChange}
                        >
                            {propertyStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="field rent-price">
                    <label className="ccolumn-name" style={{display: "flex", alignItems: "center", gap: "6px"}}>
                        Арендная плата,
                        <Ruble style={{width: "18px", height: "18px", fill: "black"}}/>
                    </label>
                    <div className="rent-options">
                        <button
                            type="button"
                            className={`${!formData.longTermRent ? "active" : ""}`}
                            onClick={() => setFormData(p => ({...p, longTermRent: false}))}
                        >
                            За сутки
                        </button>
                        <button
                            type="button"
                            className={`${formData.longTermRent ? "active" : ""}`}
                            onClick={() => setFormData(p => ({...p, longTermRent: true}))}
                        >
                            В месяц
                        </button>
                    </div>
                    <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleNumberInput}
                        min={VALIDATION_RULES.MIN_NUMBER_VALUE}
                        required
                    />
                </div>

                <div className="fields-container">
                    <div className="fields-row">
                        <div className="description-field">
                            <label className="сcolumn-name">
                                Описание ({formData.description.length}/{VALIDATION_RULES.DESCRIPTION_MAX_LENGTH})
                            </label>
                            <textarea
                                className="custom-textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleTextInput}
                                maxLength={VALIDATION_RULES.DESCRIPTION_MAX_LENGTH}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="button-group">
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
                        {loading ? 'Добавление...' : 'Добавить'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAdForm;