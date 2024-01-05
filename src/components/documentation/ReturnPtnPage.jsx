import React from "react";
import MethodDetails from "../ui/MethodDetails";
import DisplayCode from "../ui/DisplayCode";
const ReturnPtnPage = ({ ticketType }) => {
  const requestJsonData = ticketType === "Case" ? caseRequest : changeRequest;
  const heading = "Example Request Body";

  return (
    <div className="w-full max-w-5xl mx-auto my-12 grid gap-4 h-fit">
      <h1 className="text-center">
        Return PTN <span className="text-lg">(Partner Ticket Number)</span>
      </h1>

      <MethodDetails
        type="Request"
        details={{ method: "PUT", endpoint: "/tickets/{Ticket Number}/returnptn", direction: 1 }}
      />
      <DisplayCode jsonData={requestJsonData} heading={heading} />
      <MethodDetails type="Response" details={{ direction: 2 }} />
      <DisplayCode jsonData={response} heading="Response Body" />
    </div>
  );
};

export default ReturnPtnPage;

const response = { Response: "PTN added" };

const caseRequest = {
  payload: {
    clientName: "Your Company Name",
    ticketType: "Incident",
    clientTicketNumber: "INC12345678",
  },
};

const changeRequest = {
  payload: {
    clientName: "YourCompanyName",
    ticketType: "Change",
    clientTicketNumber: "CHG12345678",
  },
};
