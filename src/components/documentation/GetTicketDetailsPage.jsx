import React from "react";
import DisplayCode from "../ui/DisplayCode";
import data from "./getRequestData.json";
import MethodDetails from "../ui/MethodDetails";
const GetTicketDetailsPage = () => {
  return (
    <div className="w-full max-w-5xl mx-auto my-12 grid gap-4 h-fit">
      <h1 className="text-center">Get Ticket Details</h1>
      <div className="rounded shadow-sm bg-slate-50 p-4">
        <h2 className="text-2xl font-bold text-slate-600 mb-4">Notes</h2>
        <p>
          This method is only available in the dev environment and should only be used for testing/validation purposes.
        </p>
        <br />
        <p>
          For example, this endpoint can be used to confirm that an attachment was added to the Ensono ticket, or the
          the update is reflected in the ticket.
        </p>
      </div>
      <MethodDetails
        contentType=""
        type="Request"
        details={{ method: "GET", endpoint: "/tickets/{Ticket Number}", direction: 1 }}
      />

      <DisplayCode jsonData={data} heading="Response Body" />
    </div>
  );
};

export default GetTicketDetailsPage;
