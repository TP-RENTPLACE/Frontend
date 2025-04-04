import { NavLink, useNavigate } from "react-router-dom";
import { FaClock, FaUsers, FaCalendarCheck, FaCog, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import { LuNewspaper } from "react-icons/lu";
import { GoClock } from "react-icons/go";
import { LuCircleUserRound } from "react-icons/lu";
import { CiCalendarDate } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
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
          <LuNewspaper /> <span>Объявления</span>
        </NavLink>
        <NavLink to="/moderation" className="menu-item">
          <GoClock /> <span>Модерация</span>
        </NavLink>
        <NavLink to="/users" className="menu-item">
          <LuCircleUserRound  /> <span>Пользователи</span>
        </NavLink>
        <NavLink to="/bookings" className="menu-item">
          <CiCalendarDate /> <span>Брони</span>
        </NavLink>
        <NavLink to="/settings" className="menu-item">
          <CiSettings /> <span>Настройки</span>
        </NavLink>
        
        {/* Кнопка выхода */}
        <button onClick={handleLogout} className="menu-item logout">
          <RxExit /> <span>Выход</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
