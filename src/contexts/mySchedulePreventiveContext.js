import React, { createContext, useContext, useEffect, useState } from "react";
const MySchedulePreventiveContext = createContext({});

export const MySchedulePreventiveProvider = ({ children }) => {
    const [valueSearchSchedule, setValueSearchMySchedule] = useState(null)
    useEffect(() => {
    }, [])
    return (
        <MySchedulePreventiveContext.Provider
            value={{
                valueSearchSchedule, setValueSearchMySchedule
            }}
        >
            {children}
        </MySchedulePreventiveContext.Provider>
    );
};

export default function useMySchedulePreventive() {
    const context = useContext(MySchedulePreventiveContext);
    return context;
}
