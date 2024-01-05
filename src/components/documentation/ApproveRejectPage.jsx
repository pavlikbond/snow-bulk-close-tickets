import { useState } from "react";
import DisplayCode from "../ui/DisplayCode";
import MethodDetails from "../ui/MethodDetails";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import data from "./queueReadData.json";

const ApproveRejectPage = () => {
  const options = ["Approve", "Reject"];
  const [requestCode, setRequestCode] = useState(data.changeApprove);
  const [responseCode, setResponseCode] = useState(data.changeApproveResponse);
  const [endpoint, setEndpoint] = useState("/tickets/{Ticket Number}/approve");
  const handleChange = (value) => {
    if (value === "Approve") {
      setRequestCode(data.changeApprove);
      setResponseCode(data.changeApproveResponse);
      setEndpoint("/tickets/{Ticket Number}/approve");
    } else {
      setRequestCode(data.changeReject);
      setResponseCode(data.changeRejectResponse);
      setEndpoint("/tickets/{Ticket Number}/reject");
    }
  };
  return (
    <div className="w-full max-w-5xl mx-auto my-12 grid gap-4">
      <h1 className="text-center">Create</h1>

      <MethodDetails type="Request" details={{ method: "POST", endpoint: endpoint }} />
      <div className="rounded shadow-sm bg-slate-50 p-4">
        <h2 className="text-2xl font-bold text-slate-600 mb-4">Options</h2>
        <FormControl className="w-48">
          <InputLabel id="Approve/Reject">Approve/Reject</InputLabel>
          <Select
            defaultValue="Approve"
            labelId="Approve/Reject"
            label="Approve/Reject"
            onChange={(e) => handleChange(e.target.value)}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <DisplayCode jsonData={requestCode} heading="Request Body Example" />
      <MethodDetails type="Response" details={{ direction: 2 }} />
      <DisplayCode jsonData={responseCode} heading="Response Body Example" />
    </div>
  );
};

export default ApproveRejectPage;
