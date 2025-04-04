import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLandmark } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FaHome, FaBuilding, FaHotel } from "react-icons/fa";
import { FaSwimmingPool } from "react-icons/fa";
import { LuMountainSnow } from "react-icons/lu";

import AddAdForm from "./AddAdForm";
import Header from "./Header";
import '../styles/ModerationList.css';
import image1 from "../assets/image2.png";

const ModerationList = () => {
  const navigate = useNavigate();
  const [adsData, setAdsData] = useState([
    {
      id: 1,
      title: "Таунаус Hillside",
      category: "Вилла",
      categoryIcon:  [< FaSwimmingPool/>,< FaBuilding/>,<LuMountainSnow/>],
      price: "18000 ₽",
      address: "Мистолово, Английский проезд, 3/1",
      image: image1,
      owner: "petr_petrov@gmail.com",
    },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingAd(null);
  };

  const addNewAd = (newAd) => {
    if (editingAd) {
      setAdsData((prevAds) =>
        prevAds.map((ad) => (ad.id === editingAd.id ? newAd : ad))
      );
      setEditingAd(null);
    } else {
      setAdsData((prevAds) => [...prevAds, newAd]);
    }
    setShowForm(false);
  };
  const location = useLocation();

  useEffect(() => {
    if (location.state?.rejectedId) {
      handleReject(location.state.rejectedId);
    }
  }, [location.state]);


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleApprove = (id) => {
    console.log(`Объявление ${id} подтверждено`);
    navigate("/moderation");
  };

  const handleReject = (id) => {
    setAdsData((prevAds) => prevAds.filter((ad) => ad.id !== id));
    navigate("/moderation");
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
            <h1>Модерация объявлений</h1>
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
                  <tr 
                    key={ad.id} 
                    className="clickable-row" 
                    onClick={() => navigate(`/ad/${ad.id}`)} // Используем id для маршрутизации
                  >
                    <td>
                      <img src={ad.image} alt={ad.title} className="ad-image" />
                    </td>
                    <td>{ad.title}</td>
                    <td className="category-cell">
                      {ad.categoryIcon} <span>{ad.category}</span>
                    </td>
                    <td>{ad.price}</td>
                    <td>{ad.address}</td>
                    <td>{ad.owner}</td>
                    <td>
                      <button 
                        className="approve-button" 
                        onClick={(e) => { e.stopPropagation(); handleApprove(ad.id); }}
                      >✔</button>
                      <button 
                        className="reject-button" 
                        onClick={(e) => { e.stopPropagation(); handleReject(ad.id); }}
                      >✘</button>
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
        <AddAdForm addNewAd={addNewAd} editingAd={editingAd} onCancel={toggleForm} />
      )}
    </div>
  );
};

export default ModerationList;
