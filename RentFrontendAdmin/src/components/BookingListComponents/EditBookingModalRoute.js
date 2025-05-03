import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import EditBookingModal from "./EditBookingModal";

const EditBookingModalRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const reservation = location.state?.reservation;

  if (!reservation) {
    return <div>Бронь не найдена или не передана через state</div>;
  }

  const handleSave = (updateReservation) => {
    console.log("Обновлённая бронь:", updateReservation);
    navigate("/bookings");
  };

  return (
    <div className="bookings-container">
        <EditBookingModal
        reservation={reservation}
        onSave={handleSave}
        onCancel={() => navigate("/bookings")}
        />
    </div>
  );
};

export default EditBookingModalRoute;