import React, { createContext, useContext, useEffect, useState } from "react";
const SchedulePreventiveContext = createContext({});

export const SchedulePreventiveProvider = ({ children }) => {
    const [valueSearch, setValueSearch] = useState(null)
    useEffect(() => {
    }, [])
    return (
        <SchedulePreventiveContext.Provider
            value={{
                valueSearch, setValueSearch
            }}
        >
            {children}
        </SchedulePreventiveContext.Provider>
    );
};

export default function useSchedulePreventive() {
    const context = useContext(SchedulePreventiveContext);
    return context;
}
