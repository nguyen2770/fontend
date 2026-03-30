import React, { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEY } from "../utils/constant";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [moduleCodes, setModuleCodes] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [branchChange, setBranchChange] = useState(null);
  const [companySetting, setCompanySetting] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const login = async (dataLogin) => {
    try {
      setToken(dataLogin.tokens);
      localStorage.setItem(
        STORAGE_KEY.USER,
        JSON.stringify({ ...dataLogin.user }),
      );
      localStorage.setItem(STORAGE_KEY.TOKEN, dataLogin.tokens.access.token);
      localStorage.setItem(
        STORAGE_KEY.REFRESH_TOKEN,
        dataLogin.tokens.refresh.token,
      );
      setUser({ ...dataLogin.user });
      window.location.reload();
    } catch (error) {
      setErrorMsg(error);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.clear();
    setToken(null);
  };

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY.TOKEN);
    const user = localStorage.getItem(STORAGE_KEY.USER);
    const companySettingStorage = localStorage.getItem(
      STORAGE_KEY.COMPANY_SETTING,
    );
    try {
      const userObj = JSON.parse(user);
      setCompanySetting(JSON.parse(companySettingStorage));
      setUser(userObj);
    } catch (error) {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY.USER);
    }
    setToken(token || null);
    setLoading(false);
  }, []);
  const updateBranchs = (_branchs) => {
    const _branchChange = localStorage.getItem(STORAGE_KEY.BRANCH_CHANGE);
    if (!_branchChange) {
      localStorage.setItem(STORAGE_KEY.BRANCH_CHANGE, "all");
      setBranchChange("all");
    } else {
      setBranchChange(_branchChange);
    }
    localStorage.setItem(
      STORAGE_KEY.BRANCHS,
      JSON.stringify(_branchs.map((_b) => _b.id)),
    );
    setBranchs(_branchs);
  };
  const permissionByUser = (_permissions) => {
    setPermissions(_permissions);
    localStorage.setItem(STORAGE_KEY.PERMISSION, JSON.stringify(_permissions));
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: typeof token === "undefined" ? undefined : !!token,
        user,
        login,
        loading,
        logout,
        errorMsg,
        token,
        moduleCodes,
        setModuleCodes,
        branchs,
        updateBranchs,
        branchChange,
        permissions,
        permissionByUser,
        setUser,
        companySetting,
        setCompanySetting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
