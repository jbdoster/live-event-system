import { createContext, useState } from 'react';

export const Context = createContext({
    sessionId: null,
});

/**
 *  A way to compile all storage options together
 *  to ensure the best user experience.
 *  If any storage options are available, we do
 *  not need to request that the user 
 */
export const Component = ({ children }) => {
    const [storageContext, setStorageContext] = useState({
        /**
         *  Using a React Context so we can reference
         *  the session ID.
         *  The session ID is linked to the authentication token
         *  for the user after they sign in.
         *  Keeping as much in the back end as possible.
         */
        sessionId: null,
    });

    const updateStorageContext = (records) => {
        setStorageContext({
            ...storageContext,
            ...records,
        })
    }

    return (
        <Context.Provider
            value={{
                storageContext,
                updateStorageContext,
            }}
        >
        {children}
        </Context.Provider>
    )
}