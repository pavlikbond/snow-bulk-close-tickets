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

const GroupMappings = ({ data }) => {
    const notInitialRender = useRef(false);
    const [loading, setLoading] = useState(true);
    const [companyData, setCompanyData] = useState({});
    const [company, setCompany] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [value, setValue] = useState(options()[0]);
    const [inputValue, setInputValue] = useState("");
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        if (Object.keys(data).length) {
            setCompanyData(data);
            let firstCompany = Object.keys(data).sort()[0];
            setCompany(data[firstCompany]);
            setValue(firstCompany);
            setInputValue(firstCompany);
            setLoading(false);
        }
    }, [data]);

    function options() {
        return Object.keys(companyData).sort();
    }

    function printStuff() {
        console.log(company);
        console.log(value);
    }

    return (
        <div className="mx-auto mt-8 flex flex-col items-center gap-4">
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
                                    <div className="rounded shadow my-2 p-3 bg-slate-100">
                                        <div className="text-xl">
                                            <span className="font-bold">Table Name:</span> {mapping.tableName}
                                        </div>
                                    </div>
                                    {mapping.mappings.length === 1 && <Table tableData={mapping.mappings[0]}></Table>}
                                    {mapping.mappings.length > 1 && (
                                        <SimpleAccordion companyMappings={mapping.mappings}></SimpleAccordion>
                                    )}
                                </TabPanel>
                            );
                        })}
                </Box>
            )}
        </div>
    );
};

const Table = ({ tableData }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table table-compact w-full">
                <thead>
                    <tr>
                        <th></th>
                        <th>Client Value</th>
                        <th>Ensono Value</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.mapping.groups.map((mapping, index) => {
                        return (
                            <tr key={index} className="hover">
                                <td>{index + 1}</td>
                                <td>{mapping.clientVal ?? "Default"}</td>
                                <td>{mapping.ensonoVal ?? "Default"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

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

function SimpleAccordion({ companyMappings }) {
    //console.log(companyMappings);
    companyMappings = companyMappings.sort((a, b) => {
        if (a.Company > b.Company) return 1;
        return -1;
    });
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
                            <Table tableData={mapping}></Table>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    );
}

export default GroupMappings;
