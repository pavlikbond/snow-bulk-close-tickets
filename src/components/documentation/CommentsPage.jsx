import React from "react";
import MethodDetails from "../ui/MethodDetails";
import { Link } from "react-router-dom";
import DisplayCode from "../ui/DisplayCode";
const CommentsPage = ({ ticketType }) => {
  if (ticketType === "Case") {
    return (
      <div className="w-full mx-auto max-w-5xl grid gap-4 my-12">
        <h1 className="text-center">Comments</h1>
        <div className="rounded shadow-sm bg-slate-50 p-4">
          <h2 className="text-2xl font-bold text-slate-600 mb-4">Notes</h2>
          <p>
            1. Comments can be send via a regular{" "}
            <Link className="underline text-blue-700" to={"/docs/incident-request/update"}>
              update
            </Link>{" "}
            endpoint or via the <span className="rounded bg-slate-300 inline-block px-1">/notes</span> endpoint.
          </p>
          <p>2. More than one comment can be sent at a time.</p>
        </div>
        <MethodDetails
          type="Request"
          details={{ method: "PUT", endpoint: "/tickets/{TICKET NUMBER}/notes", direction: 1 }}
        />
        <DisplayCode jsonData={exampleRequestDataCase} heading="Example Request Body" />
        <MethodDetails type="Response" details={{ direction: 2 }} />
        <DisplayCode jsonData={responseData} heading="Response Body" />
      </div>
    );
  } else if (ticketType === "Change") {
    return (
      <div className="w-full max-w-5xl mx-auto my-12 grid gap-4 h-fit">
        <h1 className="text-center">Comments</h1>

        <MethodDetails
          type="Request"
          details={{ method: "PUT", endpoint: "/tickets/{TICKET NUMBER}/notes", direction: 1 }}
        />
        <DisplayCode jsonData={exampleRequestDataChange} heading="Example Request Body" />
        <MethodDetails type="Response" details={{ direction: 2 }} />
        <DisplayCode jsonData={responseData} heading="Response Body" />
      </div>
    );
  }
};

export default CommentsPage;
let responseData = { Response: "Comments added" };
const exampleRequestDataCase = {
  payload: {
    clientName: "Your Company Name",
    ticketType: "Incident",
    ticketNumber: "CHG12345678",

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
const exampleRequestDataChange = {
  payload: {
    clientName: "Your Company Name",
    ticketType: "Change",
    clientTicketNumber: "CHG12345678",
    comments: [
      {
        body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, accusantium?",
        commenter: "Jason Doe",
        commentTime: "2017-07-03 17:55:48",
        commenterEmail: "Jason.Doe@abc.com",
        commenterPhone: "555-909-2395",
      },
    ],
  },
};
