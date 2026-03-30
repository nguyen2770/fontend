import React, { createContext, useContext, useEffect, useState } from "react";
const BreakdownContext = createContext({});

export const BreakdownProvider = ({ children }) => {
    const [valueSearchBreakdown, setValueSearchBreakdown] = useState(null)
    useEffect(() => {
    }, [])
    return (
        <BreakdownContext.Provider
            value={{
                valueSearchBreakdown, setValueSearchBreakdown
            }}
        >
            {children}
        </BreakdownContext.Provider>
    );
};

export default function useBreakdown() {
    const context = useContext(BreakdownContext);
    return context;
}
