import React, { createContext, useContext, useEffect, useState } from "react";
import * as _unitOfWork from "../api";
const HeaderContext = createContext({});

export const HeaderProvider = ({ children }) => {
    const [headerTitle, setHeaderTitle] = useState(null)
    useEffect(() => {
    }, [])
    return (
        <HeaderContext.Provider
            value={{
                headerTitle,
                setHeaderTitle
            }}
        >
            {children}
        </HeaderContext.Provider>
    );
};

export default function useHeader() {
    const context = useContext(HeaderContext);
    return context;
}
