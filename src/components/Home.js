import React from "react";
import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";

const Home = () => {
    return (
        <div className="grid h-screen place-items-center">
            <LoginButton />
        </div>
    );
};

export default Home;
