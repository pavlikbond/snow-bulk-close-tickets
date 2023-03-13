import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";

const GroupMappings = ({ data }) => {
    const [loading, setLoading] = useState(true);
    const [companyData, setCompanyData] = useState({});
    const [company, setCompany] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [value, setValue] = useState(options()[0]);
    const [inputValue, setInputValue] = useState("");
    const csvData = useRef([]);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        if (Object.keys(data).length) {
            setCompanyData(data);
            let firstCompany = Object.keys(data).sort().at(0);
            setCompany(data[firstCompany]);
            setValue(firstCompany);
            setInputValue(firstCompany);
            setLoading(false);
        }
    }, [data]);

    const downloadCSV = (responses) => {
        //turns the responses array of objects into a CSV string
        if (csvData.current.length === 1) {
            if (csvData.current[0].name === "Placeholder") {
                csvData.current[0].name = inputValue;
            }
        }

        for (let doc of csvData.current) {
            createCSV(doc.groups, doc.name);
        }

        function createCSV(groupMapping, name) {
            const csvString = [
                ["Ensono Group", "Client Group"], //headers
                ...groupMapping.map((group) => [group.ensonoVal || "Default", group.clientVal || "Default"]),
            ]
                .map((e) => e.join(","))
                .join("\n");

            //add data type to beginning of string
            let csvContent = "data:text/csv;charset=utf-8," + csvString;
            //generate an invisible a tag
            let encodedUri = encodeURI(csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${name}_${company[tabValue].environment.toUpperCase()}_mapping.csv`); //put any name you want
            document.body.appendChild(link); // Required for FF

            link.click();
        }
    };

    function options() {
        return Object.keys(companyData).sort();
    }

    function isV2(scan) {
        return scan.version === "V2";
    }

    function displayImpactUrgency(company) {
        return !company.mapping.simpleInboundPriority;
    }

    return (
        <div className="mx-auto mt-8 flex flex-col items-center gap-4">
            <div className="flex gap-4">
                <Autocomplete
                    value={value || null}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        setCompany(companyData[newValue] || []);
                        setTabValue(0);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    id="controllable-states-demo"
                    options={options()}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Company" />}
                />
                <Button
                    className="min-w-32 w-fit"
                    variant="contained"
                    disabled={value ? false : true}
                    onClick={downloadCSV}
                >
                    Download CSV
                </Button>
            </div>
            {loading && (
                <>
                    <Box sx={{ display: "flex" }}>
                        <CircularProgress />
                    </Box>
                    <Box>
                        {Array.from(Array(18).keys()).map((skeleton, index) => {
                            return (
                                <Skeleton
                                    key={index}
                                    animation="wave"
                                    variant="rounded"
                                    width={550}
                                    height={35}
                                    sx={{ mb: 0.5 }}
                                />
                            );
                        })}
                    </Box>
                </>
            )}
            {!loading && (
                <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example" centered>
                            {company.map((mapping, index) => {
                                return <Tab key={index} label={mapping.environment} {...a11yProps(0)} />;
                            })}
                        </Tabs>
                    </Box>
                    {company.length > 0 &&
                        company.map((mapping, index) => {
                            return (
                                <TabPanel value={tabValue} index={index} key={index}>
                                    <div className="mb-2 p-3">
                                        <div className="text-xl">
                                            <span className="font-semibold">Mapping table:</span> {mapping.tableName}
                                        </div>
                                    </div>
                                    {mapping.mappings.length === 1 && (
                                        <div className="flex justify-center gap-10">
                                            <Table data={mapping.mappings[0].mapping.groups} csvData={csvData}></Table>
                                            {isV2(mapping) && displayImpactUrgency(mapping.mappings[0]) && (
                                                <ImpactUrgency data={mapping.mappings[0].mapping}></ImpactUrgency>
                                            )}
                                        </div>
                                    )}
                                    {mapping.mappings.length > 1 && (
                                        <SimpleAccordion csvData={csvData} allMapping={mapping}></SimpleAccordion>
                                    )}
                                </TabPanel>
                            );
                        })}
                </Box>
            )}
        </div>
    );
};

const Table = ({ data, csvData, title = "Groups", numbered = true, multi = false }) => {
    try {
        if (!multi) {
            csvData.current = [{ groups: data, name: "Placeholder" }];
        }
    } catch (error) {
        console.log(error);
    }
    return (
        <div className="overflow-x-auto">
            <h2 className="text-center text-2xl py-2 text-white font-semibold bg-slate-600">{title}</h2>
            <table className="table table-compact w-full">
                <thead>
                    <tr>
                        {numbered && <th></th>}
                        <th className="pl-5">Ensono Value</th>
                        <th className="pr-5">Client Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((mapping, index) => {
                        return (
                            <tr key={index} className="hover">
                                {numbered && <td className="text-slate-700">{index + 1}</td>}
                                <td className="text-slate-700 font-semibold pl-5">{mapping.ensonoVal ?? "Default"}</td>
                                <td className="text-slate-700 font-semibold">{mapping.clientVal ?? "Default"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

function ImpactUrgency({ data }) {
    return (
        <div className="flex flex-col gap-4">
            <Table data={data.impact} title={"Impact"} numbered={false}></Table>
            <Table data={data.urgency} title={"Urgency"} numbered={false}></Table>
        </div>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component={"span"}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function SimpleAccordion({ allMapping, csvData }) {
    function isV2(scan) {
        return allMapping.version === "V2";
    }

    function displayImpactUrgency(company) {
        return !company.mapping.simpleInboundPriority;
    }
    let companyMappings = allMapping.mappings.sort((a, b) => {
        if (a.Company > b.Company) return 1;
        return -1;
    });

    let csvRes = companyMappings.map((mapping) => {
        return { groups: mapping.mapping.groups, name: mapping.Company };
    });

    csvData.current = csvRes;

    return (
        <div>
            {companyMappings.map((mapping, index) => {
                return (
                    <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>{mapping.Company}</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="bg-slate-100">
                            <div className="flex gap-10 justify-center">
                                <Table data={mapping.mapping.groups} csvData={csvData} multi={true}></Table>
                                {isV2(mapping) && displayImpactUrgency(mapping) && (
                                    <ImpactUrgency data={mapping.mapping}></ImpactUrgency>
                                )}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    );
}

export default GroupMappings;
