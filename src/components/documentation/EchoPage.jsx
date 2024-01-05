import { useState } from "react";
import MethodDetails from "../ui/MethodDetails";
import TransactionTypeSelect from "../ui/TransactionTypeSelect";
import data from "./queueReadData.json";
import DisplayCode from "../ui/DisplayCode";
import { Link } from "react-router-dom";
const EchoPage = () => {
  const [details, setDetails] = useState({ method: "POST", endpoint: "/tickets", direction: 1 });
  const [transactionType, setTransactionType] = useState("Create");
  const onTransactionTypeChange = (value, name) => {
    setTransactionType(value);
    if (value === "Create") {
      setDetails({ method: "POST", endpoint: "/tickets", direction: 1 });
    } else {
      setDetails({ method: "PUT", endpoint: "/tickets/{TICKET NUMBER}", direction: 1 });
    }
  };
  return (
    <div className="w-full max-w-5xl mx-auto my-12 grid gap-4 h-fit">
      <h1 className="text-center">Echo</h1>
      <div className="rounded shadow-sm bg-slate-50 p-4">
        <h2 className="text-2xl font-bold text-slate-600 mb-4">Notes</h2>
        <p>
          The <span className="rounded inline-block bg-slate-200 px-1">/echo</span> endpoint provides a way for client
          developers to add messages to the queue without the need for an end user to make updates on the Ensono side
        </p>
        <br />
        <p>
          This functionality should only be used for testing purposes. This is extremely helpful while building the
          queue reading logic.
        </p>
        <br />
        <p>
          You can pass in the same values as you would for a standard{" "}
          <Link className="underline text-blue-700" to={"/docs/incident-request/create"}>
            create
          </Link>{" "}
          or{" "}
          <Link className="underline text-blue-700" to={"/docs/incident-request/update"}>
            update
          </Link>{" "}
          payload, with the only difference being the{" "}
          <span className="rounded inline-block bg-slate-200 px-1">/echo</span> instead of{" "}
          <span className="rounded inline-block bg-slate-200 px-1">/dev</span> in the URL.
        </p>
        <br />
        <p>
          The echo functionality only works for <span className="font-bold">Incidents and Requests</span> and is not
          available for Change.
        </p>
      </div>
      <div className="rounded shadow-sm bg-slate-50 p-4">
        <h2 className="text-2xl font-bold text-slate-600 mb-4">Options</h2>
        <TransactionTypeSelect handleChange={onTransactionTypeChange} options={["Create", "Update"]} />
      </div>
      <MethodDetails type="Request" env="echo" details={details} />
      <DisplayCode
        jsonData={transactionType === "Create" ? data.echoCreate : data.echoUpdate}
        heading="Example Request Body"
      />
    </div>
  );
};

export default EchoPage;
