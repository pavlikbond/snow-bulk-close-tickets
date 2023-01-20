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
import GroupMappings from "./components/GroupMappings";
import { useEffect, useState } from "react";
Amplify.configure(awsconfig);

function App() {
    const [companyData, setCompanyData] = useState({});
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/mappings?companies=true`, {
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setCompanyData(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

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
                        <Route path="/groupMapping/" element={<GroupMappings data={companyData} />} />
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
