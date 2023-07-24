import { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { LoremIpsum } from "lorem-ipsum";
// import Checkbox from "@mui/material/Checkbox";
// import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { IoCopy } from "react-icons/io5";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 12,
    min: 4,
  },
});

const EchoCreator = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const [company, setCompany] = useState({});
  const [version, setVersion] = useState("");
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [ticketType, setTicketType] = useState("Incident");
  const [dSpecialChars, setDSpecialChars] = useState(true);
  const [sDSpecialChars, setSDSpecialChars] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [group, setGroup] = useState("CS - 1st Line");

  const onChangeQuantity = (event) => {
    if (event.target.value <= 50 && event.target.value >= 1) {
      setQuantity(event.target.value);
    }
  };

  const handleCheckboxDescription = (event) => {
    setDSpecialChars(event.target.checked);
  };
  const handleCheckboxShortDescription = (event) => {
    setSDSpecialChars(event.target.checked);
  };

  const handleChangeVersion = (event, newVersion) => {
    if (newVersion !== null) {
      setVersion(newVersion);
      setSelectedMapping(company[newVersion]);
      setGroup("CS - 1st Line");
    }
  };

  const handleChangeTicketType = (event, newTicketType) => {
    if (newTicketType !== null) {
      setTicketType(newTicketType);
    }
  };

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
  };

  useEffect(() => {
    if (data.length) {
      setCompanyData(data);
      setLoading(false);
      let companyList = getListOfCompanies();
      setCompanyList(companyList);
      setCompany(companyList[0]);
      let version = companyList[0].V1 ? "V1" : "V2";
      setVersion(version);
      setSelectedMapping(companyList[0][version]);
    }
  }, [data]);

  function generateTicket() {
    setResponseData("");
    setWaiting(true);
    let specChars = '!@#$%^&*/???()|[]{}\\<//>|"//\\"&\'/``%``';
    let shortDescription = sDSpecialChars ? specChars + lorem.generateSentences(2) : lorem.generateSentences(2);
    let description = dSpecialChars ? specChars + lorem.generateSentences(5) : lorem.generateSentences(5);
    let apiPayload = {
      apiName: selectedMapping.apiName,
      apiKeyID: selectedMapping.APIKeyId,
      method: "POST",
      quantity: quantity,
      version: version,
      ticketPayload: {
        clientName: company.Company,
        ticketType: ticketType,
        short_description: "Short Description Test ", //shortDescription,
        shortDescription: "Short Description Test ", // shortDescription,
        description: "Long Description Test ", //description,
        priority: "1",
        group: group,
        //clientTicketNumber: Date.now(),
      },
    };
    console.log(apiPayload);
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/tickets`, {
      method: "PUT",
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
      body: JSON.stringify(apiPayload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setWaiting(false);
        if (data.message) {
          setResponseData([{ Response: data.message }]);
          return;
        }
        setResponseData(data);
      })
      .catch((err) => {
        console.log(err);
        setWaiting(false);
        setResponseData([{ Response: "Error has occured, try again" }]);
      });
  }

  let onAutocompleteChange = (event, newValue) => {
    if (newValue) {
      setCompany(companyList.find((item) => item.Company === newValue));
      let version = companyList.find((item) => item.Company === newValue).V1 ? "V1" : "V2";
      setVersion(version);
      setSelectedMapping(companyList.find((item) => item.Company === newValue)[version]);
      setGroup("CS - 1st Line");
    }
  };

  let getListOfCompanies = () => {
    let companyList = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === "Resolution Life Group") continue;
      for (let item of data[i].tableData) {
        if (item.environment !== "dev") continue;
        companyList.push(
          ...item.mappings.map((mapping) => {
            return {
              ...mapping,
              apiName: data[i].apiName,
              APIKeyId: data[i].APIKeyId,
              tableCompanyName: data[i].name,
              tableName: item.tableName,
              version: item.version,
            };
          })
        );
      }
    }
    //create a new list combining combining object where Company is the same
    let newList = [];
    for (let i = 0; i < companyList.length; i++) {
      let company = companyList[i];
      let index = newList.findIndex((item) => {
        return item.Company === company.Company;
      });
      if (index === -1) {
        let obj = { Company: company.Company };
        obj[company.version] = company;
        newList.push(obj);
      } else {
        newList[index][company.version] = company;
      }
    }
    console.log(newList);
    return newList;
  };

  return (
    <div className="mx-auto mt-20 flex flex-col gap-8 pl-[128px]">
      <h2 className="text-center text-2xl font-bold">Generate tickets to go to the client queue (dev/test)</h2>
      <div className="bg-slate-100 rounded shadow-md p-6 flex flex-col gap-6">
        {loading ? (
          <>
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
            <Box className="flex flex-col gap-3">
              <Skeleton variant="rounded" width={350} height={50} />
              <Skeleton variant="rounded" width={350} height={50} />
              <Skeleton variant="rounded" width={350} height={50} />
            </Box>
          </>
        ) : (
          <>
            <div className="flex gap-4">
              <Autocomplete
                value={company.Company}
                onChange={onAutocompleteChange}
                options={companyList.map((option) => option.Company)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Company" />}
              />

              <ToggleButtonGroup color="primary" value={version} exclusive onChange={handleChangeVersion}>
                {Object.values(company).map((value, index) => {
                  if (typeof value === "string") return null;
                  return (
                    <ToggleButton key={value.version} value={value.version}>
                      SNOW {value.version}
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>

              <ToggleButtonGroup color="primary" value={ticketType} exclusive onChange={handleChangeTicketType}>
                <ToggleButton value="Incident">Incident</ToggleButton>
                <ToggleButton value="Request">Request</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className="flex gap-4">
              {/* <Card variant="outlined w-[75%]">
                <h2 className="text-center text-xl py-3">Add special characters</h2>
                <div className="flex">
                  <div>
                    <Checkbox
                      onChange={handleCheckboxDescription}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      defaultChecked
                    />
                    <span>Description</span>
                  </div>
                  <div>
                    <Checkbox
                      onChange={handleCheckboxShortDescription}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      defaultChecked
                    />
                    <span>Short Description</span>
                  </div>
                </div>
              </Card> */}
              {/* <FormControl className="flex-1">
                <InputLabel id="group-select">Group</InputLabel>
                <Select
                  labelId="group-select"
                  id="group-select"
                  value={group}
                  label="Group"
                  onChange={handleGroupChange}
                >
                  {selectedMapping.mapping.groups.map((group, index) => {
                    if (group.ensonoVal) {
                      return (
                        <MenuItem key={index} value={group.ensonoVal}>
                          {group.ensonoVal}
                        </MenuItem>
                      );
                    }
                  })}
                </Select>
              </FormControl> */}
              <TextField
                min={1}
                max={50}
                type="number"
                name="Quantity"
                label="Quantity"
                variant="filled"
                value={quantity}
                onChange={onChangeQuantity}
                className="flex-1"
              />
              <Button
                className="min-w-32 w-fit flex-1"
                variant="contained"
                onClick={generateTicket}
                disabled={waiting || Object.keys(company).length === 0}
              >
                {waiting && (
                  <Box className="pr-3" sx={{ display: "flex" }}>
                    <CircularProgress color="secondary" size={"1.5rem"} />
                  </Box>
                )}
                Generate
              </Button>
            </div>
          </>
        )}
      </div>
      {responseData.length > 0 && <Response response={responseData}></Response>}
    </div>
  );
};

const Response = ({ response }) => {
  for (let item of response) {
    if (item.Response.includes("e-")) {
      item.Response = item.Response.substring(2);
    }
  }

  return (
    <div className="bg-slate-100 rounded shadow-md p-6 flex flex-col">
      <h2 className="text-3xl text-center text-slate-700 font-bold mb-2">Response</h2>
      {response.map((item, index) => {
        return (
          <div
            key={index}
            className="flex justify-between hover:bg-slate-200 transition-all p-3 rounded-md duration-300"
          >
            <p className="text-lg font-semibold text-slate-600">{item.Response}</p>
            <CopyIcon text={item.Response}></CopyIcon>
          </div>
        );
      })}
    </div>
  );
};

const CopyIcon = ({ text }) => {
  let [clicked, setClicked] = useState(false);

  function handleClick() {
    //console.log(text);
    setClicked(true);
    navigator.clipboard.writeText(text);
  }

  return (
    <div
      className={`cursor-pointer hover:scale-105 transition-all group relative`}
      onClick={handleClick}
      onMouseLeave={() => {
        setClicked(false);
      }}
    >
      <IoCopy size={28}></IoCopy>
      <span
        className={`absolute w-auto p-1 px-3 left-8 min-w-max top-0
        rounded-md shadow-md tracking-wider
        text-white bg-gray-700 scale-0
        transition-all duration-100 origin-left group-hover:scale-100 ${clicked && "bg-emerald-400"}`}
      >
        {clicked ? "Copied" : "Copy"}
      </span>
    </div>
  );
};

export default EchoCreator;
