import React, { createContext, useState, useContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Александр",
    surname: "Виноградов",
    email: "alex_vinogradov@yandex.ru",
    birthDate: "1980-11-02",
    gender: "Мужской",
    role: "Администратор",
    registrationDate: "2025-01-01",
    avatar: "/images/default-avatar.png",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
