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
import GroupMapper from "./components/GroupMapper";
import StackSetPage from "./components/StackSetPage";
import Documentation from "./components/documentation/Documentation";
import Overview from "./components/documentation/Overview";
import Create from "./components/documentation/Create";
import Update from "./components/documentation/Update";
import ReadQueue from "./components/documentation/ReadQueue.jsx";
import { Outlet } from "react-router-dom";
import CommentsPage from "./components/documentation/CommentsPage.jsx";
import ReturnPtnPage from "./components/documentation/ReturnPtnPage.jsx";
import DocsHomePage from "./components/documentation/DocsHomePage.jsx";
import ApproveRejectPage from "./components/documentation/ApproveRejectPage.jsx";
import DeletePage from "./components/documentation/DeletePage.jsx";
import GetTicketDetailsPage from "./components/documentation/GetTicketDetailsPage.jsx";
import EchoPage from "./components/documentation/EchoPage.jsx";
Amplify.configure(awsconfig);

function App() {
  const [companyData, setCompanyData] = useState({});
  const [companyDataList, setCompanyDataList] = useState([]);
  const [, setError] = useState("");
  const [usefulLinks, setUsefulLinks] = useState([]);
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
        setCompanyDataList([...data]);
      })
      .catch((err) => {
        console.log(err);
        setError("Error connecting to API");
      });

    fetch(`${process.env.REACT_APP_API_ENDPOINT}/getLinks`, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUsefulLinks(data);
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
              <Route path="/" element={<Home data={usefulLinks} />}></Route>
              <Route path="/bulkCloser/" element={<BulkCloser />} />
              <Route path="/queueReader/" element={<QueueReader data={companyDataList} />} />
              <Route path="/groupMapping/" element={<GroupMappings data={companyData} />} />
              <Route path="/ticketGenerator/" element={<EchoCreator data={companyData} />} />
              <Route path="/mappingGenerator/" element={<MappingGenerator />} />
              <Route path="/groupfinder/" element={<GroupFinder data={companyData} />} />
              <Route path="/test/" element={<Test data={companyData} />} />
              <Route path="/files" element={<Files />} />
              <Route path="/flags" element={<FlagFinder data={companyData} />} />
              <Route path="/groupmapper" element={<GroupMapper />} />
              <Route path="/stacksets" element={<StackSetPage />}></Route>
              <Route path="/docs" element={<Documentation />}>
                <Route path="" element={<DocsHomePage />} />
                <Route path="overview" element={<Overview />} />
                <Route path="incident-request" element={<Outlet />}>
                  <Route path="create" element={<Create />} />
                  <Route path="update" element={<Update />} />
                  <Route path="comments" element={<CommentsPage ticketType="Case" />} />
                  <Route path="return-ptn" element={<ReturnPtnPage ticketType="Case" />} />
                  <Route path="queue" element={<ReadQueue key="/incident-request/queue" isCase={true} />} />
                </Route>
                <Route path="change" element={<Outlet />}>
                  <Route path="approve-reject" element={<ApproveRejectPage />} />
                  <Route path="comments" element={<CommentsPage ticketType="Change" />} />
                  <Route path="return-ptn" element={<ReturnPtnPage ticketType="Change" />} />
                  <Route path="queue" element={<ReadQueue key="/change/queue" isCase={false} />} />
                </Route>
                <Route path="delete-from-queue" element={<DeletePage />} />
                <Route path="get-ticket-details" element={<GetTicketDetailsPage />} />
                <Route path="echo" element={<EchoPage />} />
              </Route>
            </Routes>
          </div>
        </UserProvider>
      </Authenticator>
    </>
  );
}
// const Placeholder = ({ name }) => (
//   <div>
//     <h1>{name} Page</h1>
//     <p>This is a placeholder for the {name} page.</p>
//   </div>
// );

export default App;
