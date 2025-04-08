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
      categoryIcon: [< FaSwimmingPool/>,< FaBuilding/>,<LuMountainSnow/>],
      price: "18000 ₽",
      address: "Мистолово, Английский проезд, 3/1",
      image: "/images/ad-image.jpg",
      owner: "petr_petrov@gmail.com",
    },
    {
      id: 2,
      title: "Лесное озеро",
      category: "Квартира",
      categoryIcon: [< FaSwimmingPool/>,< FaBuilding/>,<LuMountainSnow/>],
      price: "15000 ₽",
      address: "Деревня Протасово, ул. Лесная, 5",
      image: "/images/ad-image.jpg",
      owner: "irina_sidorova@gmail.com",
    },
    {
      id: 3,
      title: "Солнечная долина",
      category: "Отель",
      categoryIcon: [< FaSwimmingPool/>,< FaBuilding/>,<LuMountainSnow/>],
      price: "22000 ₽",
      address: "Вилкова, Солнечный проезд, 7/2",
      image: "/images/ad-image.jpg",
      owner: "maksim_ivanov@gmail.com",
    },
    
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

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
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
                <th>Фото</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Адрес</th>
                <th>Хозяин</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.length > 0 ? (
                filteredAds.map((ad) => (
                  <tr key={ad.id}>
                    <td>
                    <img src={ad.image || (ad.images && ad.images[0]) || "/images/ad-image.jpg"} alt={ad.title} className="ad-image" />

                    </td>
                    <td>{ad.title}</td>
                    <td className="category-cell">
                      {ad.categoryIcon}
                      
                    </td>
                    <td>{ad.price}</td>
                    <td>{ad.address}</td>
                    <td>{ad.owner}</td>
                    <td className="actions-cell">
                      <div className="dropdown">
                      <button className="menu-button" onClick={() => toggleMenu(ad.id)}>⋯</button>

                        {openMenuId === ad.id && (
                          <div className="dropdown-menu">
                            <button onClick={() => { setEditingAd(ad); setShowForm(true); }}>Редактировать</button>
                            <button onClick={() => setAdsData((prev) => prev.filter((a) => a.id !== ad.id))}>Удалить</button>
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
        </>
      ) : (
        <AddAdForm addNewAd={addNewAd} editingAd={editingAd} onCancel={() => { setShowForm(false); setEditingAd(null); }} />
      )}
    </div>
  );
};

export default AdsList;
