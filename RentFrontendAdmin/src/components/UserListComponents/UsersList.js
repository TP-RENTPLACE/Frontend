import React, {useState, useEffect, useMemo,} from "react";
import AddUserForm from "./AddUserForm";
import Header from "../HeaderComponents/Header";
import "../../styles/usersList.css";
import {ReactComponent as Plus} from "../../assets/Plus.svg";
import {useNavigate} from "react-router-dom";
import userService from "../../api/userService";
import defaultImg from "../../assets/default-avatar.jpg";
import {useQuery} from "@tanstack/react-query";
import {toast} from "react-toastify";

const UsersList = () => {

    const navigate = useNavigate();

    const [isAddingUser, setIsAddingUser] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: () => userService.getAll(),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const closeMenu = (e) => {
            if (!e.target.closest(".dropdown")) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, []);

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredUsers = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase().trim();
        return users.filter(user => {
            const name = user.name?.toLowerCase() ?? '';
            const surname = user.surname?.toLowerCase() ?? '';
            const email = user.email?.toLowerCase() ?? '';
            return `${name} ${surname} ${email}`.includes(lowerQuery);
        });
    }, [users, searchQuery]);

    const handleBlockToggle = async (user) => {
        try {
            if (user.userStatus === "STATUS_ACTIVE") {
                await userService.blockUser(user.userId);
                toast.success(`Пользователь ${user.email} заблокирован`);
            } else {
                await userService.activateUser(user.userId);
                toast.success(`Пользователь ${user.email} разблокирован`);
            }
            await refetch();
        } catch (error) {
            toast.error("Ошибка при обновлении статуса пользователя");
        }
    };

    const handleDelete = async (userId) => {
        try {
            await userService.delete(userId);
            toast.success("Пользователь удалён");
            await refetch();
        } catch (error) {
            toast.error("Ошибка при удалении пользователя");
        }
    };


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
                    onCancel={() => setIsAddingUser(false)}
                />
            ) : editingUser ? (
                <AddUserForm
                    editingUser={editingUser}
                    onCancel={() => setEditingUser(null)}
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
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr
                                    key={user.userId}
                                    onClick={() => navigate(`/users/edit/${user.userId}`, {state: {editingUser: user}})}
                                    style={{cursor: "pointer"}}
                                >
                                    <td>
                                        {!user.imageDTO?.url ? (
                                            <img src={defaultImg} alt="Фото"
                                                 className="user-photo"/>
                                        ) : (
                                            <img src={user.imageDTO.url} alt="Фото" className="user-photo"/>
                                        )}
                                    </td>
                                    <td className="emaill">{user.email}</td>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.gender === "FEMALE" ? "Женский" : user.gender === "MALE" ? "Мужской" : "Не указан"}</td>
                                    <td>{user.birthDate || "Не указана"}</td>
                                    <td className="actions-cell">
                                        <div className="dropdown">
                                            <button
                                                className="menu-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMenu(user.userId);
                                                }}
                                            >
                                                ⋯
                                            </button>
                                            {openMenuId === user.userId && (
                                                <div className="dropdown-menu">
                                                    <button
                                                        onClick={() => navigate(`/users/edit/${user.userId}`, {state: {editingUser: user}})}>
                                                        Редактировать
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            void handleBlockToggle(user);
                                                        }}
                                                    >
                                                        {user.userStatus === "STATUS_ACTIVE" ? "Заблокировать" : "Разблокировать"}
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            void handleDelete(user.userId);
                                                        }}
                                                    >
                                                        Удалить
                                                    </button>
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
                                    setCurrentPage((prev) => prev - 1);
                                    } else if (clickX >= 43 && currentPage < totalPages) {
                                    setCurrentPage((prev) => prev + 1);
                                    }
                                }}
                                style={{ cursor: (currentPage > 1 || currentPage < totalPages) ? "pointer" : "default" }}
                                >
                                <rect x="0.3" y="1.3" width="85.4" height="29.4" rx="7.7" fill="white" stroke="#C1C1C1" strokeWidth="0.6" />

                                
                                <path
                                    d="M25.41 20.4064L20.83 16L25.41 11.5936L24 10.24L18 16L24 21.76L25.41 20.4064Z"
                                    fill={currentPage > 1 ? "#151515" : "#C1C1C1"}
                                    opacity={currentPage > 1 ? "1" : "0.3"}
                                />

                                
                                <path
                                    d="M61.59 20.4064L66.17 16L61.59 11.5936L63 10.24L69 16L63 21.76L61.59 20.4064Z"
                                    fill={currentPage < totalPages ? "#151515" : "#C1C1C1"}
                                    opacity={currentPage < totalPages ? "1" : "0.3"}
                                />

                                <path opacity="0.7" d="M43.5 31V1" stroke="#C1C1C1" strokeWidth="0.4" strokeLinecap="square" />
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