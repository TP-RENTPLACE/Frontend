import React from "react";
import { useNavigate } from "react-router-dom";
import AddAdForm from "./AddAdForm";

const AddAdPage = () => {
  const navigate = useNavigate();

  const addNewAd = () => {
    navigate("/ads");
  };

  return (
    <div className="ads-list">
      <AddAdForm addNewAd={addNewAd} onCancel={() => navigate("/ads")} />
    </div>
  );
};

export default AddAdPage;