import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Toast from "./ui/Toast";

const StackSetPage = () => {
  const [stackSetName, setStackSetName] = useState("");
  const [createApiKey, setCreateApiKey] = useState("true");
  const [createMapping, setCreateMapping] = useState("true");
  const [syncMapping, setSyncMapping] = useState("true");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("Success"); // ["Success", "Error"
  const handleSubmit = async () => {
    setLoading(true);
    setResponseMessage("");
    setResponseType("");
    // Check if the stackSetName is not blank
    if (stackSetName.trim() === "") {
      // Handle the case when the input is blank (show an error message, etc.)
      console.error("Stack Set Name cannot be blank");
      return;
    }

    // Perform further actions, e.g., submit the form data to a server
    let formData = {
      stackSetName,
      createApiKey: createApiKey === "true" ? true : false,
      createMapping: createMapping === "true" ? true : false,
      syncMapping: syncMapping === "true" ? true : false,
    };

    await fetch(`${process.env.REACT_APP_API_ENDPOINT}/stacksets`, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
      method: "PUT",
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Success") {
          setResponseType("Success");
          setResponseMessage("Successfully invoked Lambda");
        } else {
          setResponseType("Error");
          setResponseMessage("Something went wrong");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="mx-auto h-fit mt-20">
      <div className="bg-slate-50 rounded p-8 flex gap-6 ">
        <TextField
          id="stackSetName"
          label="Stack Set Name"
          variant="outlined"
          value={stackSetName}
          onChange={(e) => setStackSetName(e.target.value)}
        />
        <FormControl>
          <FormLabel id="createApiKey-label">Create API Key</FormLabel>
          <RadioGroup
            aria-labelledby="createApiKey-label"
            defaultValue={createApiKey}
            name="createApiKey-group"
            onChange={(e) => setCreateApiKey(e.target.value)}
            value={createApiKey}
          >
            <FormControlLabel value="true" control={<Radio />} label="True" />
            <FormControlLabel value="false" control={<Radio />} label="False" />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="createMapping-label">Create Mapping</FormLabel>
          <RadioGroup
            aria-labelledby="createMapping-label"
            defaultValue={createMapping}
            name="createMapping-group"
            onChange={(e) => setCreateMapping(e.target.value)}
            value={createMapping}
          >
            <FormControlLabel value="true" control={<Radio />} label="True" />
            <FormControlLabel value="false" control={<Radio />} label="False" />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="syncMapping-label">Sync Mapping</FormLabel>
          <RadioGroup
            aria-labelledby="syncMapping-label"
            defaultValue={syncMapping}
            name="syncMapping-group"
            onChange={(e) => setSyncMapping(e.target.value)}
            value={syncMapping}
          >
            <FormControlLabel value="true" control={<Radio />} label="True" />
            <FormControlLabel value="false" control={<Radio />} label="False" />
          </RadioGroup>
        </FormControl>
        <Box>
          <Button variant="contained" onClick={handleSubmit} disabled={stackSetName.trim().length === 0 || loading}>
            {loading && <CircularProgress size={24} className="mr-2" />}
            Submit
          </Button>
        </Box>
      </div>
      {responseMessage && (
        <div className="mt-4">
          <Toast type={responseType} message={responseMessage} />
        </div>
      )}
    </div>
  );
};

export default StackSetPage;
