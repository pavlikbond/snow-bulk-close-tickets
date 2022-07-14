import "./styles.css";
import ResponseCont from "./components/ResponseCont.js";
import { useState } from "react";
import { motion } from "framer-motion";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from "react-loader-spinner";
import sampleResults from "./sampleResults.json";
import { v4 as uuidv4 } from "uuid";

let fakeResponses = ["Ticket Close Sucessful", "Ticket Close Failed", "Ticket Not Found"];

function App() {
    const [responses, setResponses] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [formInput, setFormInput] = useState("");

    //read the input and update the state
    let formInputHandler = (e) => {
        setFormInput(e.target.value);
    };

    function handler() {
        setLoading(true);
        if (responses.length > 0) {
            responses.length = 0; //clear old responses if re-submitting new ones
        }

        let rawInput = formInput.trim();

        if (rawInput == "") {
            setLoading(false);
            return; // if nothing was entered into the textarea do nothing
        }

        //clean the commas and spaces and turn into an array of ticket numbers
        let splitResult = rawInput.split(/[\n\s,]+/);
        const results = splitResult.map((element) => {
            return element.trim().replace(",", "");
        });

        // fetch("https://smconnect.ensono.com/bulkCloseTickets", {
        //     method: "PUT",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(""),
        // })
        //     .then((response) => response.json())
        //     .then((data) => console.log(data))
        //     .catch(function () {
        //         console.log("error");
        //     });

        setTimeout(() => {
            let t = [];
            for (let result of sampleResults.body) {
                t.push({
                    ticketNum: result.result.number,
                    snowResponse: result.result.info,
                    timestamp: Date().toString().substring(0, 24),
                    uuid: uuidv4(),
                });
            }
            // for (let result of results) {
            //     t.push({
            //         ticketNum: result,
            //         response: fakeResponses[Math.floor(Math.random() * 3)],
            //         timestamp: Date().toString().substring(0, 24),
            //     });
            // }
            setResponses([...responses, ...t]);
            setLoading(false);
        }, 3000);
    }

    //deletes a response card when user clicks 'x'
    const deleteResponse = (uuid) => {
        setResponses(responses.filter((response) => response.uuid != uuid));
    };

    return (
        <div className="main-container">
            <motion.div className="form">
                <h1>SNOW Bulk Cancellation</h1>
                <span className="directions">Enter Incident numbers separated by commas or spaces</span>
                <textarea
                    onChange={formInputHandler}
                    className="incidents"
                    placeholder="INC12345, INC12345, INC12345, INC12345"
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
