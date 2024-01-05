import { useState } from "react";
import DisplayCode from "../ui/DisplayCode";
import MethodDetails from "../ui/MethodDetails";
import ClientNameInput from "../ui/ClientNameInput";
import InfoTable from "../ui/InfoTable";
const Create = () => {
  const [clientName, setClientName] = useState("YourCompanyName");
  const [ticketType, setTicketType] = useState("Incident");
  const getRequestData = () => {
    requestData.payload.clientName = clientName;
    requestData.payload.ticketType = ticketType;
    return requestData;
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 grid gap-4">
      <h1 className="text-center">Create</h1>
      <InfoTable tableFooter={tableFooter} tableHeaders={["Field", "On Open", "Limits"]} tableData={updateTableData} />

      <MethodDetails type="Request" details={{ method: "POST", endpoint: "/tickets", direction: 1 }} />
      <DisplayCode jsonData={getRequestData()} heading="Request Body" />
      <MethodDetails type="Response" details={{ direction: 2 }} />
      <DisplayCode jsonData={responseData} heading="Response Body" />
    </div>
  );
};

export default Create;
const tableFooter =
  "* The client needs to choose whether to send the priority value, or the impact/urgency values. This decision needs to remain consistent for all create payloads.";
const updateTableData = [
  {
    Field: "clientName",
    "On Open": "Required",
    Limits: "Value will be provided by Ensono",
  },
  {
    Field: "clientTicketNumber",
    "On Open": "Required",
    Limits: "",
  },
  {
    Field: "ticketType",
    "On Open": "Required",
    Limits: "Incident or Request",
  },
  {
    Field: "description",
    "On Open": "Required",
    Limits: "4000 characters",
  },
  {
    Field: "shortDescription",
    "On Open": "Required",
    Limits: "160 characters",
  },
  {
    Field: "group",
    "On Open": "Optional",
    Limits: "Mapping to be determined",
  },
  {
    Field: "priority",
    "On Open": "Required*",
    Limits: "1, 2, 3, or 4 (Defaults to 3 if not provided or invalid) if the client didn’t use impact and urgency",
  },
  {
    Field: "impact",
    "On Open": "Required*",
    Limits: "1, 2, or 3 (Defaults to 3 if not provided or invalid) can also be mapped",
  },
  {
    Field: "urgency",
    "On Open": "Required*",
    Limits: "1, 2, or 3 (Defaults to 3 if not provided or invalid) can also be mapped",
  },
  {
    Field: "cis",
    "On Open": "Optional",
    Limits: "Comma separated",
  },
  {
    Field: "contactName",
    "On Open": "Required",
    Limits: "Free-text",
  },
  {
    Field: "contactEmail",
    "On Open": "Required",
    Limits: "Free-text",
  },
  {
    Field: "contactPhone",
    "On Open": "Optional",
    Limits: "Free-text",
  },
  {
    Field: "comments Array",
    "On Open": "Optional",
    Limits: "Use if any comments were added before bridging, use the same comments format as updates",
  },
];

let requestData = {
  payload: {
    clientName: "YourCompanyName",
    ticketType: "Incident",
    clientTicketNumber: "INC123456",
    priority: "4",
    group: "Ensono Service Desk",
    contactName: "John Doe",
    contactPhone: "800-555-1234",
    contactEmail: "hello@world.com",
    shortDescription: "test",
    description: "test",
    cis: "testCI1,testCI3,testCI6",
    comments: [
      {
        body: "Comment 1",
        commenter: "Jason Doe",
        commenterEmail: "Jason.Doe@abc.com",
        commenterPhone: "555-909-2395",
        commentTime: new Date().toLocaleString(),
      },
      {
        body: "Comment 2",
        commenter: "Jason Doe",
        commenterEmail: "Jason.Doe@abc.com",
        commenterPhone: "555-909-2395",
        commentTime: new Date().toLocaleString(),
      },
    ],
  },
};

let responseData = { Response: "e-CS0204070" };
