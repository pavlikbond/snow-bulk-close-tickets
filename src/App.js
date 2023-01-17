import "./index.css";
import "./styles.css";
import { Routes, Route } from "react-router-dom";
import BulkCloser from "./components/BulkCloser";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import SideBar from "./components/SideBar";
import QueueReader from "./components/QueueReader";
import Home from "./components/Home";

Amplify.configure(awsconfig);

function App() {
    const formFields = {
        signIn: {
            username: {
                labelHidden: false,
                placeholder: "Enter your email",
            },
            password: {
                labelHidden: false,
                label: "Password",
                placeholder: "Enter your Password",
            },
        },
    };
    return (
        <>
            <Authenticator hideSignUp={true} formFields={formFields} className="authenticator rounded-md">
                <div className="flex">
                    <SideBar />
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/bulkCloser/" element={<BulkCloser />} />
                        <Route path="/queueReader/" element={<QueueReader />} />
                    </Routes>
                </div>
            </Authenticator>
            {/* <Routes>
                <Route path="/" element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="bulk-close-app" element={<BulkCloser />} />
            </Routes> */}
        </>
    );
}

export default App;
