import "./App.css";
import React, { lazy, Suspense, useEffect, useState } from "react";
import Loading from "./components/common/Loading";
import { Navigate, Route, Routes } from "react-router-dom";
import BaseLayout from "./components/layout/BaseLayout";
import { flatRoutes, staticPath } from "./router/routerConfig";
import useAuth from "./contexts/authContext";
import * as _unitOfWork from "./api";
import { STORAGE_KEY } from "./utils/constant";
const Login = lazy(() => import("./pages/auth/Login"));
function App() {
  const [loadingFirst, setLoadingFirst] = useState(true);
  const {
    isAuthenticated,
    user,
    updateBranchs,
    permissionByUser,
    setCompanySetting,
  } = useAuth();
  useEffect(() => {
    if (window.innerWidth <= 768) {
      window.location.replace(`mobie`);
    }
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      fetchApp();
      fetchUserPermission();
      // _unitOfWork.user.updateLastLoginTime();
    } else {
      setLoadingFirst(false);
    }
  }, [isAuthenticated]);

  const fetchDataUser = async () => {
    let res = await _unitOfWork.user.getDataUser();
    if (res && res.code === 1) {
      let _newBranchs = res.data.userBranchs.map((item) => item.branch);
      updateBranchs(_newBranchs);
      setCompanySetting(res.data.companySetting);
      // localStorage.setItem(STORAGE_KEY.PERMISSION, JSON.stringify(res.data.permissions.map(item => item.permission)));
      localStorage.setItem(
        STORAGE_KEY.COMPANY_SETTING,
        JSON.stringify(res.data.companySetting),
      );
    }
  };
  const fetchUserPermission = async () => {
    let res = await _unitOfWork.user.getPermissisonByUsers();
    if (res && res.code === 1) {
      permissionByUser(res.data);
    }
  };
  const fetchApp = async () => {
    await fetchDataUser();
    setLoadingFirst(false);
  };
  if (loadingFirst) {
    return <Loading />;
  }
  if (isAuthenticated === undefined) {
    return <Loading />;
  } else if (isAuthenticated === false) {
    return (
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} index />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }
  // if (permissions && permissions.length > 0)
  else {
    return (
      <div className="App">
        <BaseLayout>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route
                path="*"
                element={<Navigate to={staticPath.home} replace />}
              />
              {flatRoutes().map((item) => {
                return (
                  <Route
                    path={item.path}
                    element={<item.component />}
                    key={item.key}
                  />
                );
              })}
            </Routes>
          </Suspense>
        </BaseLayout>
        {/* <Loadder></Loadder> */}
      </div>
    );
  }
}
export default App;
