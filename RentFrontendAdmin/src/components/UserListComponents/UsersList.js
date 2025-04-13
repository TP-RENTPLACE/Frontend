import React, { useState, useEffect,} from "react";
import AddUserForm from "./AddUserForm";
import Header from "../HeaderComponents/Header";
import "../../styles/usersList.css";

import { useNavigate } from "react-router-dom";

const UsersList = () => {
  
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    {
      id: 1,
      photo: "/images/user1.jpg",
      email: "user1@example.com",
      firstName: "Иван",
      lastName: "Петров",
      birthDate: "1990-05-10",
      gender: "Мужской",
    },
    {
      id: 2,
      photo: "/images/user2.jpg",
      email: "user2@example.com",
      firstName: "Мария",
      lastName: "Сидорова",
      birthDate: "1988-08-20",
      gender: "Женский",
    },
    {
      id: 3,
      photo: "",
      email: "user3@example.com",
      firstName: "Алексей",
      lastName: "Иванов",
      birthDate: "1995-12-15",
      gender: "Мужской",
    },
    // Добавь больше пользователей для теста
  ]);

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest(".dropdown")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const addNewUser = (user) => {
    setUsers([...users, user]);
    setIsAddingUser(false);
    setCurrentPage(1);
  };

  const updateUser = (updatedUser) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    setEditingUser(null);
  };

  const removeUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="users-list">
      <Header
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />

      {isAddingUser ? (
        <AddUserForm
          addNewUser={addNewUser}
          onCancel={() => setIsAddingUser(false)}
        />
      ) : editingUser ? (
        <AddUserForm
          addNewUser={updateUser}
          editingUser={editingUser}
          onCancel={() => setEditingUser(null)}
          onDelete={() => {
            removeUser(editingUser.id);
            setEditingUser(null);
          }}
        />
      ) : (
        <>
          <div className="users-header">
            <h1>Пользователи</h1>
            <button className="add-user-button" onClick={() => navigate("/users/add")}>
              Добавить пользователя
            </button>
          </div>
          <table className="users-table">
            <thead>
              <tr>
                <th>Фотография</th>
                <th>Почта</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Пол</th>
                <th>Дата рождения</th>
                
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/users/edit/${user.id}`, { state: { editingUser: user } })}
                    style={{ cursor: "pointer" }} // Добавляем стиль для визуального указания, что строка кликабельная
                  >
                    <td>
                      {user.photo ? (
                        <img src={user.photo} alt="Фото" className="user-photo" />
                      ) : (
                        <img src="/images/default-avatar.png" alt="Фото" className="user-photo" />
                      )}
                    </td>
                    <td className="emaill">{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.gender}</td>
                    <td>{user.birthDate}</td>
                    <td className="actions-cell">
                      <div className="dropdown">
                        <button
                          className="menu-button"
                          onClick={(e) => {
                            e.stopPropagation(); // Останавливаем всплытие события, чтобы не сработал клик по строке
                            toggleMenu(user.id);
                          }}
                        >
                            ⋯
                        </button>
                        {openMenuId === user.id && (
                          <div className="dropdown-menu">
                            <button onClick={() => navigate(`/users/edit/${user.id}`, { state: { editingUser: user } })}>
                              Редактировать
                            </button>
                            <button onClick={() => removeUser(user.id)}>Удалить</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Пользователи не найдены</td>
                </tr>
              )}
            </tbody>

          </table>

          {/* Пагинация */}
          {totalPages > 0 && (
            <div className="pagination-container">
              <div className="page-info">Страница {currentPage}</div>

              <div className="pagination-svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="86"
                  height="32"
                  viewBox="0 0 86 32"
                  fill="none"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    if (clickX < 43 && currentPage > 1) {
                      setCurrentPage((prev) => prev - 1); // Назад
                    } else if (clickX >= 43 && currentPage < totalPages) {
                      setCurrentPage((prev) => prev + 1); // Вперёд
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <rect x="0.3" y="1.3" width="85.4" height="29.4" rx="7.7" fill="white" stroke="#C1C1C1" strokeWidth="0.6"/>
                  <g opacity="0.6">
                    <path d="M25.41 20.4064L20.83 16L25.41 11.5936L24 10.24L18 16L24 21.76L25.41 20.4064Z" fill="#151515"/>
                  </g>
                  <g opacity="0.9">
                    <path d="M61.59 20.4064L66.17 16L61.59 11.5936L63 10.24L69 16L63 21.76L61.59 20.4064Z" fill="#151515"/>
                  </g>
                  <path opacity="0.7" d="M43.5 31V1" stroke="#C1C1C1" strokeWidth="0.4" strokeLinecap="square"/>
                </svg>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsersList;
