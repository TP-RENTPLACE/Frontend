import React, {createContext, useState, useEffect} from "react";
import authService from "../../api/authService";
import defaultImg from "../../assets/default-avatar.jpg";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const cachedUser = localStorage.getItem("user");
        return cachedUser ? JSON.parse(cachedUser) : null;
    });

    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authService.getInfo();
                const formattedUser = {
                    ...userData,
                    avatar: userData.imageDTO?.url || defaultImg,
                };
                setUser(formattedUser);
                localStorage.setItem("user", JSON.stringify(formattedUser));
            } catch (error) {
                console.error("Ошибка получения пользователя:", error);
                setUser(null);
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
