import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [studentToken, setStudentToken] = useState(
    sessionStorage.getItem("studentToken")
  );

  const [adminToken, setAdminToken] = useState(
    sessionStorage.getItem("adminToken")
  );

  const studentLogin = (token) => {
    sessionStorage.setItem("studentToken", token);
    setStudentToken(token);
  };

  const adminLogin = (token) => {
    sessionStorage.setItem("adminToken", token);
    setAdminToken(token);
  };

  const studentLogout = () => {
    sessionStorage.removeItem("studentToken");
    setStudentToken(null);
  };

  const adminLogout = () => {
    sessionStorage.removeItem("adminToken");
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        studentToken,
        adminToken,
        studentLogin,
        adminLogin,
        studentLogout,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}