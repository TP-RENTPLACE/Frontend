import React, {useEffect, useState} from "react";
import Header from "../HeaderComponents/Header";
import "../../styles/adsList.css";
import {ReactComponent as Plus} from "../../assets/Plus.svg";
import {useNavigate, useLocation} from "react-router-dom";
import EditAdForm from "./EditAdForm";
import PropertyService from "../../api/propertyService";
import {useQuery} from "@tanstack/react-query";
import {toast} from "react-toastify";
import propertyService from "../../api/propertyService";

const AdsList = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const propertyPerPage = 7;
    const navigate = useNavigate();
    const location = useLocation();
    const editingAdFromState = location.state?.editingAd;

    const {data: properties = [], refetch,} = useQuery({
        queryKey: ["properties"],
        queryFn: () => PropertyService.getAll(),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    useEffect(() => {
        const closeMenu = (e) => {
            if (!e.target.closest(".dropdown")) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, []);

    useEffect(() => {
        const closeMenu = (e) => {
            if (!e.target.closest(".dropdown")) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredAds = properties.filter((property) => {
        const lowercasedQuery = searchQuery.toLowerCase().trim();

        const title = property.title?.toLowerCase() || '';
        const address = property.address?.toLowerCase() || '';
        const ownerEmail = property.ownerDTO?.email?.toLowerCase() || '';

        return (
            title.includes(lowercasedQuery) ||
            address.includes(lowercasedQuery) ||
            ownerEmail.includes(lowercasedQuery)
        );
    });

    const getImageUrl = (images = []) => {
        const previewImg = images.find((img) => img.previewImage === true);
        const chosenImg = previewImg || images[0];
        if (!chosenImg) {
            return "/assets/image.png";
        }
        if (chosenImg.url) {
            return chosenImg.url;
        }
    };

    const handleDelete = async (propertyId) => {
        try {
            await propertyService.delete(propertyId);
            toast.success("Объявление удалено");
            await refetch();
        } catch (error) {
            toast.error("Ошибка при удалении объявления");
        }
    };

    const indexOfLastProperty = currentPage * propertyPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertyPerPage;
    const currentProperties = filteredAds.slice(indexOfFirstProperty, indexOfLastProperty);
    const totalPages = Math.ceil(filteredAds.length / propertyPerPage);

    return (
        <div className="ads-list">
            <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange}/>

            {!showForm && !editingAdFromState ? (
                    <>
                        <div className="ads-list-header">
                            <h1>Объявления</h1>
                            <button className="add-ad-button" onClick={() => navigate("/ads/add")}>
                                Добавить объявление
                                <Plus/>
                            </button>
                        </div>

                        <table className="ads-table">
                            <thead>
                            <tr>
                                <th>Фотография</th>
                                <th>Название объявления</th>
                                <th>Категория</th>
                                <th>Цена</th>
                                <th>Адрес</th>
                                <th>Хозяин жилья</th>
                                <th>Действие</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentProperties.length > 0 ? (
                                currentProperties.map((property) => (
                                    <tr
                                        key={property.propertyId}
                                        className="ad-row"
                                        onClick={(e) => {
                                            if (
                                                e.target.closest(".menu-button") ||
                                                e.target.closest(".dropdown-menu")
                                            )
                                                return;
                                            const {...serializableAd} = property;
                                            navigate(`/ads/editad/${property.propertyId}`, {
                                                state: {editingAd: serializableAd},
                                            });
                                        }}
                                        style={{cursor: "pointer"}}
                                    >
                                        <td>
                                            <img
                                                loading="lazy"
                                                src={getImageUrl(property.imagesDTOs)}
                                                alt={property.propertyId}
                                                className="ad-image"
                                            />
                                        </td>
                                        <td className="title-cell">{property.title}</td>
                                        <td className="category-cell">
                                            {property.categoriesDTOs?.map((category, index) => (
                                                <div key={index} className="category-image-item">
                                                    {category.imageDTO?.url && (
                                                        <img
                                                            width={24}
                                                            height={24}
                                                            loading="lazy"
                                                            src={category.imageDTO?.url}
                                                            alt={`${category.categoryId}`}
                                                            className="category-image"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {property.cost} {property.longTermRent ? "в месяц" : "за сутки"}
                                        </td>
                                        <td>{property.address}</td>
                                        <td>{property.ownerDTO.email}</td>
                                        <td className="actions-cell">
                                            <div className="dropdown">
                                                <button className="menu-button"
                                                        onClick={() => toggleMenu(property.propertyId)}>
                                                    ⋯
                                                </button>
                                                {openMenuId === property.propertyId && (
                                                    <div className="dropdown-menu">
                                                        <button
                                                            onClick={() => {
                                                                const {...serializableAd} = property;
                                                                navigate(`/ads/editad/${property.propertyId}`, {
                                                                    state: {editingAd: serializableAd},
                                                                });
                                                            }}
                                                        >
                                                            Редактировать
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                void handleDelete(property.propertyId);
                                                            }}
                                                        >
                                                            Удалить
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-properties">Нет объявлений, соответствующих запросу.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        {totalPages > 0 && (
                            <div className="pagination-container">
                                <div className="page-info">Страница {currentPage}</div>
                                <div className="pagination-svg-wrapper">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="86"
                                        height="32"
                                        viewBox="0 0 86 32"
                                        fill="none"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const clickX = e.clientX - rect.left;
                                            if (clickX < 43 && currentPage > 1) {
                                            setCurrentPage((prev) => prev - 1);
                                            } else if (clickX >= 43 && currentPage < totalPages) {
                                            setCurrentPage((prev) => prev + 1);
                                            }
                                        }}
                                        style={{ cursor: (currentPage > 1 || currentPage < totalPages) ? "pointer" : "default" }}
                                        >
                                        <rect x="0.3" y="1.3" width="85.4" height="29.4" rx="7.7" fill="white" stroke="#C1C1C1" strokeWidth="0.6" />

                                        
                                        <path
                                            d="M25.41 20.4064L20.83 16L25.41 11.5936L24 10.24L18 16L24 21.76L25.41 20.4064Z"
                                            fill={currentPage > 1 ? "#151515" : "#C1C1C1"}
                                            opacity={currentPage > 1 ? "1" : "0.3"}
                                        />

                                        
                                        <path
                                            d="M61.59 20.4064L66.17 16L61.59 11.5936L63 10.24L69 16L63 21.76L61.59 20.4064Z"
                                            fill={currentPage < totalPages ? "#151515" : "#C1C1C1"}
                                            opacity={currentPage < totalPages ? "1" : "0.3"}
                                        />

                                        <path opacity="0.7" d="M43.5 31V1" stroke="#C1C1C1" strokeWidth="0.4" strokeLinecap="square" />
                                        </svg>

                                </div>
                            </div>
                        )}
                    </>
                ) :
                <EditAdForm
                    editingAd={editingAdFromState || editingProperty}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingProperty(null);
                        navigate("/ads");
                    }}
                />
            }
        </div>
    );
};

export default AdsList;