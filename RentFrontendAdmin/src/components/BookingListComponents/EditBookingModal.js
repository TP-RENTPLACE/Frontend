import React, {useEffect, useState} from "react";
import "../../styles/bookingModal.css";
import Header from "../HeaderComponents/Header";
import { ReactComponent as Ruble } from "../../assets/Ruble.svg";
import PropertyService from "../../api/propertyService";
import UserService from "../../api/userService";
import ReservationService from "../../api/reservationService";
import {toast} from "react-toastify";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

const VALIDATION_RULES = {
  MIN_BOOKING_DAYS: 1,
  MAX_BOOKING_MONTHS: 12,
};

const EditBookingModal = ({ onCancel, reservation, onSave }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => PropertyService.getAll(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => UserService.getAll(),
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    if (formData.propertyId) {
      const selectedProperty = properties.find(p => p.propertyId == formData.propertyId);
      if (selectedProperty) {
        setFormData(prev => ({
          ...prev,
          costInPeriod: selectedProperty.cost,
          longTermRent: selectedProperty.longTermRent,
          ownerEmail: selectedProperty.ownerDTO.email
        }));
      }
    }
  }, [formData.propertyId, properties]);

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.propertyId) errors.property = 'Выберите объявление';
    if (!formData.renterId) errors.renter = 'Выберите арендатора';
    if (!formData.startDate) errors.startDate = 'Укажите дату начала';
    if (!formData.endDate) errors.endDate = 'Укажите дату окончания';

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (startDate < today) errors.startDatePast = 'Дата начала не может быть в прошлом';

    if (endDate <= startDate) errors.datesOrder = 'Дата окончания должна быть позже начала';

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());

    if (formData.longTermRent) {
      if (diffMonths < 1) {
        errors.duration = 'Минимальный срок долгосрочной аренды - 1 месяц';
      }
      if (diffMonths > VALIDATION_RULES.MAX_BOOKING_MONTHS) {
        errors.duration = `Максимальный срок брони - ${VALIDATION_RULES.MAX_BOOKING_MONTHS} месяцев`;
      }
    }
    else {
      if (diffDays < VALIDATION_RULES.MIN_BOOKING_DAYS) {
        errors.duration = `Минимальная длительность брони - ${VALIDATION_RULES.MIN_BOOKING_DAYS} день`;
      }
    }

    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join('\n');
      toast.error(`Ошибки валидации:\n${errorMessage}`, {
        autoClose: 5000,
        style: { whiteSpace: 'pre-line' }
      });
      return false;
    }

    return true;
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => ReservationService.update(id, data),
    onSuccess: (data) => {
      toast.success("Бронь успешно обновлена");
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      onSave(data);
    },
    onError: (error) => {
      let errorMessage = 'Ошибка при обновлении брони';
      if (error.response) {
        if (error.response.data?.errors) {
          errorMessage = error.response.data.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      toast.error(errorMessage, {
        autoClose: 7000,
        style: { whiteSpace: 'pre-line' }
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => ReservationService.delete(id),
    onSuccess: () => {
      toast.success("Бронь успешно удалена");
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      onCancel();
    },
    onError: (error) => {
      let errorMessage = 'Ошибка при удалении брони';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("propertyId", formData.propertyId);
    data.append("renterId", formData.renterId);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("costInPeriod", formData.costInPeriod);
    data.append("longTermRent", formData.longTermRent);

    updateMutation.mutate({ id: reservation.reservationId, data });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить бронь?");
    if (!confirmDelete) return;
    deleteMutation.mutate(reservation.reservationId);
  };

  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay">
      <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <div className="modal">
        <form className="add-user-form" onSubmit={handleSubmit}>
          <h2>Изменить бронь</h2>

          <div className="fields-row">
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
                <button type="button" className={`${!formData.longTermRent ? "active" : ""}`}>
                  За сутки
                </button>
                <button type="button" className={`${formData.longTermRent ? "active" : ""}`}>
                  В месяц
                </button>
              </div>
              <input
                  type="number"
                  name="costInPeriod"
                  value={formData.costInPeriod}
                  onChange={handleChange}
                  readOnly
                  required/>
            </div>
            <div>
              <label className="column-name">Дата начала проживания</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={getCurrentDate()}
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
                min={formData.startDate || getCurrentDate()}
                required
              />
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