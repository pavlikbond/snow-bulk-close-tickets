import { useState, useRef } from "react";
import data from "./queueReadData.json";
import DisplayCode from "../ui/DisplayCode";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MethodDetails from "../ui/MethodDetails";
import ClientNameInput from "../ui/ClientNameInput";
import TicketTypeInput from "../ui/TicketTypeInput";
import TransactionTypeSelect from "../ui/TransactionTypeSelect";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InfoTable from "../ui/InfoTable";
import tableData from "./queueReadTable.json";
const changeTransactionTypes = ["Create", "Update", "Attachment", "Closure", "Approval Request", "Notes", "Redraft"];
const caseTransactionTypes = ["Create", "Update", "Attachment", "Closure", "Notes"];
const transactionTypeMap = {
  Case: {
    Create: data.create,
    Update: data.update,
    Attachment: data.attachment,
    Closure: data.closure,
    Notes: data.comment,
  },
  Change: {
    Create: data.changeCreate,
    Update: data.changeUpdate,
    Attachment: data.changeAttachment,
    Closure: data.changeClosure,
    Notes: data.changeComment,
    "Approval Request": data.changeApprovalRequest,
    Redraft: data.changeRedraft,
  },
};

const riskAssessmentMap = {
  JSON: data.riskAssessmentJson,
  String: data.riskAssessmentString,
  Array: data.riskAssessmentArray,
};
const ReadQueue = ({ isCase = true }) => {
  const [json, setJson] = useState(isCase ? data.create : data.changeCreate);
  const clientName = useRef();
  const ticketType = useRef(isCase ? "Incident" : "Change");
  const transactionType = useRef("Create");
  const displayRA = useRef(false);
  const format = useRef("String");
  const fullResponse = useRef(false);
  const transactionTypes = isCase ? caseTransactionTypes : changeTransactionTypes;

  const updateJson = () => {
    updateTickets(
      ticketType.current,
      transactionType.current,
      clientName.current,
      fullResponse.current,
      displayRA.current,
      format.current
    );
  };

  const onClientNameChange = (value) => {
    clientName.current = value;
    updateJson();
  };
  const handleChange = (value, field) => {
    if (field === "ticketType") {
      ticketType.current = value;
    } else if (field === "fullResponse") {
      fullResponse.current = value;
    } else if (field === "riskAssessment") {
      displayRA.current = value;
    } else if (field === "format") {
      format.current = value;
    } else if (field === "transactionType") {
      transactionType.current = value;
    }
    updateJson();
  };

  const updateTickets = (ticketType, transactionType, clientName, fullResponse, riskAssessment, format) => {
    let newJson;

    if (ticketType === "Incident" || ticketType === "Request") {
      newJson = structuredClone(transactionTypeMap.Case[transactionType]);
    } else if (ticketType === "Change") {
      newJson = structuredClone(transactionTypeMap.Change[transactionType]);
    } else {
      newJson = structuredClone(data.create);
    }

    newJson.Body.clientName = clientName;
    newJson.Body.ticketType = ticketType;
    if (riskAssessment && transactionType === "Create") {
      newJson.Body.riskAssessment = riskAssessmentMap[format];
    }

    if (fullResponse) {
      let wrapper = data.base;
      wrapper.ReceiveMessageResponse.ReceiveMessageResult.messages[0] = newJson;
      newJson = wrapper;
    }
    const finalJson = structuredClone(newJson);
    setJson(finalJson);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 grid gap-4 h-fit">
      <h1>Read Queue</h1>
      {!isCase ? (
        <InfoTable tableHeaders={["Field", "Comment"]} tableData={tableData.change} />
      ) : (
        <InfoTable
          tableHeaders={[
            "Field",
            "On Create",
            "On Update",
            "In Changed Object",
            "On Notes",
            "On Close",
            "May be Ignored",
          ]}
          tableData={tableData.case}
          tableFooter={tableData.caseFooter}
        />
      )}
      <MethodDetails type="Request" details={{ method: "GET", endpoint: "/tickets/queue", direction: 1 }} />

      <div className="bg-slate-50 p-4 rounded shadow">
        <h2 className="text-2xl font-bold text-slate-600 mb-4">Options</h2>
        <div className="flex gap-4">
          <FormControlLabel
            control={<Checkbox onChange={(e) => handleChange(e.target.checked, "fullResponse")} />}
            label="Full Response"
          />
          <ClientNameInput onClientNameChange={onClientNameChange} />
          {isCase ? <TicketTypeInput onTicketTypeChange={handleChange} /> : null}
          <TransactionTypeSelect handleChange={handleChange} options={transactionTypes} />
          {!isCase ? (
            <RiskAssessment handleChange={handleChange} disabled={transactionType.current !== "Create"} />
          ) : null}
        </div>
      </div>
      <DisplayCode jsonData={json} heading="Response Body" />
    </div>
  );
};

export default ReadQueue;

const RiskAssessment = ({ handleChange, disabled }) => {
  const options = ["String", "JSON", "Array"];
  return (
    <>
      <FormControlLabel
        control={<Checkbox disabled={disabled} onChange={(e) => handleChange(e.target.checked, "riskAssessment")} />}
        label="Risk Assessment "
      />
      <FormControl className="w-32" disabled={disabled}>
        <InputLabel id="Format">Format</InputLabel>
        <Select
          defaultValue="String"
          labelId="Format"
          label="Format"
          onChange={(e) => handleChange(e.target.value, "format")}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
