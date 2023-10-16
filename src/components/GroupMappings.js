import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useUserRole } from "./UserContext";
const GroupMappings = ({ data }) => {
  const [value, setValue] = useState(1);
  const [companyData, setCompanyData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDev, setIsDev] = useState(false);
  const role = useUserRole();

  useEffect(() => {
    setIsDev(role === "developer");
  }, [role]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedMapping(selectedCompany.tableData[newValue]);
  };

  useEffect(() => {
    const setDefaults = () => {
      setLoading(false);
      setValue(0);
      setCompanyData(data);
      setSelectedCompany(data[0]);
      setSelectedMapping(data[0].tableData[0]);
    };

    if (data.length) {
      const retrievedCompany = JSON.parse(sessionStorage.getItem("selectedCompany"));
      if (retrievedCompany) {
        //check data to see if the selected company is still there
        const company = data.find((company) => company.name === retrievedCompany.name);
        if (company) {
          setLoading(false);
          setCompanyData(data);
          setSelectedCompany(company);
          setSelectedMapping(company.tableData[0]);
          setValue(0);
        } else {
          setDefaults();
        }
      } else {
        setDefaults();
      }
    }
  }, [data]);

  let onAutocompleteChange = (event, newValue) => {
    if (newValue) {
      const selectedCompany = companyData.find((company) => company.name === newValue);
      setSelectedCompany(selectedCompany);
      setSelectedMapping(selectedCompany.tableData[0]);
      setValue(0);
      saveToLocalStorage(selectedCompany);
    }
  };

  const saveToLocalStorage = (company) => {
    if (selectedCompany) {
      sessionStorage.setItem("selectedCompany", JSON.stringify(company));
    }
  };

  const downloadCSV = () => {
    for (let doc of selectedMapping.mappings) {
      //turns the responses array of objects into a CSV string
      const csvString = [
        ["Ensono Group", "Client Group"], //headers
        ...doc.mapping.groups.map((group) => [group.ensonoVal || "Default", group.clientVal || "Default"]),
      ]
        .map((e) => e.join(","))
        .join("\n");
      //download the CSV file
      const a = document.createElement("a");
      a.href = "data:attachment/csv," + encodeURIComponent(csvString);
      a.target = "_blank";
      a.download = `${doc.Company} ${selectedMapping.environment} ${selectedMapping.version}.csv`;
      document.body.appendChild(a);
      a.click();
    }
  };

  return (
    <div className="bg-slate-50 rounded-lg shadow border p-6 mx-auto mt-10">
      {loading && <MySkeleton></MySkeleton>}
      {!loading && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 mx-auto">
            <Autocomplete
              value={selectedCompany.name}
              onChange={onAutocompleteChange}
              options={companyData.map((company) => company.name)}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Company" />}
            />
            <Button className="min-w-32 w-fit" variant="contained" onClick={downloadCSV}>
              Download CSV
            </Button>
          </div>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange} centered>
              {selectedCompany.tableData.map((tableDataItem, index) => {
                return (
                  <Tab key={index} label={tableDataItem.environment + " " + tableDataItem.version} value={index} />
                );
              })}
            </Tabs>
          </Box>
          <div className="">
            <div className="text-xl py-2">
              Table Name:{" "}
              {isDev ? (
                <Link
                  href={`https://us-west-1.console.aws.amazon.com/dynamodbv2/home?region=us-west-1#edit-item?itemMode=2&pk=${selectedCompany.APIKeyId}&route=ROUTE_ITEM_EXPLORER&sk=&table=${selectedMapping.tableName}`}
                  rel="noopener"
                  target="_blank"
                >
                  {selectedMapping.tableName}
                </Link>
              ) : (
                <span className="font-semibold"> {selectedMapping.tableName}</span>
              )}
            </div>
            <MyAccordion data={selectedMapping.mappings} />
          </div>
        </div>
      )}
    </div>
  );
};

const MyAccordion = ({ data }) => {
  return data.map((mapping, index) => {
    return (
      <div key={index} className="my-4">
        <Accordion defaultExpanded={index === 0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>{mapping.Company}</AccordionSummary>
          <AccordionDetails>
            <Table data={mapping}></Table>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  });
};

const Table = ({ data, numbered = true }) => {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-center text-xl py-1 text-white font-semibold bg-slate-600">Groups</h2>
      <table className="table table-compact w-full min-w-[800px]">
        <thead>
          <tr>
            {numbered && <th className="w-[10%]"></th>}
            <th className="pl-5 w-[45%]">Ensono Value</th>
            <th className="pr-5 w-[45%]">Client Value</th>
          </tr>
        </thead>
        <tbody>
          {data.mapping.groups.map((mapping, index) => {
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

const MySkeleton = () => {
  return (
    <>
      <Box className="flex justify-center my-4">
        <CircularProgress />
      </Box>
      <Box>
        {Array.from(Array(18).keys()).map((skeleton, index) => {
          return <Skeleton key={index} animation="wave" variant="rounded" width={550} height={35} sx={{ mb: 0.5 }} />;
        })}
      </Box>
    </>
  );
};

export default GroupMappings;
