import React, {useEffect, useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import Header from "../HeaderComponents/Header";
import "../../styles/adDetails.css";
import defaultImg from "../../assets/default-avatar.jpg";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";
import PropertyService from "../../api/propertyService";
import {ReactComponent as LoacationIcon} from "../../assets/Location.svg";
const AdDetails = () => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();
    const queryClient = useQueryClient();

    const editingProperty = location.state?.editingProperty;

    const updatePropertyMutation = useMutation({
        mutationFn: ({propertyId, formData}) => PropertyService.update(propertyId, formData),
        onSuccess: (_, variables) => {
            const status = variables.formData.get("propertyStatus");
            toast.success(`Объявление ${status === "PUBLISHED" ? "принято" : "отклонено"}`);
            queryClient.invalidateQueries({queryKey: ["properties"]});
            queryClient.invalidateQueries({queryKey: ["properties", "moderation"]});
            navigate("/moderation");
        },
        onError: (err) => {
            const message = err.response?.data?.message || err.message;
            toast.error(`Ошибка обновления статуса: ${message}`);
        },
    });

    const handleAction = (status) => {
        const formData = new FormData();
        formData.append("title", editingProperty.title || "");
        formData.append("description", editingProperty.description || "");
        formData.append("address", editingProperty.address || "");
        formData.append("cost", editingProperty.cost || 0);
        formData.append("area", editingProperty.area || 0);
        formData.append("bathrooms", editingProperty.bathrooms || 0);
        formData.append("bedrooms", editingProperty.bedrooms || 0);
        formData.append("rooms", editingProperty.rooms || 0);
        formData.append("sleepingPlaces", editingProperty.sleepingPlaces || 0);
        formData.append("maxGuests", editingProperty.maxGuests || 0);
        formData.append("longTermRent", editingProperty.longTermRent);
        formData.append("propertyStatus", status);
        formData.append("ownerId", editingProperty.ownerDTO.userId);

        editingProperty.facilitiesDTOs?.forEach((f) => {
            formData.append("facilitiesIds", f.facilityId);
        });

        editingProperty.categoriesDTOs?.forEach((c) => {
            formData.append("categoriesIds", c.categoryId);
        });

        if (editingProperty.imagesDTOs) {
            editingProperty.imagesDTOs.forEach(file => {
                if (file.file instanceof File) {
                    formData.append("files", file.file);
                }
            });
        }

        updatePropertyMutation.mutate({
            propertyId: editingProperty.propertyId,
            formData,
        });
    };

    if (!editingProperty) {
        return <div className="error-message">Объявление не найдено</div>;
    }

    const propertyDetails = [
        {value: `${editingProperty.area} м²`},
        {label: "комнаты", value: editingProperty.rooms},
        {label: "спальни", value: editingProperty.bedrooms},
        {label: "гости", value: editingProperty.maxGuests},
        {label: "кровати", value: editingProperty.sleepingPlaces},
        {label: "ванные", value: editingProperty.bathrooms},
    ];return (
        <div>
            <Header/>
            <div className="ad-details-container">
                <div className="images-section">
                    <div className="image-wrapper">
                        <img
                            src={editingProperty.imagesDTOs?.[0]?.url || defaultImg}
                            alt="Главное фото"
                            className="main-image"
                        />
                        <Link
                            to={`/gallery/${editingProperty.propertyId}`}
                            state={{images: editingProperty.imagesDTOs}}
                        >
                            <button className="show-all-button">Показать все</button>
                        </Link>
                    </div>
                    <div className="thumbnail-container">
                        {editingProperty.imagesDTOs?.slice(1,5).map((img, index) => (
                            <img
                                key={index}
                                src={img.url}
                                alt={`Фото ${index + 1}`}
                                className="thumbnail"
                            />
                        ))}
                    </div>
                </div>

                <div className="ad-header">
                    <h6 className="property-title">{editingProperty.title}</h6>
                    <p className="price">
                        {editingProperty.cost}₽
                        <span className="price-period">
              {editingProperty.longTermRent ? " в месяц" : " за сутки"}
            </span>
                    </p>
                </div>

                <div className="ad-details-tags">
                    {propertyDetails.map((detail, index) => (
                        <div key={index} className="tag">
                            <span className="detail-value">{detail.value} </span>
                            <span>{detail.label} </span>
                        </div>
                    ))}
                </div>

                <h6 className="section-title">Описание</h6>
                <div className="description-container">
                    <p className={`description ${expanded ? "expanded" : ""}`}>
                        {editingProperty.description}
                    </p>
                    {editingProperty.description?.length > 200 && (
                        <span
                            className="show-more"
                            onClick={() => setExpanded(!expanded)}
                        >
              {expanded ? "Скрыть" : "Показать полностью"}
            </span>
                    )}
                </div>

                <h6 className="section-title">Основные удобства</h6>
                <ul className="amenities">
                    {editingProperty.facilitiesDTOs?.map((facility, index) => (
                        <li key={index} className="amenity-item">
                            <img src={facility.imageDTO?.url} alt={index}/>
                            {facility.name}
                        </li>
                    ))}
                </ul>

               <h6 className="section-title">Расположение</h6>
                <div className="location">
                    <LoacationIcon className="location-icon" />
                    <span>{editingProperty.address}</span>
                    </div>
                <h6 className="section-title">Хозяин</h6>
                <div className="host-wrapper">
                    <div className="host-info">
                        <img
                            src={editingProperty.ownerDTO?.imageDTO?.url || defaultImg}
                            alt="Аватар владельца"
                            className="host-avatar"
                        />
                        <div className="host-details">
                            <strong className="host-name">
                                {editingProperty.ownerDTO?.name} {editingProperty.ownerDTO?.surname}
                            </strong>
                            <p className="host-email">{editingProperty.ownerDTO?.email}</p>
                        </div>
                    </div>
                    <p className="description">
                        Участник rentplace с 2025 года
                    </p>
                </div>
                <div className="moderation-buttons">
                    <button className="reject-buttonn" onClick={() => handleAction("REJECTED")}>
                        Отклонить
                    </button>
                    <button className="approve-buttonn" onClick={() => handleAction("PUBLISHED")}>
                        Принять
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdDetails;