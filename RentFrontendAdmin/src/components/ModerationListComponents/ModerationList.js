import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSwimmingPool, FaBuilding } from "react-icons/fa";
import { LuMountainSnow } from "react-icons/lu";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import AddAdForm from "../AdsListComponents/AddAdForm";
import Header from "../HeaderComponents/Header";
import "../../styles/moderationList.css";


const ModerationList = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const adsPerPage = 7;

  useEffect(() => {
    PropertyService.getAll()
        .then((data) => {
          const moderatedProperties = data.filter(
              property => property.propertyStatus === "ON_MODERATION"
          );
          setProperties(moderatedProperties);
        })
        .catch((err) => console.error('Ошибка при загрузке:', err));
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingProperty(null);
    navigate("/moderation");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleApprove = (id) => {
    console.log(`Объявление ${id} подтверждено`);
    navigate("/moderation");
  };

  const handleReject = (id) => {
    setProperties((prevAds) => prevAds.filter((ad) => ad.id !== id));
    navigate("/moderation");
  };

  const filteredAds = properties.filter((ad) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      (ad.title && ad.title.toLowerCase().includes(q)) ||
      (ad.category && ad.category.toLowerCase().includes(q)) ||
      (ad.сost && ad.price.toLowerCase().includes(q)) ||
      (ad.address && ad.address.toLowerCase().includes(q)) ||
      (ad.owner && ad.owner.toLowerCase().includes(q))
    );
  });

  const getImageUrl = (images = []) => {
    const previewImg = images.find((img) => img.previewImage === false && img.imageId === 2);
    const chosenImg = previewImg || images[0];
    if (!chosenImg) {
      return "/assets/image.png";
    }
    if (chosenImg.url) {
      return chosenImg.url;
    }
  };

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);
  const totalPages = Math.ceil(filteredAds.length / adsPerPage);

  return (
    <div className="ads-list">
      <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />

      {!showForm ? (
        <>
          <div className="ads-list-header">
            <h1>Модерация объявлений</h1>
          </div><table className="ads-table">
            <thead>
              <tr>
                <th>Фотография</th>
                <th>Название объявления</th>
                <th>Категории</th>
                <th>Цена</th>
                <th>Адрес</th>
                <th>Хозяин жилья</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {properties.length > 0 ? (
                properties.map((property) => (
                  <tr
                      key={property.propertyId}
                      className="ad-row"
                      onClick={(e) => {
                        if (
                            e.target.closest(".menu-button") ||
                            e.target.closest(".dropdown-menu")
                        )
                          return;
                        navigate(`/ad/${property.propertyId}`, {
                          state: { editingProperty: property },
                        });
                      }}
                      style={{ cursor: "pointer" }}
                  >
                    <td>
                      <img
                          src={getImageUrl(property.imagesDTOs)}
                          alt={property.title}
                          className="ad-image"
                      />
                    </td>
                    <td className="ad-title-cell">{property.title}</td>
                    <td className="category-cell">
                      {property.categoriesDTOs?.map((category, index) => (
                          <div key={index} className="category-image-item">
                            {category.imageDTO?.url && (
                                <img
                                    width={24}
                                    height={24}
                                    src={category.imageDTO.url}
                                    alt={`Категория ${category.name}`}
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
                    <td>
                      <button
                        className="approve-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(property.id);
                        }}
                      >
                        <IoCheckmarkSharp />
                      </button>
                      <button
                        className="reject-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(property.id);
                        }}
                      >
                        <IoClose />
                      </button>
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
              <div className="page-info">Страница {currentPage}</div><div className="pagination-svg-wrapper">
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
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x="0.3"
                    y="1.3"
                    width="85.4"
                    height="29.4"
                    rx="7.7"
                    fill="white"
                    stroke="#C1C1C1"
                    strokeWidth="0.6"
                  />
                  <g opacity="0.6">
                    <path
                      d="M25.41 20.4064L20.83 16L25.41 11.5936L24 10.24L18 16L24 21.76L25.41 20.4064Z"
                      fill="#151515"
                    />
                  </g>
                  <g opacity="0.9">
                    <path
                      d="M61.59 20.4064L66.17 16L61.59 11.5936L63 10.24L69 16L63 21.76L61.59 20.4064Z"
                      fill="#151515"
                    />
                  </g>
                  <path
                    opacity="0.7"
                    d="M43.5 31V1"
                    stroke="#C1C1C1"
                    strokeWidth="0.4"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
            </div>
          )}
        </>
      ) : (
        <AdDetails editingProperty={editingProperty} onCancel={toggleForm} />
      )}
    </div>
  );
};

export default ModerationList;