import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Auth0Provider
        domain="dev-xxu-junt.us.auth0.com"
        clientId="nimb2Zw7ePBlDqeyvEBJWAKiCrwZum22"
        redirectUri={`http://localhost:3000/bulk-close-app`}
    >
        <Router>
            <App />
        </Router>
    </Auth0Provider>
);
