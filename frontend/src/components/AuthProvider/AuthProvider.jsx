import { useState, useEffect } from "react";

import { AuthContext } from "@/context/AuthContext";
import { useSiteStore } from "@/Store";

import { API, BEARER } from "@/constant";
import { getToken, removeToken } from "@/helpers";

const AuthProvider = ({ children }) => {
  const { isLoading, setIsLoading } = useSiteStore();
  const [userData, setUserData] = useState();

  const authToken = getToken();

  const fetchLoggedInUser = async (token) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/users/me`, {
        headers: { Authorization: `${BEARER} ${token}` },
      });
      const data = await response.json();

      setUserData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUser = (user) => {
    setUserData(user);
  };

  const logoutUser = () => {
    setUserData(undefined);
    removeToken();
  };

  useEffect(() => {
    if (authToken) {
      fetchLoggedInUser(authToken);
    }
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{
        user: userData,
        setUser: handleUser,
        isLoading,
        logoutUser: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
