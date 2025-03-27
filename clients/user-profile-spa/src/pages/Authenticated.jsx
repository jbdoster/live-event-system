import { useContext, useState } from "react"
import * as contexts from "../contexts";

const Tabs = ({
        emitEvent,
        setTab,
        tab,
        sessionId,
    }) =>
    <>
        <button
            onClick={() => setTab("home")}
            style={{ height: "30%", width: "50%", }} 
        >Home</button>
        <button
            onClick={() => setTab("settings")}
            style={{ height: "30%", width: "50%", }} 
        >Settings</button>
        <div style={{ fontSize: "500%", textAlign: "center" }}>
            {tab + " page"}
        </div>
        {tab === "settings" &&
            <div
                style={{ textAlign: "center" }}
            >
                <br />
                <br />
                <br />
                <label htmlFor="firstName">First Name</label>
                <br />
                <br />
                <input id="firstName" />
                <br />
                <br />
                <button onClick={() => {
                    const firstName = document.getElementById("firstName").value;
                    emitEvent({
                        eventKey: "update_user_profile",
                        data: {
                            firstName,
                        },
                    })
                }}>Update Information</button>
            </div>
        }
        <br />
        <br />
        <br />
        <br />
        <br />
    </>

/**
 *  Example page showing that you can do other things as a user
 *  while the update takes place asynchronously. 
 */
export const Authenticated = () => {
    const {
        emitEvent,
    } = useContext(contexts.WebSocket.Context);
    const {
        storageContext,
    } = useContext(contexts.Storage.Context);
    const [tab, setTab] = useState("home");
    return <Tabs
        emitEvent={emitEvent}
        sessionId={storageContext.sessionId}
        setTab={setTab}
        tab={tab}
    />
}
