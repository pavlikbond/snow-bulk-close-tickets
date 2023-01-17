import { Input } from "./Input";
import ResponseCont from "./ResponseCont.js";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";
import Radios from "./Radios";
import { BiError } from "react-icons/bi";
import SubmitModal from "./SubmitModal";
import { Auth } from "aws-amplify";
import { SideBar } from "./SideBar";

function BulkCloser() {
    let userInfo = {};

    Auth.currentAuthenticatedUser({
        bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
        .then((user) => {
            userInfo.email = user.attributes.email;
            userInfo.name = user.attributes.name ? user.attributes.name : user.attributes.email;
        })
        .catch((err) => console.log(err));

    let [environment, setEnvironment] = useState("Test");
    let [version, setVersion] = useState("V1");
    let [state, setState] = useState("resolve");
    const [responses, setResponses] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [formInput, setFormInput] = useState("");
    const [currentResponse, setCurrentResponse] = useState(null);
    const [error, setError] = useState("");
    const didMount = useRef(false);
    const [closeNotes, setCloseNotes] = useState("");
    const [isClicked, setIsClicked] = useState(false);
    const [modalState, setModalState] = useState("");

    //read the input and update the state
    let formInputHandler = (e) => {
        setFormInput(e.target.value);
    };

    //updates the state, version, and environment when user interacts
    let changeRadios = (v, e, s) => {
        setEnvironment(() => {
            return e;
        });
        setVersion(() => {
            return v;
        });
        setState(() => {
            return s;
        });
    };

    //cleans raw input and returns an array of ticket numbers
    function cleanRawInput(rawInput) {
        //clean the commas, newlines, and spaces and turn into an array of ticket numbers
        rawInput = rawInput.replaceAll(",", " ").trim();
        let splitResult = rawInput.split(/[\n\s,]+/);
        const results = splitResult.map((element) => {
            return element.trim();
        });
        return results;
    }

    //skip when page loaded, but whenever currrentResponse changes, update responses
    useEffect(() => {
        if (didMount.current) {
            setResponses([...responses, currentResponse]);
        } else {
            didMount.current = true;
        }
    }, [currentResponse]);

    //in case you want the enter key to trigger the submit button
    const handleKeypress = (e) => {
        //it triggers by pressing the enter key
        // if (e.key === "Enter") {
        //     e.preventDefault();
        //     handler();
        // }
    };

    function prodChecker() {
        let rawInput = formInput.trim();

        if (rawInput === "") {
            setError(() => {
                return "Input field cannot be blank";
            });
            return; // if nothing was entered into the textarea do nothing
        }

        if (environment === "Prod") {
            setModalState("modal-open");
        } else {
            handler();
        }
    }

    async function handler() {
        setLoading(true); //initiating loading circle animation
        setError(() => {
            //clear out errors if there was one
            return "";
        });
        if (responses.length > 0) {
            responses.length = 0; //clear old responses if re-submitting new ones
        }
        let rawInput = formInput.trim();

        let results = cleanRawInput(rawInput);

        //call lambda separately for each ticket number
        for (let ticketNum of results) {
            await callApi(ticketNum);
        }
        setLoading(false);
        //setResponses([...r]);
    }

    let callApi = async (ticketNum, retry = false, uuid = "") => {
        let done = false;
        let retries = 5;
        for (let i = 0; i < retries; i++) {
            if (!done) {
                try {
                    await fetch(`${process.env.REACT_APP_API_ENDPOINT}/bulkCloseTickets`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": process.env.REACT_APP_API_KEY,
                        },
                        body: JSON.stringify({
                            environment: environment,
                            version: version,
                            ticketNum: ticketNum,
                            state: state,
                            closeNotes: closeNotes.trim(),
                            user: userInfo,
                        }),
                    })
                        .then((response) => response.json()) //convert response
                        .then((item) => {
                            console.log(item);
                            let newResponse = {};
                            //if item is undefined, means there was some connection error
                            if (!item) {
                                newResponse = {
                                    ticketNum: "",
                                    snowResponse: [],
                                    errors: ["Connection error, please retry"],
                                    isError: true,
                                    timestamp: Date().toString().substring(0, 24),
                                    uuid: retry ? uuid : uuidv4(), //unique id used for deleting values
                                };
                            } else {
                                newResponse = {
                                    ticketNum: "number" in item.result ? item.result.number : ticketNum,
                                    snowResponse: item.result.info,
                                    errors: item.result.errors,
                                    isError: false,
                                    timestamp: Date().toString().substring(0, 24),
                                    uuid: retry ? uuid : uuidv4(), //unique id used for deleting values
                                };
                            }
                            if (retry) {
                                runUpdate(newResponse, uuid);
                            } else {
                                setCurrentResponse(newResponse);
                            }

                            done = true;
                            setError(() => {
                                //clear out errors if there was one
                                return "";
                            });
                            //r.push(newResponse);
                        });
                } catch (error) {
                    setError(() => {
                        return "Retrying...";
                    });
                    const isLastAttemp = i + 1 === retries;
                    if (isLastAttemp) {
                        console.log(error);

                        let newResponse = {
                            ticketNum: ticketNum,
                            snowResponse: [],
                            errors: [error.errorMessage],
                            isError: true,
                            timestamp: Date().toString().substring(0, 24),
                            uuid: retry ? uuid : uuidv4(), //unique id used for deleting values
                        };
                        if (retry) {
                            runUpdate(newResponse, uuid);
                        } else {
                            setCurrentResponse(newResponse);
                        }
                        done = true;
                        setLoading(false);
                        setError(() => {
                            return `Failed for ticket number: ${ticketNum}`;
                        });
                        return false;
                    }
                }
            }
        }
    };

    let retryApi = async (uuid) => {
        for (let i = 0; i < responses.length; i++) {
            if (responses[i].uuid === uuid) {
                callApi(responses[i].ticketNum, true, uuid);
            }
        }
    };

    function runUpdate(newResponse, uuid) {
        let newResponses = responses.map((response) => {
            if (response.uuid === uuid) {
                return newResponse;
            }
            return response;
        });
        //console.log("New responses = " + newResponses);
        setResponses(newResponses);
        setIsClicked(false);
    }

    //deletes a response card when user clicks 'x'
    const deleteResponse = (uuid) => {
        setResponses(responses.filter((response) => response.uuid !== uuid));
    };

    return (
        <div className="main-container text-gray-600 flex-1">
            <motion.div className="form h-[685px]">
                <h1>Close Tickets</h1>
                <Radios changeRadios={changeRadios} />
                <div className="mt-4">
                    <label className="label">
                        <span className="label-text font-semibold text-slate-700">
                            Enter a list of incidents separated by commas or spaces
                        </span>
                    </label>
                    <textarea
                        spellCheck="false"
                        className="textarea textarea-bordered textarea-primary w-full min-h-[18rem]"
                        onChange={formInputHandler}
                        placeholder="INC1234567, INC1234567, INC1234567, INC1234567"
                        value={formInput}
                        onKeyPress={handleKeypress}
                    ></textarea>
                </div>
                <Input setCloseNotes={setCloseNotes} closeNotes={closeNotes} />
                <div className="flex gap-3">
                    <SubmitModal modalState={modalState} setModalState={setModalState} handler={handler} />
                    <button
                        className="btn"
                        onClick={() => {
                            setFormInput(() => "");
                            setCloseNotes("");
                        }}
                    >
                        Clear
                    </button>
                    {!isLoading && (
                        <button className="btn  btn-primary" onClick={prodChecker}>
                            Submit
                        </button>
                    )}
                    {isLoading && (
                        <button className="btn" disabled>
                            <TailSpin color="#fff" height={40} />
                        </button>
                    )}
                    {error && (
                        <div className="bg-red-300 text-red-700 rounded shadow p-2 inline-block text-sm md:text-base">
                            <BiError className="inline mr-1" />
                            {error}
                        </div>
                    )}
                </div>
            </motion.div>
            {/* only appears if there are responses, otherwise invisible */}
            {responses.length > 0 && (
                <motion.div
                    className="all-responses-container"
                    //animation: pop out when revealed
                    initial={{ opacity: 0.8, scale: 0.8 }} //initial states
                    animate={{ opacity: 1, scale: 1 }} // final states
                >
                    <ResponseCont
                        responses={responses}
                        onDelete={deleteResponse}
                        retryApi={retryApi}
                        isClicked={isClicked}
                        setIsClicked={setIsClicked}
                    />
                </motion.div>
            )}
        </div>
    );
}

export default BulkCloser;
