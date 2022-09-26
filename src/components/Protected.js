import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import BulkCloseMain from "../BulkCloseMain";

const Protected = () => {
    <h3 id="protected">Protected</h3>;
    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (!authState || !authState.isAuthenticated) {
            // When user isn't authenticated, forget any user info
            setUserInfo(null);
        } else {
            oktaAuth
                .getUser()
                .then((info) => {
                    setUserInfo(info);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [authState, oktaAuth]); // Update if authState changes

    if (!userInfo) {
        return (
            <div>
                <p>Fetching user info ...</p>
            </div>
        );
    }

    return <BulkCloseMain />;
};

export default Protected;
