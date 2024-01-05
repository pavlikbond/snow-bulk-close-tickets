import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const TransactionTypeSelect = ({ handleChange, options }) => {
  return (
    <FormControl className="w-48">
      <InputLabel id="Transaction Type">Transaction Type</InputLabel>
      <Select
        defaultValue="Create"
        labelId="Transaction Type"
        label="Transaction Type"
        onChange={(e) => handleChange(e.target.value, "transactionType")}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TransactionTypeSelect;
