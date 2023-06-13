import { useEffect, useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import ErrorIcon from "@mui/icons-material/Error";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

const GroupFinder = ({ data }) => {
  const [companyData, setCompanyData] = useState([]);
  const [input, setInput] = useState("");
  const [foundResults, setFoundResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [waitingForData, setWaitingForData] = useState(true);
  const [exactSearch, setExactSearch] = useState(true);
  useEffect(() => {
    if (data.length) {
      setCompanyData(data);
      setWaitingForData(false);
    }
  }, [data]);

  const findMappedGroup = () => {
    console.log(exactSearch);
    setNotFound(false);
    setLoading(true);
    setFoundResults([]);
    let results = [];
    console.log(companyData);
    for (let company of companyData) {
      for (let data of company.tableData) {
        try {
          for (let allMapping of data.mappings) {
            for (let groupMapping of allMapping.mapping.groups) {
              if (exactSearch) {
                if (groupMapping.ensonoVal === input.trim()) {
                  let result = {
                    table: data.tableName,
                    companyName: allMapping.Company,
                    tableName: company.name,
                    group: groupMapping.ensonoVal,
                  };
                  results.push(result);
                }
              } else {
                if (groupMapping.ensonoVal?.includes(input.trim())) {
                  let result = {
                    table: data.tableName,
                    companyName: allMapping.Company,
                    tableName: company.name,
                    group: groupMapping.ensonoVal,
                  };
                  results.push(result);
                }
              }
            }
          }
        } catch (error) {
          console.log(company);
        }
      }
    }
    setTimeout(() => {
      if (results.length === 0) {
        setNotFound(true);
      } else {
        setFoundResults([...results]);
      }
      setLoading(false);
    }, 1000);
  };

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Table,Company,TableName,Group\n`;
    foundResults.forEach((result) => {
      csvContent += `${result.table},${result.companyName},${result.tableName},${result.group}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${input} Group_Results.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
  };

  const handleSwitchChange = () => {
    setExactSearch(!exactSearch);
  };

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      findMappedGroup();
    }
  };

  return (
    <div className="my-10 flex flex-col gap-4 mx-auto">
      {waitingForData && <CircularProgress />}
      {!waitingForData && (
        <div className="flex gap-4 justify-center rounded shadow bg-slate-50 p-6">
          <OutlinedInput
            placeholder="Enter Group Name"
            autoFocus
            className="bg-white"
            variant="outlined"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            value={input}
            onKeyDown={keyPress}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setInput("");
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            }
          />
          <div className="flex items-center">
            <IOSSwitch onChange={handleSwitchChange} sx={{ m: 1 }} defaultChecked />
            {exactSearch ? (
              <span className="text-slate-600 text-lg font-semibold">Exact Match</span>
            ) : (
              <span className="text-slate-600 text-lg font-semibold">Partial Match</span>
            )}
          </div>
          <Button
            sx={{ padding: "0 40px", fontSize: "1rem" }}
            variant="contained"
            onClick={findMappedGroup}
            disabled={loading || !input.trim().length}
          >
            {loading && <CircularProgress className="mr-2" size={20} color="inherit" />}
            Find
          </Button>
          <Button onClick={downloadCSV} variant="outlined" disabled={!foundResults.length}>
            Download CSV
          </Button>
        </div>
      )}
      {foundResults.length > 0 && (
        <table className="table table-compact w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="w-[10%]"></th>
              <th className="px-4">Table Name</th>
              <th className="px-4 ">SNOW Company Name</th>
              <th className="px-4 ">Dynamo DB Company Name</th>
              <th className="px-4">Group</th>
            </tr>
          </thead>
          <tbody>
            {foundResults.map((result, index) => {
              return (
                <tr key={index} className="hover">
                  <td className="text-slate-700 pr-5">{index + 1}</td>
                  <td className="text-slate-700 font-semibold px-4">{result.table}</td>
                  <td className="text-slate-700 font-semibold px-4">{result.companyName}</td>
                  <td className="text-slate-700 font-semibold px-4">{result.tableName}</td>
                  <td className="text-slate-700 font-semibold px-4  max-w-[300px] truncate">{result.group}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {notFound && (
        <div className="relative flex items-center p-2 py-1 rounded-md bg-white shadow-sm br border-l-8 border-amber-400">
          <ErrorIcon className="mr-2 text-amber-400" fontSize="large" />
          <div className="flex flex-col">
            <span className="text-slate-600 text-xl font-semibold">Info</span>
            <span className="font-medium text-slate-500 text-sm">Group Not Found</span>
          </div>
        </div>
      )}
    </div>
  );
};

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#338ecf",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#338ecf",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#338ecf",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

export default GroupFinder;
