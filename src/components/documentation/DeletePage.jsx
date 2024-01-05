import React from "react";
import MethodDetails from "../ui/MethodDetails";
import DisplayCode from "../ui/DisplayCode";
import data from "./queueReadData.json";
const DeletePage = () => {
  return (
    <div className="w-full max-w-5xl mx-auto my-12 grid gap-4 h-fit">
      <h1 className="text-center">Return PTN</h1>
      <div className="rounded shadow-sm bg-slate-50 p-4">
        <h2 className="text-2xl font-bold text-slate-600 mb-4">Notes</h2>
        <p>Encode the Receipt Handle prior to passing it into the URL.</p>
        <br />
        <p>
          Encoding the receipt handle is necessary to prevent potential issues with the API gateway's interpretation of
          the URL path. The presence of forward slash characters in the receipt handle could mislead the gateway,
          causing it to misroute or mishandle the DELETE request. Proper URL encoding ensures the correct and secure
          transmission of the receipt handle within the URL structure.
        </p>
      </div>
      <MethodDetails
        contentType=""
        type="Request"
        details={{ method: "DELETE", endpoint: "/queue/{Receipt Handle}", direction: 1 }}
      />

      <MethodDetails type="Response" details={{ direction: 2 }} />
      <DisplayCode jsonData={data.deleteResponse} heading="Response Body" />
    </div>
  );
};

export default DeletePage;
