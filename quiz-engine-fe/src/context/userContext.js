import {createContext, useState} from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(getUser(true));

  function getUser(init = false) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const Rtoken = localStorage.getItem("Rtoken");
    const email = localStorage.getItem("email");
    if (init) {
      if (token && Rtoken && userId && email) {
        return {
          userId,
          email,
        };
      }
      return null;
    }
    if (token && Rtoken && userId && email) {
      setUser({
        userId,
        email,
      });
    } else {
      setUser(null);
    }
  }

  function updateUser() {
    getUser();
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
