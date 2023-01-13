import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AmplifyProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AmplifyProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AmplifyProvider>
);
