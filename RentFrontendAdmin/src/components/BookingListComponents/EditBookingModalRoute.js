import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import EditBookingModal from "./EditBookingModal";

const EditBookingModalRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const booking = location.state?.booking;

  if (!booking) {
    return <div>Бронь не найдена или не передана через state</div>;
  }

  const handleSave = (updatedBooking) => {
    console.log("Обновлённая бронь:", updatedBooking);
    navigate("/bookings");
  };

  return (
    <div className="bookings-container">
        <EditBookingModal
        booking={booking}
        onSave={handleSave}
        onCancel={() => navigate("/bookings")}
        />
    </div>
  );
};

export default EditBookingModalRoute;
