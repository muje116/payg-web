import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin } from "../api/auth";
import { getToken, setToken, removeToken } from "../utils/token";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());

  useEffect(() => {
    if (token) {
      // Optionally fetch user profile here
      setUser({}); // Placeholder
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await apiLogin(username, password);
      const { token: authToken, ...userPayload } = res.data || {};
      if (!authToken) throw new Error("No token in response");
      setToken(authToken);
      setTokenState(authToken);
      setUser(userPayload);
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
