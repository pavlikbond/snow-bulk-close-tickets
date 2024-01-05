import { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const UpdateSelect = ({ onUpdateTypeChange }) => {
  const [state, setState] = useState({
    priority: true,
    shortDescription: true,
    description: true,
    status: true,
    comment: true,
    group: true,
  });

  const handleChange = (event) => {
    let newState = { ...state, [event.target.name]: event.target.checked };
    setState(newState);
    onUpdateTypeChange(newState);
  };

  return (
    <div className="bg-slate-50 rounded shadow p-4">
      <h2 className="text-xl font-bold text-slate-600 mb-4">Update Type</h2>
      <div>
        <FormControlLabel
          control={<Checkbox defaultChecked onChange={handleChange} name="priority" />}
          label="priority"
        />
        <FormControlLabel
          control={<Checkbox defaultChecked onChange={handleChange} name="shortDescription" />}
          label="short description"
        />
        <FormControlLabel
          control={<Checkbox defaultChecked onChange={handleChange} name="description" />}
          label="description"
        />
        <FormControlLabel control={<Checkbox defaultChecked onChange={handleChange} name="status" />} label="status" />
        <FormControlLabel
          control={<Checkbox defaultChecked onChange={handleChange} name="comment" />}
          label="comment"
        />
        <FormControlLabel control={<Checkbox defaultChecked onChange={handleChange} name="group" />} label="group" />
      </div>
    </div>
  );
};

export default UpdateSelect;
