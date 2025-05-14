import React, {useState, useEffect, useMemo} from "react";
import "../../styles/bookings.css";
import BookingModal from "./BookingModal";
import Header from "../HeaderComponents/Header";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Plus } from "../../assets/Plus.svg";
import ReservationService from "../../api/reservationService";
import {toast} from "react-toastify";
import {useQuery} from "@tanstack/react-query";

const BookingsTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;
  const navigate = useNavigate();

  const { data: reservations = [], isError, error } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => ReservationService.getAll(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка при загрузке: ' + error.message);
    }
  }, [isError, error]);

  const handleEdit = (reservation) => {
    console.log(reservation);
    navigate(`/bookings/edit/${reservation.reservationId}`, { state: { reservation } });
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

  const filteredBookings = useMemo(() => {
    return reservations.filter((reservation) => {
      const listingTitle = reservation.propertyDTO?.title?.toLowerCase() || '';
      const tenantEmail = reservation.renterDTO?.email?.toLowerCase() || '';
      const landlordEmail = reservation.propertyDTO?.ownerDTO?.email?.toLowerCase() || '';

      return (
          listingTitle.includes(searchQuery.toLowerCase()) ||
          tenantEmail.includes(searchQuery.toLowerCase()) ||
          landlordEmail.includes(searchQuery.toLowerCase())
      );
    });
  }, [reservations, searchQuery]);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentReservations = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);


  return (
    <div className="bookings-container">
      <Header
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />

      {!isAdding && !editingReservation && (
        <div className="bookings-header">
          <h2>Брони</h2>
          <button className="add-booking-btn" onClick={() => navigate("/bookings/add")}>
            Добавить бронь
            <Plus/>
          </button>
        </div>
      )}

      {!isAdding && !editingReservation && (
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
              {currentReservations.length > 0 ? (
                currentReservations.map((reservation) => (
                  <tr
                    key={reservation.reservationId}
                    className="clickable-row"
                    onClick={() => navigate(`/bookings/edit/${reservation.reservationId}`, { state: { reservation } })}
                  >
                    <td className="id-column">{reservation.reservationId}</td>
                    <td>{reservation.propertyDTO.title}</td>
                    <td>{reservation.renterDTO.email}</td>
                    <td>{reservation.propertyDTO.ownerDTO.email}</td>
                    <td className="dates-column">{reservation.startDate} <br /> {reservation.endDate}</td>
                    <td className="price-column">{reservation.totalCost}</td>
                    <td className="action-column dropdown">
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(reservation.reservationId);
                        }}
                      >
                        ⋯
                      </button>
                      {menuOpen === reservation.reservationId && (
                        <div className="dropdown-content">
                          <button className="action-item" onClick={() => handleEdit(reservation)}>
                            Редактировать
                          </button>
                          <button className="action-item" >
                            Удалить
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                  <tr>
                    <td colSpan="7" className="no-properties">На данный момент нет активных броней.</td>
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
    </div>
  );
};

export default BookingsTable;