import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../styles/galleryView.css";

const GalleryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { images } = location.state || {};

  if (!images) {
    return <h2>Фотографии не найдены</h2>;
  }

  return (
    <div className="gallery-page">
      <div className="image-row">
        {images.map((img, index) => (
          <img key={index} src={img.url} alt={`Фото ${index + 1}`} className="gallery-image" />
        ))}
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        Назад
      </button>
    </div>
  );
};

export default GalleryView;