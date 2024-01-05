import { useState } from "react";
import DisplayCode from "../ui/DisplayCode";
import MethodDetails from "../ui/MethodDetails";
import ClientNameInput from "../ui/ClientNameInput";
import UpdateSelect from "../ui/UpdateSelect";
import InfoTable from "../ui/InfoTable";

const Update = () => {
  const [clientName, setClientName] = useState("YourCompanyName");
  const [ticketType, setTicketType] = useState("Incident");
  const [updateType, setUpdateType] = useState({
    priority: true,
    shortDescription: true,
    description: true,
    status: true,
    comment: true,
    group: true,
  });
  const getRequestData = () => {
    let requestData = {
      clientName: clientName,
      ticketType: ticketType,
      clientTicketNumber: "INC123456",
    };
    updateType.priority && (requestData.priority = "1");
    updateType.shortDescription && (requestData.shortDescription = "updated short description");
    updateType.description && (requestData.description = "updated description");
    updateType.status && (requestData.status = "resolved") && (requestData.closeNotes = "Ticket has been resolved");
    updateType.group && (requestData.group = "Ensono Service Desk");
    updateType.comment &&
      (requestData.comments = [
        {
          body: "New comment",
          commenter: "Jason Doe",
          commenterEmail: "Jason.Doe@abc.com",
          commenterPhone: "555-909-2395",
          commentTime: new Date().toLocaleString(),
        },
      ]);

    return { payload: requestData };
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 grid gap-4">
      <h1 className="text-center">Update</h1>

      <InfoTable
        tableHeaders={["Field", "On Update", "On Comments", "On Resolution or Closure", "Limits"]}
        tableData={tableData}
      />
      <MethodDetails type="Request" details={{ method: "PUT", endpoint: "/tickets/e-CS0204070", direction: 1 }} />

      <UpdateSelect onUpdateTypeChange={setUpdateType} />
      <DisplayCode jsonData={getRequestData()} heading="Request Body" />
      <MethodDetails type="Response" details={{ direction: 2 }} />
      <DisplayCode jsonData={responseData} heading="Response Body" />
    </div>
  );
};

let responseData = { Response: "Update Successful" };

const tableData = [
  {
    Field: "clientName",
    "On Update": "Required",
    "On Comments": "Required",
    "On Resolution or Closure": "Required",
    Limits: "",
  },
  {
    Field: "clientTicketNumber",
    "On Update": "Required",
    "On Comments": "Required",
    "On Resolution or Closure": "Required",
    Limits: "",
  },
  {
    Field: "ticketType",
    "On Update": "Required",
    "On Comments": "Required",
    "On Resolution or Closure": "Required",
    Limits: "Incident or Request",
  },
  {
    Field: "status",
    "On Update": "If Updated",
    "On Comments": "Ignored",
    "On Resolution or Closure": "Required",
    Limits: "open, workinprogress, pending, resolved, closed, cancelled",
  },
  {
    Field: "closeNotes",
    "On Update": "If Updated",
    "On Comments": "Ignored",
    "On Resolution or Closure": "Required",
    Limits: "4000 characters",
  },
  {
    Field: "description",
    "On Update": "If Updated",
    "On Comments": "Ignored",
    "On Resolution or Closure": "Ignored",
    Limits: "4000 characters",
  },
  {
    Field: "shortDescription",
    "On Update": "If Updated",
    "On Comments": "Ignored",
    "On Resolution or Closure": "Ignored",
    Limits: "160 characters",
  },
  {
    Field: "group",
    "On Update": "If Updated",
    "On Comments": "Ignored",
    "On Resolution or Closure": "Ignored",
    Limits: "Mapping to be determined",
  },
  {
    Field: "priority",
    "On Update": "If Updated",
    "On Comments": "Ignored",
    "On Resolution or Closure": "Ignored",
    Limits: "1, 2, 3, or 4",
  },
  {
    Field: "Impact",
    "On Update": "If Updated",
    "On Comments": "Ignored",
    "On Resolution or Closure": "Ignored",
    Limits: "1, 2, or 3 or can be mapped",
  },
  {
    Field: "urgency",
    "On Update": "If Updated",
    "On Comments": "Ignored",
    "On Resolution or Closure": "Ignored",
    Limits: "1, 2, or 3 or can be mapped",
  },
  {
    Field: "comments Array",
    "On Update": "Optional",
    "On Comments": "Required",
    "On Resolution or Closure": "Ignored",
    Limits: "",
  },
  {
    Field: "comments.body",
    "On Update": "Optional",
    "On Comments": "Required",
    "On Resolution or Closure": "Ignored",
    Limits: "4000 characters",
  },
  {
    Field: "comments.commenter",
    "On Update": "Optional",
    "On Comments": "Optional",
    "On Resolution or Closure": "Ignored",
    Limits: "Free-text",
  },
  {
    Field: "comments.commentTime",
    "On Update": "Optional",
    "On Comments": "Optional",
    "On Resolution or Closure": "Ignored",
    Limits: "Free-text",
  },
  {
    Field: "comments.commenterEmail",
    "On Update": "Optional",
    "On Comments": "Optional",
    "On Resolution or Closure": "Ignored",
    Limits: "Free-text",
  },
  {
    Field: "comments.commenterPhone",
    "On Update": "Optional",
    "On Comments": "Optional",
    "On Resolution or Closure": "Ignored",
    Limits: "Free-text",
  },
];

export default Update;
