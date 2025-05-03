import React, {createContext, useState, useContext, useEffect} from "react";
import userService from "../../api/userService";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userService.getById(3);
                setUser({
                    ...userData,
                    avatar: userData.imageDTO?.url || "../../assets/default-avatar.jpg",
                });
            } catch (error) {
                console.error("Ошибка получения пользователя:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);