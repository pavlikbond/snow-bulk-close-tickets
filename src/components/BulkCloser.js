import { Input } from "./Input";
import ResponseCont from "./ResponseCont.js";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";
import Radios from "./Radios";
import { BiError } from "react-icons/bi";
import LogoutButton from "./LogoutButton";

let fakeResponses = ["Ticket Close Sucessful", "Ticket Close Failed", "Ticket Not Found"];

function App() {
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
        let splitResult = rawInput.split(/[\n\s,]+/);
        const results = splitResult.map((element) => {
            return element.trim().replace(",", "");
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

        if (rawInput == "") {
            setLoading(false);
            setError(() => {
                return "Input field cannot be blank";
            });
            return; // if nothing was entered into the textarea do nothing
        }

        let results = cleanRawInput(rawInput);

        //call lambda separately for each ticket number
        for (let ticketNum of results) {
            let done = false;
            let retries = 5;
            for (let i = 0; i < retries; i++) {
                if (!done) {
                    try {
                        await fetch("https://smconnect.ensono.com/bulkCloseTickets", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                //"X-Api-Key": "CpZ3HkIXqX5oJ1F0ocdm86JcRlR9h5dO5wX9htGB",
                            },
                            body: JSON.stringify({
                                environment: environment,
                                version: version,
                                ticketNum: ticketNum,
                                state: state,
                                closeNotes: closeNotes.trim(),
                            }),
                        })
                            .then((response) => response.json()) //convert response
                            .then((item) => {
                                console.log(item);

                                let newResponse = {
                                    ticketNum: "number" in item.result ? item.result.number : ticketNum,
                                    snowResponse: item.result.info,
                                    errors: item.result.errors,
                                    timestamp: Date().toString().substring(0, 24),
                                    uuid: uuidv4(), //unique id used for deleting values
                                };
                                setCurrentResponse(newResponse);
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
                            setLoading(false);
                            setError(() => {
                                return `Failed for ticket number: ${ticketNum}`;
                            });
                        }
                    }
                }
            }
        }
        setLoading(false);
        //setResponses([...r]);
    }

    //deletes a response card when user clicks 'x'
    const deleteResponse = (uuid) => {
        setResponses(responses.filter((response) => response.uuid != uuid));
    };

    return (
        <div className="main-container text-gray-600">
            <motion.div className="form">
                <h1>Close Tickets</h1>
                <Radios changeRadios={changeRadios} />
                <span className="directions">Enter ticket numbers separated by commas or spaces</span>
                <textarea
                    onChange={formInputHandler}
                    className="incidents"
                    placeholder="INC1234567, INC1234567, INC1234567, INC1234567"
                    value={formInput}
                    onKeyPress={handleKeypress}
                ></textarea>
                <Input setCloseNotes={setCloseNotes} closeNotes={closeNotes} />
                <div className="button-container">
                    <button
                        className="clear-btn"
                        onClick={() => {
                            setFormInput(() => "");
                            setCloseNotes("");
                        }}
                    >
                        Clear
                    </button>
                    {!isLoading && (
                        <button className="submit-btn" onClick={handler}>
                            Submit
                        </button>
                    )}
                    {isLoading && (
                        <button className="loading-btn" disabled>
                            <TailSpin color="#fff" height={40} width={40} />
                        </button>
                    )}
                    {error && (
                        <div className="bg-red-300 text-red-700 rounded shadow mt-2.5 p-2 inline-block text-sm md:text-base">
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
                    <ResponseCont responses={responses} onDelete={deleteResponse} />
                </motion.div>
            )}
        </div>
    );
}

export default App;
