import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddAdForm from "./AddAdForm";
import SearchBar from "./SearchBar";
import '../styles/moderationList.css'; 

const ModerationList = () => {
  const navigate = useNavigate();
  const [adsData, setAdsData] = useState([
    {
      id: 1,
      title: "Таунаус Hillside",
      price: "18000 ₽",
      address: "Мистолово, Английский проезд, 3/1",
      image: "/images/ad-image.jpg",
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleApprove = (id) => {
    console.log(`Объявление ${id} подтверждено`);
  };

  const handleReject = (id) => {
    setAdsData((prevAds) => prevAds.filter((ad) => ad.id !== id));
  };

  const filteredAds = adsData.filter((ad) =>
    ad.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ads-list">
      {!showForm ? (
        <>
          <div className="header">
            <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
            <div className="ads-list-header">
              <h1>Модерация объявлений</h1>
            </div>
          </div>

          <table className="ads-table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>Название объявления</th>
                <th>Цена за сутки</th>
                <th>Адрес</th>
                <th>Хозяин жилья</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.length > 0 ? (
                filteredAds.map((ad) => (
                  <tr 
                    key={ad.id} 
                    className="clickable-row" 
                    onClick={() => navigate(`/ad/${ad.id}`)}
                  >
                    <td>
                      <img src={ad.image} alt={ad.title} className="ad-image" />
                    </td>
                    <td>{ad.title}</td>
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
                  <td colSpan="6">Нет объявлений, соответствующих запросу.</td>
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
