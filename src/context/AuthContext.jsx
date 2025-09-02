import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  userRole: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setUser: () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('skillmatch_user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser?.isAuthenticated) {
            setUser(parsedUser);
            setUserRole(parsedUser?.userRole);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('skillmatch_user');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    try {
      const userInfo = {
        ...userData,
        isAuthenticated: true
      };
      
      localStorage.setItem('skillmatch_user', JSON.stringify(userInfo));
      setUser(userInfo);
      setUserRole(userInfo?.userRole);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('skillmatch_user');
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('skillmatch_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const value = {
    user,
    userRole,
    isAuthenticated,
    loading,
    login,
    logout,
    setUser: updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;