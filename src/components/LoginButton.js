import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="bg-indigo-300 w-96 h-56 rounded-2xl shadow-2xl flex justify-evenly items-center flex-col">
            <h2 className="text-center text-lg font-bold text-slate-700">Click to Login to the Ticket Closer App</h2>
            <button className="btn-primary m-0 w-36" onClick={() => loginWithRedirect()}>
                Log In
            </button>
        </div>
    );
};

export default LoginButton;
