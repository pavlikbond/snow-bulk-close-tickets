import { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import ErrorIcon from "@mui/icons-material/Error";
import CodeEditor from "@uiw/react-textarea-code-editor";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
const MappingGenerator = ({}) => {
    const [environment, setEnvironment] = useState("envisiontest.service-now.com");
    const [name, setName] = useState("ColumnIT");
    const [data, setData] = useState({});
    const [dataString, setDataString] = useState("");
    const [errors, setErrors] = useState([]);
    const [info, setInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const inputRef = useRef();
    // const [apiKey, setApiKey] = useState("");
    // const [queue, setQueue] = useState("");
    const handleChange = (event) => {
        setEnvironment(event.target.value);
    };

    const getMapping = () => {
        setErrors([]);
        setInfo([]);
        setData({});
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/getmapping?hostname=${environment}&company=${name}`, {
            headers: {
                "X-Api-Key": process.env.REACT_APP_API_KEY,
            },
        })
            .then((response) => response.json())
            .then((response) => {
                setLoading(false);
                console.log(response);
                if (response.mapObject) {
                    setData(response.mapObject);
                    setDataString(JSON.stringify(response.mapObject, null, 6));
                }
                if (response.errors.length) {
                    setErrors(response.errors);
                }
                if (response.info.length) {
                    setInfo(response.info);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                setErrors(["Error connecting to API"]);
            });
    };

    // let updateAPIKey = (e) => {
    //     setApiKey(e.target.value);
    //     data.APIKeyId = e.target.value;
    //     setDataString(JSON.stringify(data, null, 6));
    // };

    // let updateQueue = (e) => {
    //     setQueue(e.target.value);
    //     data.Queue = e.target.value;
    //     setDataString(JSON.stringify(data, null, 6));
    // };

    let handleCopy = () => {
        try {
            let toCopy = JSON.parse(dataString);
            navigator.clipboard.writeText(JSON.stringify(toCopy, null, 2));
        } catch (error) {
            setInfo([...info, "FYI, not valid JSON"]);
            navigator.clipboard.writeText(dataString);
        }

        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    let beautify = () => {
        try {
            let toCopy = JSON.parse(dataString);
            setDataString(JSON.stringify(toCopy, null, 6));
        } catch (error) {
            setInfo([...info, "FYI, not valid JSON"]);
        }
    };

    return (
        <div className="mx-auto my-8 flex flex-col gap-3">
            <div className=" flex gap-2">
                <Box sx={{ minWidth: 120, background: "white", borderRadius: "5px" }}>
                    <FormControl sx={{ m: 0, width: "25ch" }} variant="outlined" error={!name}>
                        <InputLabel>Company SNOW Name</InputLabel>
                        <OutlinedInput
                            inputRef={inputRef}
                            type="text"
                            spellCheck="false"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => {
                                            setName("");
                                            inputRef.current.focus();
                                        }}
                                        edge="end"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Company SNOW Name"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            value={name}
                        />
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 120, background: "white", borderRadius: "5px" }}>
                    <FormControl fullWidth>
                        <InputLabel id="environment-dropdown">Environment</InputLabel>
                        <Select
                            labelId="environment-dropdown"
                            value={environment}
                            label="Environment"
                            onChange={handleChange}
                        >
                            <MenuItem value={"envisiontest.service-now.com"}>envisiontest.service-now.com</MenuItem>
                            <MenuItem value={"envision.service-now.com"}>envision.service-now.com</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button className="w-32" variant="contained" onClick={getMapping} disabled={loading || !name}>
                    {loading && <CircularProgress size={20} className="mr-2" />}
                    Start
                </Button>
            </div>
            {(errors.length > 0 || info.length > 0) && (
                <div className="flex flex-col gap-1">
                    {errors.map((error, index) => {
                        return (
                            <div
                                className="relative flex items-center p-2 py-1 rounded-md bg-white shadow-sm br border-l-8 border-red-400"
                                key={index}
                            >
                                <ErrorIcon className="mr-2 text-red-400" fontSize="large" />
                                <div className="flex flex-col">
                                    <span className="text-slate-600 text-xl font-semibold">Error</span>
                                    <span className="font-medium text-slate-500 text-sm">{error}</span>
                                </div>
                                <div className="inset-center">
                                    <IconButton
                                        onClick={() => {
                                            setErrors(errors.filter((_, i) => i !== index));
                                        }}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </div>
                            </div>
                        );
                    })}
                    {info.map((error, index) => {
                        return (
                            <div
                                className="relative flex items-center p-2 py-1 rounded-md bg-white shadow-sm br border-l-8 border-amber-400"
                                key={index}
                            >
                                <ErrorIcon className="mr-2 text-amber-400" fontSize="large" />
                                <div className="flex flex-col">
                                    <span className="text-slate-600 text-xl font-semibold">Info</span>
                                    <span className="font-medium text-slate-500 text-sm">{error}</span>
                                </div>
                                <div className="inset-center">
                                    <IconButton
                                        onClick={() => {
                                            setInfo(info.filter((_, i) => i !== index));
                                        }}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {Object.keys(data).length > 0 && (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Button color={`${copied ? "success" : "primary"}`} variant="contained" onClick={handleCopy}>
                            <ContentCopyIcon className={`mr-2`} />
                            {copied ? "Copied" : "Copy"}
                        </Button>
                        <Button variant="contained" onClick={beautify}>
                            <AutoFixHighIcon className={`mr-2`} />
                            Beautify
                        </Button>
                    </div>
                    <CodeEditor
                        value={dataString}
                        language="json"
                        onChange={(evn) => setDataString(evn.target.value)}
                        padding={15}
                        style={{ borderRadius: "5px", background: "white", border: "1px solid grey" }}
                    />
                </div>
            )}
        </div>
    );
};

export default MappingGenerator;
