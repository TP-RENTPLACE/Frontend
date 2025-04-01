import { NavLink, useNavigate } from "react-router-dom";
import { FaClock, FaUsers, FaCalendarCheck, FaCog, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import "../styles/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); // Удаляем флаг авторизации
    navigate("/"); // Перенаправляем на страницу авторизации
  };

  return (
    <div className="sidebar">
      <div className="logo">rentplace</div>
      <nav>
        <NavLink to="/ads" className="menu-item">
          <FaClipboardList /> <span>Объявления</span>
        </NavLink>
        <NavLink to="/moderation" className="menu-item">
          <FaClock /> <span>Модерация</span>
        </NavLink>
        <NavLink to="/users" className="menu-item">
          <FaUsers /> <span>Пользователи</span>
        </NavLink>
        <NavLink to="/bookings" className="menu-item">
          <FaCalendarCheck /> <span>Брони</span>
        </NavLink>
        <NavLink to="/settings" className="menu-item">
          <FaCog /> <span>Настройки</span>
        </NavLink>
        
        {/* Кнопка выхода */}
        <button onClick={handleLogout} className="menu-item logout">
          <FaSignOutAlt /> <span>Выход</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
