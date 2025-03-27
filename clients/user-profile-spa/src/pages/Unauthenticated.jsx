import { useContext } from "react";
import * as contexts from "../contexts";
import * as mocks from "../mocks";

export const Unauthenticated = () => {
    const {
        updateStorageContext
    } = useContext(contexts.Storage.Context);

    return (
        <div style={{ textAlign: "center" }}>
        <button
            style={{ width: "50%" }}
            onClick={async () => {
                const sessionId = await mocks.login();
                if (!sessionId) alert("Could not login");
                updateStorageContext({ sessionId });
            }}
        >Log In</button>
    </div>
    )
}