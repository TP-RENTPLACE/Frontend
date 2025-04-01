import React, { useState, useEffect } from "react";
import "../styles/bookings.css";
import BookingModal from "./BookingModal";
import Header from "./Header";

const bookingsData = [
  {
    id: 103,
    listing: "Парадная квартира рядом с метро Чернышевская",
    tenant: "ivan.petrov1990@yandex.ru",
    landlord: "maria.smirnova@gmail.com",
    checkIn: "2025-03-17",
    checkOut: "2025-03-24",
    price: "88 000 ₽",
  },
];

const BookingsTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookings, setBookings] = useState(bookingsData);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Функция для сохранения данных (добавление или редактирование)
  const handleSave = (newBooking) => {
    setBookings((prevBookings) => {
      const exists = prevBookings.some((b) => b.id === newBooking.id);
      return exists
        ? prevBookings.map((b) => (b.id === newBooking.id ? newBooking : b)) // Обновляем бронь
        : [...prevBookings, newBooking]; // Добавляем новую
    });

    setIsAdding(false);
    setEditingBooking(null);
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setIsAdding(true);
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

  // Фильтрация бронирований по поисковому запросу
  const filteredBookings = bookings.filter((booking) =>
    `${booking.id} ${booking.listing} ${booking.tenant} ${booking.landlord}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bookings-container">
      <Header
        searchQuery={searchQuery}
        handleSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {!isAdding && !editingBooking && (
        <div className="bookings-header">
          <h2>Брони</h2>
          <button className="add-booking-btn" onClick={() => setIsAdding(true)}>
            Добавить бронь +
          </button>
        </div>
      )}

      {!isAdding && !editingBooking && (
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
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
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
                      ⋮
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
      )}

      {!isAdding && !editingBooking && <div className="pagination">Страница 1</div>}

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
