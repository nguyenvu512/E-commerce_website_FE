import React, { createContext, useState, useContext } from "react";

// Tạo Context
const AuthContext = createContext();

// Provider để cung cấp trạng thái cho toàn ứng dụng
export const AuthProvider = ({ children }) => {
  const [showForm, setShowForm] = useState(false);
  const [login, setLogin] = useState(false);
  // Hàm để mở và đóng form
  const toggleLoginForm = () => {
    setShowForm(!showForm);
    setLogin(true);
  };
  const toggleRegisterForm = () => {
    setShowForm(!showForm);
    setLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        showForm,
        toggleLoginForm,
        toggleRegisterForm,
        login,
        setLogin,
        setShowForm,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// Hook để sử dụng AuthContext
export const useAuthContext = () => {
  return useContext(AuthContext);
};
