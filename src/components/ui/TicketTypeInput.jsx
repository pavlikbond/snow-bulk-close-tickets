import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const TicketTypeInput = ({ onTicketTypeChange, ticketTypeOptions = ["Incident", "Request"] }) => {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="ticket-type">Ticket Type</InputLabel>
        <Select
          defaultValue={ticketTypeOptions[0]}
          labelId="ticket-type"
          label="Ticket Type"
          onChange={(e) => onTicketTypeChange(e.target.value, "ticketType")}
        >
          {ticketTypeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TicketTypeInput;
