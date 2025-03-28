import Sidebar from "./Sidebar";
import AdsList from "./AdsList";


const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <Sidebar />
      <div className="main-content">
        <h1>Объявления</h1>
        <AdsList />
      </div>
    </div>
  );
};

export default AdminPanel;
