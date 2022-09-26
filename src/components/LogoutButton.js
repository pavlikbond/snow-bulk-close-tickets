import React from "react";
import { Auth } from "aws-amplify";

const LogoutButton = () => {
    let signOut = async () => {
        try {
            await Auth.signOut();
        } catch (error) {
            console.log("error signing out: ", error);
        }
    };

    return (
        <button className="btn absolute top-2 left-2" onClick={signOut}>
            Log Out
        </button>
    );
};

export default LogoutButton;
