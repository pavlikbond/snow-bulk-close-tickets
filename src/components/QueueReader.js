import { React, useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from "react-loader-spinner";
import Button from "@mui/material/Button";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillStopFill, BsFillPlayFill } from "react-icons/bs";

const QueueReader = () => {
    const [queueReaderCards, setQueueReaderCards] = useState([0]);
    const [companyDataList, setCompanyDataList] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/queues`, {
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCompanyDataList(data);
            })
            .catch((err) => {
                console.log(err);
                setError("Error connecting to API");
            });
    }, []);

    function addCard() {
        if (queueReaderCards.length === 4) {
            return;
        }
        setQueueReaderCards([...queueReaderCards, queueReaderCards.length]);
    }

    function deleteQueueCard(id) {
        let cards = queueReaderCards.filter((item) => {
            return item !== id;
        });

        setQueueReaderCards(cards);
    }
    return (
        <div className="flex flex-col gap-8 m-6 ml-[128px]">
            <button className="btn btn-info w-36 text-slate-700" onClick={() => addCard()}>
                Add
            </button>
            <div className="flex flex-wrap gap-12">
                {queueReaderCards.map((id) => {
                    return (
                        <QueueReaderCard
                            key={id}
                            id={id}
                            deleteQueueCard={deleteQueueCard}
                            companyDataList={companyDataList}
                            error={error}
                            setError={setError}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const QueueReaderCard = ({ id, deleteQueueCard, companyDataList, error, setError }) => {
    const [company, setCompany] = useState({});
    const [inQueue, setInQueue] = useState(0);
    const inQueueRef = useRef(0);
    const [inFlight, setInFlight] = useState(0);
    const [alignment, setAlignment] = useState("Dev");
    const [readQueue, setReadQueue] = useState(false);
    const [interval, updateInterval] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [timeLeftInterval, setTimeLeftInterval] = useState(60);
    const [lastQueueRead, setLastQueueRead] = useState(Date.now());
    const [inCountDown, setInCountDown] = useState(false);
    const [companyError, setCompanyError] = useState(false);

    let stopInterval = () => {
        if (interval) {
            clearInterval(interval);
        }
    };

    function updateTimeLeft(qty) {
        if (qty < inQueueRef.current) {
            setTimeLeft(timeLeftInterval);
        }
    }

    useEffect(() => {
        setTimeLeft(timeLeftInterval);
        if (readQueue) {
            let interval = setInterval(() => {
                setTimeLeft((timeLeft) => {
                    return timeLeft > 0 ? timeLeft - 1 : timeLeftInterval;
                });
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [readQueue]);

    useEffect(() => {
        stopInterval();

        if (readQueue) {
            if (Object.keys(company).length === 0) {
                setError("Please select a company");
                setCompanyError(true);
                setReadQueue(false);
                return;
            }
            if (error) {
                setError("");
                setCompanyError(false);
            }
            let url;
            switch (alignment) {
                case "Prod":
                    url = company.prod;
                    break;
                case "Dev":
                    url = company.dev;
                    break;
                case "Cert":
                    url = company.cert;
                    break;

                default:
                    url = company.dev;
                    break;
            }

            let i = setInterval(() => {
                fetch(`${process.env.REACT_APP_API_ENDPOINT}/queueMessages?queueUrl=${url}`, {
                    headers: {
                        "x-api-key": process.env.REACT_APP_API_KEY,
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        updateTimeLeft(data.available);
                        setInQueue(data.available);
                        inQueueRef.current = data.available;
                        setInFlight(data.inFlight);
                    })
                    .catch((err) => {
                        setError("Error connecting to API");
                    });
            }, 1000);
            updateInterval(i);
        }
    }, [readQueue, company, alignment]);

    const handleChange = (event) => {
        stopInterval();
        let companyObject = companyDataList.find((data) => {
            return data.company === event.target.value;
        });
        setCompany(companyObject);
    };

    return (
        <div className=" bg-white shadow-lg rounded-xl h-fit p-8 flex flex-col gap-5 relative">
            {id !== 0 && (
                <AiFillCloseCircle
                    className="absolute right-2 top-2 hover:scale-110 transition-all cursor-pointer text-slate-600"
                    size={36}
                    onClick={() => deleteQueueCard(id)}
                ></AiFillCloseCircle>
            )}
            <div className="flex gap-3">
                <Box sx={{ minWidth: 120, background: "white", borderRadius: "5px" }}>
                    <FormControl fullWidth error={companyError}>
                        <InputLabel id="company-label">Company</InputLabel>
                        <Select
                            labelId="company-label"
                            value={company?.company || ""}
                            label="Companies"
                            onChange={handleChange}
                        >
                            {companyDataList.length === 0 && <TailSpin color="#570df8" height={40} />}
                            {companyDataList.length > 0 &&
                                companyDataList.map((company) => {
                                    return (
                                        <MenuItem value={company?.company} key={company?.company}>
                                            {company?.company}
                                        </MenuItem>
                                    );
                                })}
                        </Select>
                    </FormControl>
                </Box>
                <ColorToggleButton alignment={alignment} setAlignment={setAlignment} company={company} />
            </div>
            <div className="flex gap-3">
                <div className={inQueue > 0 ? "queue-card-red" : "queue-card-green"}>
                    <h2 className="text-2xl font-bold text-slate-700">In Queue</h2>
                    <div className="text-6xl font-bold text-slate-700">{inQueue}</div>
                </div>
                <div className={inFlight > 0 ? "queue-card-red" : "queue-card-green"}>
                    <h2 className="text-2xl font-bold text-slate-700">In Flight</h2>
                    <div className="text-6xl font-bold text-slate-700">{inFlight}</div>
                </div>
                <div className="queue-card flex flex-col justify-between">
                    <h2 className="text-2xl font-bold text-slate-700">Time Left</h2>
                    <div className="text-4xl font-bold text-slate-700 mb-2">{timeLeft}s</div>
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    className="btn btn-info shadow-md text-slate-600"
                    onClick={() => {
                        setReadQueue(true);
                        if (!inCountDown) {
                            setInCountDown(true);
                        }
                    }}
                    disabled={readQueue}
                >
                    {readQueue && <TailSpin color="rgb(71 85 105)" height={20} width={30} />}
                    {!readQueue && <BsFillPlayFill size={20} className="mr-2" />}
                    {readQueue ? "Reading" : "Start"}
                </button>
                <button
                    className="btn btn-error text-slate-600"
                    onClick={() => {
                        setReadQueue(false);
                        stopInterval();
                        setTimeout(() => {
                            setInQueue(0);
                            setInFlight(0);
                        }, 1000);
                    }}
                    disabled={!readQueue}
                >
                    <BsFillStopFill size={20} className="mr-2" />
                    Stop
                </button>
            </div>

            {error && <div className="bg-red-400 text-white px-2 py-1 rounded-md text-lg">{error}</div>}
        </div>
    );
};

const ColorToggleButton = ({ alignment, setAlignment, company }) => {
    //const [alignment, setAlignment] = useState("Dev");

    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
        }
    };

    return (
        <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            className="h-14 shadow-md"
            sx={{
                background: "white",
            }}
        >
            <ToggleButton value="Prod">Prod</ToggleButton>
            <ToggleButton value="Dev">Dev</ToggleButton>
            <ToggleButton value="Cert">Cert</ToggleButton>
        </ToggleButtonGroup>
    );
};

export default QueueReader;
