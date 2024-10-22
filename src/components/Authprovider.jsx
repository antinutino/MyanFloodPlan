import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../appwrite/authconfig.js';

// Create a Context for the authentication
export const AuthContext = createContext(null);

const Authprovider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createuser = async (email, password, name) => {
    setLoading(true);
    try {
      const userAccount = await authService.createAccount({ email, password, name });
      setUser(userAccount);
      return userAccount;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const session = await authService.login({ email, password });
      const userAccount = await authService.getCurrentUser();
      setUser(userAccount);
      return session;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userAccount = await authService.getCurrentUser();
        setUser(userAccount);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // The value that will be supplied to any descendants of this component.
  const authinfo = {
    createuser,
    login,
    user,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={authinfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default Authprovider;
