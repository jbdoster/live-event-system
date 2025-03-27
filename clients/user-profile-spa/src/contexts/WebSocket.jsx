import { createContext, useContext, useEffect, useState } from 'react';

import { Context as StorageContext } from "./Storage"

import * as mocks from "../mocks";

export const Context = createContext({});

/**
 *  Using a React Context so we can isolate and control
 *  the web socket connection.
 *  This provides a common interface so when things change
 *  all other components depending on this interface require
 *  minimal updates.
 */
export const Component = ({ children }) => {
    const {
        storageContext
    } = useContext(StorageContext)
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState();

    const closeSocketConnection = () => socket && socket.close();

    const emitEvent = ({
        eventKey,
        data,
    }) => {
        if (!connected) {
            throw new Error("Web socket not connected.");
        }
        else if (!storageContext?.sessionId) {
            throw new Error("No session ID recorded. User is not logged in.")
        }
        else {
            const message = {
                eventKey,
                data,
                sessionId: storageContext.sessionId,
                version: parseInt(import.meta.env.VITE_WEB_SOCKET_EVENT_VERSION),
            };
            const encoded = JSON.stringify(message);
            socket.send(encoded);
        }
    }

    useEffect(() => {
        if (storageContext?.sessionId) {
            const _socket = new WebSocket("ws://localhost:8084");

            _socket.addEventListener("open", (event) => {
              if (connected) return;

              setConnected(true);

              const message = JSON.stringify({
                eventKey: "opened_client_connection",
                sessionId: storageContext.sessionId,
              });

              _socket.send(message);

              mocks.emitAnalyticsEvent("WEB_SOCKET_CONNECTION_OPENED", event);
            });
            
            _socket.addEventListener("message", (event) => {
              mocks.emitAnalyticsEvent("WEB_SOCKET_MESSAGE_RECEIVED", event);

              const decoded = JSON.parse(event.data);

              /**
               *  TODO
               *  Trigger data refetch.
               *  Data refetches can be authenticated and permission scopes can be reduced/controlled.
               *  Data refetches replace the need for the web socket server to return data from the job.
               *  We want refetches instead of sending the updated data from the job because different
               *  I/O can take place during the event subscription jobs (e.g. 1st/3rd party integrations)
               *  which means we cannot guarantee the data being sent back to the client is secure.
               *  It is more secure to authenticate data requests exclusively for the relying party
               *  without all the external sources operating on the data in the middle.
               */
              if (decoded.eventKey === "client_request_error") {
                  alert(decoded.data.userDisplayText)
              }
              else if (decoded.eventKey === "client_request_success") {
                alert(decoded.data.userDisplayText)
            }
            });
    
            setSocket(_socket);
        }
        /**
         *  The socket connection should only be ready state "OPEN"
         *  when the user has a valid session ID after signing in.
         */
        else {
            if (socket?.readyState === "OPEN") {
                socket.close();
            }
        }
    }, [storageContext.sessionId]);

    useEffect(() => {
        if (socket) {
            socket.addEventListener("close", (_) => {
                console.log("Socket connection closed");
                setConnected(false);
            });

            socket.addEventListener("error", (error) => {
                console.log("Socket connection error" + error?.message);
                setConnected(false);
            });
        }
    }, [socket]);

    return (
        <Context.Provider
            value={{
                closeSocketConnection,
                connected,
                emitEvent,
                setConnected,
            }}
        >
        {children}
        </Context.Provider>
    )
}