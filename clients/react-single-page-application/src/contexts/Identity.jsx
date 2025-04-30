import { createContext, useState } from 'react';

export const Context = createContext({
    accessToken: "",
    identityToken: "",
    refreshToken: "",
});

export const Component = ({ children }) => {
    const [accessToken, setAccessToken] = useState("");
    // const [identityToken, setIdentityToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");

    return (
        <Context.Provider
            value={{
                accessToken, setAccessToken,
                // identityToken, setIdentityToken,
                refreshToken, setRefreshToken,
            }}
        >
        {children}
        </Context.Provider>
    )
}
