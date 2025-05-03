import React, {useEffect, useState} from "react";
import "../../styles/adform.css";
import { ReactComponent as Ruble } from "../../assets/Ruble.svg";
import Header from "../HeaderComponents/Header";
import { ReactComponent as Image } from "../../assets/Camera.svg";
import { ReactComponent as Trash} from "../../assets/Trash.svg";
import {useNavigate} from "react-router-dom";
import ImageService from "../../api/imageService";
import propertyService from "../../api/propertyService";
import PropertyService from "../../api/propertyService";

const EditAdForm = ({ editingAd, onCancel }) => {
  const navigate = useNavigate();
  const [propertyStatuses] = useState([
    "PUBLISHED",
    "ON_MODERATION",
    "REJECTED",
    "NOT_PUBLISHED"
  ]);

  const [formData, setFormData] = useState({
    propertyStatus: "ON_MODERATION",
    title: "",
    address: "",
    description: "",
    longTermRent: false,
    cost: 0,
    area: 0,
    rooms: 0,
    bedrooms: 0,
    sleepingPlaces: 0,
    bathrooms: 0,
    maxGuests: 0,
    ownerId: "",
    categoriesIds: [],
    facilitiesIds: []
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newFilesPreviews, setNewFilesPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [owners, setOwners] = useState([]);
  const [ownerEmail, setOwnerEmail] = useState("");


  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/');
      return;
    }
    const loadInitialData = async () => {
      try {
        const [cats, facs, ownersRes] = await Promise.all([
          categoryService.getAll(),
          facilityService.getAll(),
          userService.getAll()
        ]);

        setCategories(cats);
        setFacilities(facs);
        setOwners(ownersRes);

        if (editingAd) {
          setFormData({
            ...editingAd,
            categoriesIds: editingAd.categoriesDTOs.map(c => c.categoryId),
            facilitiesIds: editingAd.facilitiesDTOs.map(f => f.facilityId),
            ownerId: editingAd.ownerDTO.userId
          });
          setOwnerEmail(editingAd.ownerDTO.email);
          setExistingImages(editingAd.imagesDTOs);
        }
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
      }
    };
    loadInitialData();
  }, [editingAd]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked
          : type === "number" ? Number(value)
              : value
    }));
  };

  const handleOwnerChange = (e) => {
    const email = e.target.value;
    setOwnerEmail(email);
    const owner = owners.find(o => o.email === email);
    if (owner) {
      setFormData(prev => ({ ...prev, ownerId: owner.userId }));
    }
  };

  const handleMultiSelect = (e, field) => {
    const options = Array.from(e.target.selectedOptions, opt => Number(opt.value));
    setFormData(prev => ({ ...prev, [field]: options }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const removeExistingImage = async (imageId) => {
    try {
      await ImageService.delete(imageId);
      setExistingImages(prev => prev.filter(img => img.imageId !== imageId));
    } catch (err) {
      setError("Ошибка удаления изображения");
    }
  };

  const removeNewFile = (index) => {
    URL.revokeObjectURL(newFilesPreviews[index]);

    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewFilesPreviews(prev => prev.filter((_, i) => i !== index));
  };const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setNewFiles(prev => [...prev, ...files]);
    setNewFilesPreviews(prev => [...prev, ...newPreviews]);
    e.target.value = null;
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить объявление?");
    if (!confirmDelete) return;

    setLoading(true);
    setError("");

    console.log(editingAd.propertyId)
    try {
      await propertyService.delete(editingAd.propertyId);
      onCancel();
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка удаления объявления");
      console.error("Ошибка удаления:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (existingImages.length + newFiles.length === 0) {
        throw new Error("Необходимо добавить хотя бы одну фотографию");
      }

      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => formDataToSend.append(key, v.toString()));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      await PropertyService.update(editingAd.propertyId, formDataToSend);

      if (newFiles.length > 0) {
        const formDataImages = new FormData();
        newFiles.forEach(file => {
          formDataImages.append("files", file, file.name);
        });

        await PropertyService.addImages(
            editingAd.propertyId,
            formDataImages
        );
      }

      navigate("/ads", { state: { refresh: true }, replace: true });
    } catch (err) {
      setError(err.message || "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const formatSelectedValues = (ids, data) => {
    return data
        .filter(item => ids.includes(item.categoryId || item.facilityId))
        .map(item => item.name)
        .join(", ");
  }

  return (
    <div className="add-ad-container">
      <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <form className="add-ad-form">
        <h2 className="form-title">Изменить объявление</h2>

            <div className="field-group">
              <label className="ccolumn-name">Изображения</label>
              <div className="image-preview-container">
                {existingImages.map((image) => (
                  <div key={image.imageId} className="image-preview">
                    <img src={image.url} alt={`Preview ${image.url}`} />
                    <button
                        className="delete-image-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingImage(image.imageId);
                        }}
                        type="button">
                      <Trash/>
                    </button>
                  </div>
                ))}

                {newFilesPreviews.map((preview, index) => (
                    <div key={`new-${preview}`} className="image-preview">
                      <img src={preview} alt={`Новое фото ${index + 1}`} />
                      <button
                          className="delete-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNewFile(index);
                          }}
                          type="button"
                      >
                        <Trash/>
                      </button>
                    </div>
                ))}<label htmlFor="file-input" className="image-upload-button">
                <div className="upload-content">
                  <span>Добавить фото</span>
                  <Image className="upload-icon" />
                </div>
              </label>
              <input id="file-input" type="file" accept="image/*" multiple onChange={handleFileChange} />
            </div>
          </div>

      <div className="field">
        <label className="ccolumn-name">Название</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="field">
        <label className="ccolumn-name">Адрес</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </div>

      <div className="fields-container">
        <div className="fields-row">
          <div className="field">
            <label className="ccolumn-name">Общая площадь (м²)</label>
            <input type="number" name="area" value={formData.area} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="ccolumn-name">Количество гостей</label>
            <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="ccolumn-name">Количество комнат</label>
            <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} required />
          </div>
        </div><div className="fields-row">
            <div className="field">
              <label className="ccolumn-name">Количество спален</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
            </div>
            <div className="field">
              <label className="ccolumn-name">Количество кроватей</label>
              <input type="number" name="sleepingPlaces" value={formData.sleepingPlaces} onChange={handleChange} required />
            </div>
            <div className="field">
              <label className="ccolumn-name">Хозяин жилья (email)</label>
              <select
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleChange}
              >
                {owners.map((owner) => (
                    <option key={owner.userId} value={owner.userId}>
                      {owner.email}
                    </option>
                ))}
              </select>
            </div>
          </div>
          <div className="fields-row">
            <div className="field">
              <label className="ccolumn-name">Категории</label>
              <select
                  multiple
                  name="categoriesIds"
                  value={formData.categoriesIds}
                  onChange={(e) => handleMultiSelect(e, 'categoriesIds')}
                  className="multi-select"
              >
                <option>{formatSelectedValues(formData.categoriesIds, categories) || "Выберите категории..."}</option>
                {categories.map(category => (
                    <option
                        key={category.categoryId}
                        value={category.categoryId}
                    >
                      {category.name}
                    </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="ccolumn-name">Удобства</label>
              <select
                  multiple
                  name="facilitiesIds"
                  value={formData.facilitiesIds}
                  onChange={(e) => handleMultiSelect(e, 'facilitiesIds')}
                  className="multi-select"
              >
                <option>{formatSelectedValues(formData.facilitiesIds, facilities) || "Выберите удобства..."}</option>
                {facilities.map(facility => (
                    <option
                        key={facility.facilityId}
                        value={facility.facilityId}
                    >
                      {facility.name}
                    </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="ccolumn-name">Статус</label>
              <select
                  name="propertyStatus"
                  value={formData.propertyStatus}
                  onChange={handleChange}
              >
                {propertyStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="ccolumn-name" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            Арендная плата,
            <Ruble style={{ width: "18px", height: "18px", fill: "black" }} />
          </label>

          <div className="rent-options">
            <button type="button" className={`${!formData.longTermRent ? "active" : ""}`} onClick={() => setFormData(p => ({...p, longTermRent: false}))}>
              За сутки
            </button>
            <button type="button" className={`${formData.longTermRent ? "active" : ""}`} onClick={() => setFormData(p => ({...p, longTermRent: true}))}>
              В месяц
            </button>
          </div>
          <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />
        </div><div className="fields-container">
            <div className="fields-row">
              <div className="field description-field">
                  <label className="column-name">Описание</label>
                  <textarea className="custom-textarea" name="description" value={formData.description} onChange={handleChange} required />
              </div>
                <div className="field"></div>
                <div className="field"></div>
            </div>
        </div>

        <div className="button-group">
          <button type="button" className="cancel-button" onClick={handleDelete}>
            Удалить
          </button>
          <button type="submit" className="submit-button" onClick={handleSubmit}>
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdForm;