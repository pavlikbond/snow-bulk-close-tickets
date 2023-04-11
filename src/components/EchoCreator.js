import { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { LoremIpsum } from "lorem-ipsum";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { IoCopy } from "react-icons/io5";

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
    const [company, setCompany] = useState([]);
    const [value, setValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [version, setVersion] = useState("SNOW V1");
    const [ticketType, setTicketType] = useState("Incident");
    const [dSpecialChars, setDSpecialChars] = useState(true);
    const [sDSpecialChars, setSDSpecialChars] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [waiting, setWaiting] = useState(false);
    const [responseData, setResponseData] = useState([]);

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
        }
    };

    const handleChangeTicketType = (event, newTicketType) => {
        if (newTicketType !== null) {
            setTicketType(newTicketType);
        }
    };
    useEffect(() => {
        if (Object.keys(data).length) {
            setCompanyData(data);
            setLoading(false);
            formatCompanyList();
        }
    }, [data]);

    let handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        setValue(newInputValue);
        let newCompany = companyList.find((company) => company.companyName === newInputValue) || {};
        setCompany(newCompany);
        setVersion(newCompany?.isMultiVersion ? "SNOW V1" : newCompany.version);
    };

    function formatCompanyList() {
        let skip = [];
        let allCompanies = [];
        for (const [kName, value] of Object.entries(data)) {
            if (skip.includes(kName)) {
                continue;
            }
            for (let mapping of value) {
                if (mapping.environment === "dev") {
                    //console.log(mapping);
                    for (let item of mapping.mappings) {
                        //allCompanies.push(`${item.Company} ${mapping.version} ${mapping.tableName}`);
                        let company = {
                            companyName: item.Company,
                            apiName: mapping.apiName,
                            version: "SNOW " + mapping.version,
                            groups: item.mapping.groups,
                            keyName: kName,
                            table: mapping.tableName,
                            isMultiVersion: false,
                            apiKeyID: mapping.key,
                        };

                        allCompanies.push(company);
                    }
                }
            }
        }
        //puts them in alphabetic order based on company name
        allCompanies = allCompanies.sort((a, b) => {
            if (a.companyName.toUpperCase() > b.companyName.toUpperCase()) return 1;
            else return -1;
        });

        //filters out duplicates if company name and table name are same
        allCompanies = allCompanies.filter(
            (value, index, self) =>
                index === self.findIndex((t) => t.companyName === value.companyName && t.table === value.table)
        );

        //combine v1 v2 clients
        for (let i = 0; i < allCompanies.length; i++) {
            if (i && allCompanies[i].companyName === allCompanies[i - 1].companyName) {
                let c1 = allCompanies[i - 1];
                let c2 = allCompanies[i];

                let newRecord = {
                    companyName: c1.companyName,
                    isMultiVersion: true,
                    apiName: c1.apiName,
                    apiKeyID: c1.apiKeyID,
                    v1: c1.version === "SNOW V1" ? c1 : c2,
                    v2: c1.version === "SNOW V2" ? c1 : c2,
                };

                allCompanies.splice(i - 1, 2, newRecord);
            }
        }
        setCompanyList(allCompanies);
        setValue(allCompanies[0].companyName);
        setInputValue(allCompanies[0].companyName);
        setCompany(allCompanies[0]);
        console.log(allCompanies);
    }

    function generateTicket() {
        setResponseData("");
        setWaiting(true);
        let specChars = '!@#$%^&*/???()|[]{}\\<//>|""&\'/``%``';
        let shortDescription = sDSpecialChars ? specChars + lorem.generateSentences(2) : lorem.generateSentences(2);
        let description = dSpecialChars ? specChars + lorem.generateSentences(5) : lorem.generateSentences(5);
        let apiPayload = {
            apiName: company.apiName,
            apiKeyID: company.apiKeyID,
            method: "POST",
            quantity: quantity,
            version: version,
            ticketPayload: {
                clientName: company.companyName,
                ticketType: ticketType,
                short_description: "test short desc", //shortDescription,
                shortDescription: "test short desc", // shortDescription,
                description: "test long desc", //description,
                priority: "1",
                group: "client.servicedesk",
                clientTicketNumber: Date.now(),
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
                                freeSolo={true}
                                forcePopupIcon={true}
                                value={value}
                                inputValue={inputValue}
                                onInputChange={handleInputChange}
                                options={companyList.map((company) => company.companyName)}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Company" />}
                            />

                            {company.isMultiVersion ? (
                                <ToggleButtonGroup
                                    color="primary"
                                    value={version}
                                    exclusive
                                    onChange={handleChangeVersion}
                                >
                                    <ToggleButton value="SNOW V1">SNOW V1</ToggleButton>
                                    <ToggleButton value="SNOW V2">SNOW V2</ToggleButton>
                                </ToggleButtonGroup>
                            ) : (
                                <ToggleButtonGroup
                                    color="primary"
                                    value={version}
                                    exclusive
                                    onChange={handleChangeVersion}
                                >
                                    <ToggleButton value={company.version || ""}>
                                        {company.version || "SNOW V1"}
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            )}
                            <ToggleButtonGroup
                                color="primary"
                                value={ticketType}
                                exclusive
                                onChange={handleChangeTicketType}
                            >
                                <ToggleButton value="Incident">Incident</ToggleButton>
                                <ToggleButton value="Request">Request</ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <div className="flex gap-4">
                            <Card variant="outlined w-[75%]">
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
                            </Card>
                            <TextField
                                min={1}
                                max={50}
                                type="number"
                                name="Quantity"
                                label="Quantity"
                                variant="filled"
                                value={quantity}
                                onChange={onChangeQuantity}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                className="min-w-32 w-fit"
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
