import React, { useState, useEffect,} from "react";
import AddUserForm from "./AddUserForm";
import Header from "../HeaderComponents/Header";
import "../../styles/usersList.css";
import { ReactComponent as Plus } from "../../assets/Plus.svg";
import { useNavigate } from "react-router-dom";
import userService from "../../api/userService";

const UsersList = () => {
  
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  useEffect(() => {
    userService.getAll()
        .then((data) => setUsers(data))
        .catch((err) => console.error('Ошибка при загрузке:', err));
  }, []);

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
    `${user.name} ${user.surname} ${user.email}`
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
      />{isAddingUser ? (
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
            removeUser(editingUser.userId);
            setEditingUser(null);
          }}
        />
      ) : (
        <>
          <div className="users-header">
            <h1>Пользователи</h1>
            <button className="add-user-button" onClick={() => navigate("/users/add")}>
              Добавить пользователя
              <Plus/>
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
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.userId}
                    onClick={() => navigate(`/users/edit/${user.userId}`, { state: { editingUser: user } })}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      {!user.imageDTO?.url ? (
                        <img src="../../assets/default-avatar.jpg" alt="Фото" className="user-photo" />
                      ) : (
                        <img src={user.imageDTO.url} alt="Фото" className="user-photo" />
                      )}
                    </td>
                    <td className="emaill">{user.email}</td>
                    <td>{user.name}</td>
                    <td>{user.surname}</td>
                    <td>{user.gender === "FEMALE" ? "Женский" : user.gender === "MALE" ? "Мужской" : "Не указан"}</td>
                    <td>{user.birthDate}</td>
                    <td className="actions-cell">
                      <div className="dropdown">
                        <button
                          className="menu-button"
                          onClick={(e) => {
                            e.stopPropagation(); // Останавливаем всплытие события, чтобы не сработал клик по строке
                            toggleMenu(user.userId);
                          }}
                        >
                            ⋯
                        </button>
                        {openMenuId === user.userId && (
                          <div className="dropdown-menu">
                            <button onClick={() => navigate(`/users/edit/${user.userId}`, { state: { editingUser: user } })}>
                              Редактировать
                            </button>
                            <button onClick={() => removeUser(user.userId)}>Удалить</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                  <tr>
                    <td colSpan="7" className="no-properties">На данный нет существующих пользователей</td>
                  </tr>
              )}
            </tbody>

          </table>

          {/* Пагинация */}
          {totalPages > 0 && (
            <div className="pagination-container">
              <div className="page-info">Страница {currentPage}</div><div className="pagination-svg-wrapper">
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