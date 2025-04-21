import React, { useState, useEffect } from "react";
import "../../styles/bookings.css";
import BookingModal from "./BookingModal";
import Header from "../HeaderComponents/Header";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Plus } from "../../assets/Plus.svg";

const bookingsData = [
  {
    id: 1,
    listing: "Парадная квартира рядом с метро Чернышевская",
    tenant: "ivan.petrov1990@yandex.ru",
    landlord: "maria.smirnova@gmail.com",
    checkIn: "2025-03-17",
    checkOut: "2025-03-24",
    price: "88 000 ₽",
  },
  {
    id: 2,
    listing: "Парадная квартира рядом с метро Чернышевская",
    tenant: "ivan.petrov1990@yandex.ru",
    landlord: "maria.smirnova@gmail.com",
    checkIn: "2025-03-17",
    checkOut: "2025-03-24",
    price: "88 000 ₽",
  },
  // Добавь больше бронирований по необходимости
];

const BookingsTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookings, setBookings] = useState(bookingsData);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 7;
  const navigate = useNavigate();

  const handleSave = (newBooking) => {
    setBookings((prev) => {
      const exists = prev.some((b) => b.id === newBooking.id);
      return exists
        ? prev.map((b) => (b.id === newBooking.id ? newBooking : b))
        : [...prev, newBooking];
    });
    setIsAdding(false);
    setEditingBooking(null);
    setCurrentPage(1);
  };

  const handleEdit = (booking) => {
    navigate(`/bookings/edit/${booking.id}`, { state: { booking } });
  };
  

  const handleDelete = (id) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredBookings = bookings.filter((booking) =>
    `${booking.id} ${booking.listing} ${booking.tenant} ${booking.landlord}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  return (
    <div className="bookings-container">
      <Header
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />

      {!isAdding && !editingBooking && (
        <div className="bookings-header">
          <h2>Брони</h2>
          <button className="add-booking-btn" onClick={() => navigate("/bookings/add")}>
            Добавить бронь
            <Plus/>
          </button>
        </div>
      )}

      {!isAdding && !editingBooking && (
        <>
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Объявление</th>
                <th>Арендатор</th>
                <th>Арендодатель</th>
                <th>Дата проживания</th>
                <th>Стоимость</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length > 0 ? (
                currentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="clickable-row"
                    onClick={() => navigate(`/bookings/edit/${booking.id}`, { state: { booking } })}
                  >

                    <td className="id-column">{booking.id}</td>
                    <td>{booking.listing}</td>
                    <td>{booking.tenant}</td>
                    <td>{booking.landlord}</td>
                    <td>
                      {booking.checkIn} <br /> {booking.checkOut}
                    </td>
                    <td>{booking.price}</td>
                    <td className="dropdown">
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(booking.id);
                        }}
                      >
                          ⋯
                      </button>
                      {menuOpen === booking.id && (
                        <div className="dropdown-content">
                          <button className="action-item" onClick={() => handleEdit(booking)}>
                            Редактировать
                          </button>
                          <button className="action-item" onClick={() => handleDelete(booking.id)}>
                            Удалить
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Брони не найдены</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Пагинация */}
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
      )}

      {(isAdding || editingBooking) && (
        <BookingModal
          onCancel={() => {
            setIsAdding(false);
            setEditingBooking(null);
          }}
          booking={editingBooking}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default BookingsTable;
