import Cookies from "js-cookie";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { USER_ACCESS_KEY } from "../utils/enum";

type User = {
  id?: string;
  name?: string;
  email?: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  const logout = () => {
    setUser(null);
    Cookies.remove(USER_ACCESS_KEY.TOKEN);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
