import "./index.css";
import "./styles.css";
import ResponseCont from "./components/ResponseCont.js";
import { useState } from "react";
import { motion } from "framer-motion";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from "react-loader-spinner";
import sampleResults from "./sampleResults.json";
import { v4 as uuidv4 } from "uuid";
import Radios from "./components/Radios";
import { BiError } from "react-icons/bi";

let fakeResponses = ["Ticket Close Sucessful", "Ticket Close Failed", "Ticket Not Found"];

function App() {
    let environment;
    let version;
    const [responses, setResponses] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [formInput, setFormInput] = useState("");
    const [error, setError] = useState("");

    //read the input and update the state
    let formInputHandler = (e) => {
        setFormInput(e.target.value);
    };

    let changeVersionAndEnvironment = (v, e) => {
        environment = e;
        version = v;
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

        //clean the commas, newlines, and spaces and turn into an array of ticket numbers
        let splitResult = rawInput.split(/[\n\s,]+/);
        const results = splitResult.map((element) => {
            return element.trim().replace(",", "");
        });

        let n = 5; // number of times to retry calling the API lambda
        //loop and retry calling the API, display error if still fails after all attempts
        for (let i = 0; i < n; i++) {
            try {
                return await fetch("https://smconnect.ensono.com/bulkCloseTickets", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ environment: environment, version: version, ticketNumbers: results }),
                })
                    .then((response) => response.json()) //convert response
                    .then((data) => {
                        let tempList = [];
                        //for each reponse create an object
                        for (let item of data.body) {
                            tempList.push({
                                ticketNum: item.result.number,
                                snowResponse: item.result.info,
                                errors: item.result.errors,
                                timestamp: Date().toString().substring(0, 24),
                                uuid: uuidv4(), //unique id used for deleting values
                            });
                        }
                        setResponses([...responses, ...tempList]);
                        setLoading(false);
                    });
            } catch (error) {
                const isLastAttemp = i + 1 === n;
                if (isLastAttemp) {
                    console.log(error);
                    setLoading(false);
                    setError(() => {
                        return "Error connecting to Lambda";
                    });
                }
            }
        }
    }

    //deletes a response card when user clicks 'x'
    const deleteResponse = (uuid) => {
        setResponses(responses.filter((response) => response.uuid != uuid));
    };

    return (
        <div className="main-container">
            <motion.div className="form">
                <h1>SNOW Bulk Close</h1>
                <Radios updateVandE={changeVersionAndEnvironment} />
                <span className="directions">Enter ticket numbers separated by commas or spaces</span>
                <textarea
                    onChange={formInputHandler}
                    className="incidents"
                    placeholder="INC1234567, INC1234567, INC1234567, INC1234567"
                    value={formInput}
                ></textarea>
                <div className="button-container">
                    <button className="clear-btn" onClick={() => setFormInput(() => "")}>
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
                        <div className="bg-red-300 text-red-700 rounded shadow mt-2.5 p-2 inline-block">
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
