import React, {useEffect, useState} from "react";
import "../../styles/adform.css";
import {ReactComponent as Image} from "../../assets/Camera.svg";
import Header from "../HeaderComponents/Header";

    }

    const handleMultiSelect = (e, field) => {
        const options = Array.from(e.target.selectedOptions, opt => Number(opt.value));
        setFormData(prev => ({ ...prev, [field]: options }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;


    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            });await PropertyService.create(formDataToSend);
            navigate("/ads", { state: { refresh: true } });

        } catch (err) {
            console.error("Ошибка создания объявления:", err);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    return (
        <div className="add-ad-container">
            <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange}/>
            <form className="add-ad-form" onSubmit={handleSubmit}>
                <h2 className="form-title">{"Добавить объявление"}</h2>

                <div className="field-group">
                    <label className="ccolumn-name">Изображения</label>
                    <div className="image-preview-container">
                        {formData.images.map((image, index) => (
                            <div key={index} className="image-preview">
                                <img src={image.preview} alt={`Preview ${index}`}/>
                                <button className="delete-image-btn"
                                        onClick={() => removeImage(index)}
                                        type="button">
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

                        <input id="file-input" type="file" accept="image/*" multiple onChange={handleFileChange}/>
                    </div>
                </div>

                <div className="field">
                    <label className="ccolumn-name">Название</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required/>
                </div>

                <div className="field">
                    <label className="ccolumn-name">Адрес</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required/>
                </div>

                <div className="fields-container">
                    <div className="fields-row">
                        <div className="field">
                            <label className="ccolumn-name">Общая площадь (м²)</label>
                            <input type="number" name="area" value={formData.area} onChange={handleChange} required/>
                        </div>
                        <div className="field">
                            <label className="ccolumn-name">Количество гостей</label>
                            <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleChange}
                                   required/>
                        </div>
                        <div className="field">
                            <label className="ccolumn-name">Количество комнат</label>
                            <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} required/>
                        </div>
                    </div><div className="fields-row">
                        <div className="field">
                            <label className="ccolumn-name">Количество спален</label>
                            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange}
                                   required/>
                        </div>
                        <div className="field">
                            <label className="ccolumn-name">Количество кроватей</label>
                            <input type="number" name="sleepingPlaces" value={formData.sleepingPlaces} onChange={handleChange} required/>
                        </div>
                        <div className="field">
                            <label className="ccolumn-name">Хозяин жилья (email)</label>
                            <select
                                name="ownerId"
                                value={formData.ownerId}
                                onChange={handleChange}
                            >
                                {owners.map((owner) => (
                                    <option key={owner.userId} value={owner.userId}>
                                        {owner.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div><div className="fields-row">
                    <div className="field">
                        <label className="ccolumn-name">Категории</label>
                        <select
                            multiple
                            name="categoriesIds"
                            value={formData.categoriesIds}
                            onChange={(e) => handleMultiSelect(e, 'categoriesIds')}
                            className="multi-select"
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
                        <button type="button" className={`${!formData.longTermRent ? "active" : ""}`}
                                onClick={() => setFormData(p => ({...p, longTermRent: false}))}>
                            За сутки
                        </button>
                        <button type="button" className={`${formData.longTermRent ? "active" : ""}`}
                                onClick={() => setFormData(p => ({...p, longTermRent: true}))}>
                            В месяц
                        </button>
                    </div>
                    <input type="number" name="cost" value={formData.price} onChange={handleChange} required/>
                </div><div className="fields-container">
                    <div className="fields-row">
                        <div className="field description-field">
                            <div className="field">
                                <label className="ccolumn-name">Описание</label>
                                <textarea className="custom-textarea" name="description" value={formData.description}
                                          onChange={handleChange} required/>
                            </div>
                        </div>
                        <div className="field"></div>
                        <div className="field"></div>
                    </div>
                </div>

                <div className="button-group">
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

export default AddAdForm;