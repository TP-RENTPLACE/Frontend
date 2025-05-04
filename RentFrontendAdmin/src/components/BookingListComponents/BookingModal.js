import React, {useEffect, useState} from "react";
import "../../styles/bookingModal.css";
import Header from "../HeaderComponents/Header";
import { ReactComponent as Ruble } from "../../assets/Ruble.svg";
import PropertyService from "../../api/propertyService";
import UserService from "../../api/userService";
import ReservationService from "../../api/reservationService";

const BookingModal = ({ onCancel, reservation, onSave }) => {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredRenters, setFilteredRenters] = useState([]);

  const [formData, setFormData] = useState({
    propertyId: "",
    renterId: "",
    ownerEmail: "",
    startDate: "",
    endDate: "",
    costInPeriod: 0,
    longTermRent: false
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesData, usersData] = await Promise.all([
          PropertyService.getAll(),
          UserService.getAll()
        ]);
        setProperties(propertiesData);
        setUsers(usersData);
        setFilteredRenters(usersData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };
    fetchData();
  }, []);

    useEffect(() => {
        if (formData.propertyId) {
            const selectedProperty = properties.find(
                p => p.propertyId === parseInt(formData.propertyId)
            );
            if (selectedProperty) {
                setFormData(prev => ({
                    ...prev,
                    ownerEmail: selectedProperty.ownerDTO?.email || ""
                }));
            }
        }
    }, [formData.propertyId, properties, users]);

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

      const response = await ReservationService.create(formDataToSend);

      onSave(response);
    } catch (error) {
      console.error("Ошибка обновления брони:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  return (
    <div className="modal-overlay">
      <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <div className="modal booking-modal-wrapper">
        <form className="add-user-form" onSubmit={handleSubmit}>
          <h2>Добавить бронь</h2><div className="fields-row">
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
              <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
              />
            </div>
            <div>
              <label className="column-name">Дата окончания проживания</label>
              <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
              />
            </div>

          </div>
              <div className="footer-buttonss">
                <button type="button" className="cancell-button" onClick={onCancel}>Отмена</button>
                <button type="submit" className="submitt-button">Добавить</button>
              </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;