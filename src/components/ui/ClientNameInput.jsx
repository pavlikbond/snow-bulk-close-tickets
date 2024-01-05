import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import useLocalStorage from "../../hooks/useLocalStorage";
const ClientNameInput = ({ onClientNameChange }) => {
  const [clientName, setClientName] = useLocalStorage("clientName", "");

  useEffect(() => {
    onClientNameChange(clientName);
  }, []);

  const handleChange = (e) => {
    setClientName(e.target.value);
    onClientNameChange(e.target.value);
  };

  return (
    <TextField
      id="outlined-basic"
      label="Client Name"
      variant="outlined"
      onChange={(e) => handleChange(e)}
      value={clientName}
    />
  );
};

export default ClientNameInput;
