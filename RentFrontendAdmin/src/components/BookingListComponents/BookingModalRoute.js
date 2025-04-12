import React from "react";
import { useNavigate } from "react-router-dom";
import BookingModal from "./BookingModal";

const BookingModalRoute = () => {
  const navigate = useNavigate();

  const handleSave = (newBooking) => {
    console.log("Сохраняем бронь:", newBooking);
    navigate("/bookings");
  };

  const handleCancel = () => {
    navigate("/bookings");
  };

  return (
    <div className="bookings-container">
        <BookingModal onCancel={handleCancel} onSave={handleSave} />
    </div>
  );
};

export default BookingModalRoute;
