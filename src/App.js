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
import { UserProvider } from "./components/UserContext";
import EchoCreator from "./components/EchoCreator";
import MappingGenerator from "./components/MappingGenerator";
import Test from "./components/Test";
import GroupFinder from "./components/GroupFinder";
import Files from "./components/Files";
import FlagFinder from "./components/FlagFinder";
Amplify.configure(awsconfig);

function App() {
  const [companyData, setCompanyData] = useState({});
  const [companyDataList, setCompanyDataList] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    //get companies for mapping tables
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/mappings`, {
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

    fetch(`${process.env.REACT_APP_API_ENDPOINT}/queues`, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCompanyDataList(data);
      })
      .catch((err) => {
        console.log(err);
        setError("Error connecting to API");
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
        <UserProvider>
          <div className="flex">
            <SideBar />
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/bulkCloser/" element={<BulkCloser />} />
              <Route path="/queueReader/" element={<QueueReader data={companyDataList} />} />
              <Route path="/groupMapping/" element={<GroupMappings data={companyData} />} />
              <Route path="/ticketGenerator/" element={<EchoCreator data={companyData} />} />
              <Route path="/mappingGenerator/" element={<MappingGenerator />} />
              <Route path="/groupfinder/" element={<GroupFinder data={companyData} />} />
              <Route path="/test/" element={<Test data={companyData} />} />
              <Route path="/files" element={<Files />} />
              <Route path="/flags" element={<FlagFinder data={companyData} />} />
            </Routes>
          </div>
        </UserProvider>
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
