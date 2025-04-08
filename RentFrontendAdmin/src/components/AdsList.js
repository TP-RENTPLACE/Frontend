import React, { useState } from "react";
import AddAdForm from "./AddAdForm";
import Header from "./Header";
import "../styles/AdsList.css";
import { FaHome, FaBuilding, FaHotel } from "react-icons/fa";
import { FaSwimmingPool } from "react-icons/fa";
import { LuMountainSnow } from "react-icons/lu";

const AdsList = () => {
  const [adsData, setAdsData] = useState([
    {
      id: 1,
      title: "Таунаус Hillside",
      category: "Дом",
      categoryIcon: [<FaSwimmingPool />, <FaBuilding />, <LuMountainSnow />],
      price: "18000 ₽",
      rentType: "daily",
      address: "Мистолово, Английский проезд, 3/1",
      image: "/images/ad-image.jpg",
      owner: "petr_petrov@gmail.com",
    },
    {
      id: 2,
      title: "Лесное озеро",
      category: "Квартира",
      categoryIcon: [<FaSwimmingPool />, <FaBuilding />, <LuMountainSnow />],
      price: "15000 ₽",
      rentType: "monthly",
      address: "Деревня Протасово, ул. Лесная, 5",
      image: "/images/ad-image.jpg",
      owner: "irina_sidorova@gmail.com",
    },
    {
      id: 3,
      title: "Солнечная долина",
      category: "Отель",
      categoryIcon: [<FaSwimmingPool />, <FaBuilding />, <LuMountainSnow />],
      price: "22000 ₽",
      rentType: "daily",
      address: "Вилкова, Солнечный проезд, 7/2",
      image: "/images/ad-image.jpg",
      owner: "maksim_ivanov@gmail.com",
    },
    {
      id: 4,
      title: "Таунаус Hillside",
      category: "Дом",
      categoryIcon: [<FaSwimmingPool />, <FaBuilding />, <LuMountainSnow />],
      price: "18000 ₽",
      rentType: "daily",
      address: "Мистолово, Английский проезд, 3/1",
      image: "/images/ad-image.jpg",
      owner: "petr_petrov@gmail.com",
    },
    {
      id: 5,
      title: "Таунаус Hillside",
      category: "Дом",
      categoryIcon: [<FaSwimmingPool />, <FaBuilding />, <LuMountainSnow />],
      price: "18000 ₽",
      rentType: "daily",
      address: "Мистолово, Английский проезд, 3/1",
      image: "/images/ad-image.jpg",
      owner: "petr_petrov@gmail.com",
    },
    {
      id: 6,
      title: "Таунаус Hillside",
      category: "Дом",
      categoryIcon: [<FaSwimmingPool />, <FaBuilding />, <LuMountainSnow />],
      price: "18000 ₽",
      rentType: "daily",
      address: "Мистолово, Английский проезд, 3/1",
      image: "/images/ad-image.jpg",
      owner: "petr_petrov@gmail.com",
    },
    {
      id: 7,
      title: "Таунаус Hillside",
      category: "Дом",
      categoryIcon: [<FaSwimmingPool />, <FaBuilding />, <LuMountainSnow />],
      price: "18000 ₽",
      rentType: "daily",
      address: "Мистолово, Английский проезд, 3/1",
      image: "Frontend/RentFrontendAdmin/src/assets/image1.png",
      owner: "petr_petrov@gmail.com",
    },
    {
      id: 8,
      title: "Таунаус Hillside",
      category: "Дом",
      categoryIcon: [<FaSwimmingPool />, <FaBuilding />, <LuMountainSnow />],
      price: "181000 ₽",
      rentType: "daily",
      address: "Мистолово, Английский проезд, 3/1",
      image: "/images/ad-image.jpg",
      owner: "petr_petrov@gmail.com",
    },
    // Добавь больше объявлений для проверки пагинации
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const adsPerPage = 7;

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const addNewAd = (newAd) => {
    setAdsData((prevAds) =>
      prevAds.some((ad) => ad.id === newAd.id)
        ? prevAds.map((ad) => (ad.id === newAd.id ? newAd : ad))
        : [...prevAds, newAd]
    );
    setShowForm(false);
    setEditingAd(null);
    setCurrentPage(1); // сбрасываем на первую страницу
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // сбрасываем на первую страницу
  };

  const filteredAds = adsData.filter((ad) => {
    const lowercasedQuery = searchQuery.toLowerCase().trim();
    return (
      ad.title.toLowerCase().includes(lowercasedQuery) ||
      ad.category.toLowerCase().includes(lowercasedQuery) ||
      ad.price.toLowerCase().includes(lowercasedQuery) ||
      ad.address.toLowerCase().includes(lowercasedQuery) ||
      ad.owner.toLowerCase().includes(lowercasedQuery)
    );
  });

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
            <h1>Объявления</h1>
            <button className="add-ad-button" onClick={() => setShowForm(true)}>
              Добавить объявление
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
              {currentAds.length > 0 ? (
                currentAds.map((ad) => (
                  <tr key={ad.id}>
                    <td>
                      <img
                        src={ad.image || (ad.images && ad.images[0]) || "/images/ad-image.jpg"}
                        alt={ad.title}
                        className="ad-image"
                      />
                    </td>
                    <td className="title-cell">{ad.title}</td>
                    <td className="category-cell">{ad.categoryIcon}</td>
                    <td>
                      {ad.price}{" "}
                      {ad.rentType === "monthly"
                        ? "в месяц"
                        : ad.rentType === "daily"
                        ? "за сутки"
                        : ""}
                    </td>
                    <td>{ad.address}</td>
                    <td>{ad.owner}</td>
                    <td className="actions-cell">
                      <div className="dropdown">
                        <button className="menu-button" onClick={() => toggleMenu(ad.id)}>
                          ⋯
                        </button>
                        {openMenuId === ad.id && (
                          <div className="dropdown-menu">
                            <button
                              onClick={() => {
                                setEditingAd(ad);
                                setShowForm(true);
                              }}
                            >
                              Редактировать
                            </button>
                            <button
                              onClick={() =>
                                setAdsData((prev) => prev.filter((a) => a.id !== ad.id))
                              }
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
                  <td colSpan="7">Нет объявлений, соответствующих запросу.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Пагинация */}
          {totalPages > 1 && (
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
                    setCurrentPage((prev) => prev - 1); // Левая стрелка
                  } else if (clickX >= 43 && currentPage < totalPages) {
                    setCurrentPage((prev) => prev + 1); // Правая стрелка
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <rect x="0.3" y="1.3" width="85.4" height="29.4" rx="7.7" fill="white" stroke="#C1C1C1" strokeWidth="0.6"/>
                <g opacity="0.6">
                  <path d="M25.41 20.4064L20.83 16L25.41 11.5936L24 10.24L18 16L24 21.76L25.41 20.4064Z" fill="#151515"/>
                </g>
                <g opacity="0.9">
                  <path d="M61.59 20.4064L66.17 16L61.59 11.5936L63 10.24L69 16L63 21.76L61.59 20.4064Z" fill="#151515"/>
                </g>
                <path opacity="0.7" d="M43.5 31V1" stroke="#C1C1C1" strokeWidth="0.4" strokeLinecap="square"/>
              </svg>
            </div>
          </div>
          
          )}
        </>
      ) : (
        <AddAdForm
          addNewAd={addNewAd}
          editingAd={editingAd}
          onCancel={() => {
            setShowForm(false);
            setEditingAd(null);
          }}
        />
      )}
    </div>
  );
};

export default AdsList;
