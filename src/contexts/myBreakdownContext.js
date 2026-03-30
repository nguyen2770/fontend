import React, { createContext, useContext, useEffect, useState } from "react";
const MyBreakdownContext = createContext({});

export const MyBreakdownProvider = ({ children }) => {
    const [valueSearchMyBreakdown, setValueSearchMyBreakdown] = useState(null)
    useEffect(() => {
    }, [])
    return (
        <MyBreakdownContext.Provider
            value={{
                valueSearchMyBreakdown, setValueSearchMyBreakdown
            }}
        >
            {children}
        </MyBreakdownContext.Provider>
    );
};

export default function useMyBreakdown() {
    const context = useContext(MyBreakdownContext);
    return context;
}
