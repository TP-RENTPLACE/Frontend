import React, { useState, useEffect, useContext } from "react";
import AddUserForm from "./AddUserForm";
import Header from "./Header";
import "../styles/usersList.css";
import { UserContext } from "./UserContext";

const UsersList = () => {
  const { user } = useContext(UserContext);

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
  ]);

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="users-list">
      <Header
        searchQuery={searchQuery}
        handleSearchChange={(e) => setSearchQuery(e.target.value)}
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
            <button className="add-user-button" onClick={() => setIsAddingUser(true)}>
              Добавить пользователя
            </button>
          </div>
          <table className="users-table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>Почта</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Дата рождения</th>
                <th>Пол</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.photo ? (
                        <img src={user.photo} alt="Фото" className="user-photo" />
                      ) : (
                        <img src="/images/default-avatar.png" alt="Фото" className="user-photo" />
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.birthDate}</td>
                    <td>{user.gender}</td>
                    <td className="actions-cell">
                      <div className="dropdown">
                        <button
                          className="menu-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(user.id);
                          }}
                        >
                          ⋮
                        </button>
                        {openMenuId === user.id && (
                          <div className="dropdown-menu">
                            <button onClick={() => setEditingUser(user)}>Редактировать</button>
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
        </>
      )}
    </div>
  );
};

export default UsersList;
