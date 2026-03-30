import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HeaderProvider } from "./contexts/headerContext";
import { AuthProvider } from "./contexts/authContext";
import "@fontsource/nunito";
import { SchedulePreventiveProvider } from "./contexts/schedulePreventiveContext";
import { MySchedulePreventiveProvider } from "./contexts/mySchedulePreventiveContext";
import { BreakdownProvider } from "./contexts/breakdownContext";
import { MyBreakdownProvider } from "./contexts/myBreakdownContext";
import './config-translation'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <HeaderProvider>
        <SchedulePreventiveProvider>
          <MySchedulePreventiveProvider>
            <BreakdownProvider>
              <MyBreakdownProvider>
                <Routes>
                  <Route path="/*" element={<App />} />
                </Routes>
              </MyBreakdownProvider>
            </BreakdownProvider>
          </MySchedulePreventiveProvider>
        </SchedulePreventiveProvider>
      </HeaderProvider>
    </AuthProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
