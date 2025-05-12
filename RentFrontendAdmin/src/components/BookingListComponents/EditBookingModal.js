import React, {useEffect, useState} from "react";
import "../../styles/bookingModal.css";
import Header from "../HeaderComponents/Header";
import { ReactComponent as Ruble } from "../../assets/Ruble.svg";
import PropertyService from "../../api/propertyService";
import UserService from "../../api/userService";
import ReservationService from "../../api/reservationService";
import userService from "../../api/userService";
import reservationService from "../../api/reservationService";
import birthdayIcon from "../../assets/Birthday.svg";

const EditBookingModal = ({ onCancel, reservation, onSave }) => {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    propertyId: reservation?.propertyDTO?.propertyId || "",
    renterId: reservation?.renterDTO?.userId || "",
    ownerEmail: reservation?.propertyDTO.ownerDTO.email || "",
    startDate: reservation?.startDate?.split('T')[0] || "",
    endDate: reservation?.endDate?.split('T')[0] || "",
    costInPeriod: reservation?.totalCost || 0,
    longTermRent: reservation?.longTermRent || false
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesData, usersData] = await Promise.all([
          PropertyService.getAll(),
          UserService.getAll()
        ]);
        setProperties(propertiesData);
        setUsers(usersData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("propertyId", formData.propertyId);
      formDataToSend.append("renterId", formData.renterId);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("costInPeriod", formData.costInPeriod);
      formDataToSend.append("longTermRent", formData.longTermRent);

      const response = await ReservationService.update(
          reservation.reservationId,
          formDataToSend
      );


      onSave(response);
    } catch (error) {
      console.error("Ошибка обновления брони:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить бронь?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      await reservationService.delete(reservation.reservationId);
      onCancel();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <div className="modal">
        <form className="add-user-form" onSubmit={handleSubmit}>
          <h2>Изменить бронь</h2><div className="fields-row">
            <div>
              <label className="column-name">Объявление</label>
              <select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleChange}
                  required
              >
                <option value="">Выберите объявление</option>
                {properties.map(property => (
                    <option key={property.propertyId} value={property.propertyId}>
                      {property.title} (ID: {property.propertyId})
                    </option>
                ))}
              </select>
            </div>
            <div>
                <label className="column-name">Арендатор</label>
                <select
                    name="renterId"
                    value={formData.renterId}
                    onChange={handleChange}
                    required
                >
                  <option value="">Выберите арендатора</option>
                  {users.map(user => (
                      <option key={user.userId} value={user.userId}>
                        {user.email} ({user.name} {user.surname})
                      </option>
                  ))}
                </select>
            </div>
            <div>
              <label className="column-name">Арендодатель (Email):</label>
              <input type="email" name="ownerEmail" value={formData.ownerEmail} readOnly required />
            </div>
          </div>

          <div className="fields-row">
            <div className="rent-price">
              <label className="ccolumn-name" style={{display: "flex", alignItems: "center", gap: "6px"}}>
                Арендная плата,
                <Ruble style={{width: "18px", height: "18px", fill: "black"}}/>
              </label>

              <div className="rent-buttons">
                <button type="button" className={`${!formData.longTermRent ? "active" : ""}`}
                        onClick={() => setFormData(p => ({...p, longTermRent: false}))}>
                  За сутки
                </button>
                <button type="button" className={`${formData.longTermRent ? "active" : ""}`}
                        onClick={() => setFormData(p => ({...p, longTermRent: true}))}>
                  В месяц
                </button>
              </div>
              <input type="number" name="costInPeriod" value={formData.costInPeriod} onChange={handleChange} required/>
            </div>
            <div>
              <label className="column-name">Дата начала проживания</label>
              <div className="date-field-with-icon">
                <input
                  type="date"
                  id="startDateEditInput"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
                <img
                  src={birthdayIcon}
                  alt="calendar"
                  className="custom-calendar-icon"
                  onClick={() => document.getElementById("startDateEditInput")?.showPicker?.()}
                />
              </div>
            </div>

            <div>
              <label className="column-name">Дата окончания проживания</label>
              <div className="date-field-with-icon">
                <input
                  type="date"
                  id="endDateEditInput"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
                <img
                  src={birthdayIcon}
                  alt="calendar"
                  className="custom-calendar-icon"
                  onClick={() => document.getElementById("endDateEditInput")?.showPicker?.()}
                />
              </div>
            </div>

          </div>

          <div className="footer-buttonss">
            <button type="button" className="cancel-button" onClick={handleDelete}>
              Удалить
            </button>
            <button type="submit" className="submit-button" onClick={handleSubmit}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;