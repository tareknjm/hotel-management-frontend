import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');
    const nom   = localStorage.getItem('nom');
    return token ? { token, role, nom } : null;
  });

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role',  data.role);
    localStorage.setItem('nom',   data.nom);
    setUser(data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);