import "./styles.css";
import ResponseCont from "./components/ResponseCont.js";
import { useState } from "react";
import { motion } from "framer-motion";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from "react-loader-spinner";

let fakeResponses = [
  "Ticket Close Sucessful",
  "Ticket Close Failed",
  "Ticket Not Found",
];

function App() {
  const [responses, setResponses] = useState([]);
  const [isLoading, setLoading] = useState(false);

  function handler() {
    setLoading(true);
    if (responses.length > 0) {
      responses.length = 0; //clear old responses if re-submitting new ones
    }
    //setResponses([]); //doesn't work for some reason
    let rawInput = document.querySelector(".incidents").value.trim();

    if (rawInput == "") {
      setLoading(false);
      return; // if nothing was entered into the textarea
    }

    //clean the commas and spaces and turn into an array of ticket numbers
    let commas = rawInput.split(/[\n\s,]+/);
    const results = commas.map((element) => {
      return element.trim().replace(",", "");
    });

    setTimeout(() => {
      let t = [];
      //fake api method for testing
      for (let result of results) {
        t.push({
          ticketNum: result,
          response: fakeResponses[Math.floor(Math.random() * 3)],
          timestamp: Date().toString().substring(0, 24),
        });
        // let tempResponse = {
        //   ticketNum: result,
        //   response: fakeResponses[Math.floor(Math.random() * 2)],
        //   timestamp: Date(),
        // };
      }
      setResponses([...responses, ...t]);
      setLoading(false);
    }, 3000);
  }

  //clears textarea
  function clear(e) {
    document.querySelector(".incidents").value = "";
  }

  //deletes a response card when user clicks 'x'
  const deleteResponse = (ticketNum) => {
    setResponses(
      responses.filter((response) => response.ticketNum != ticketNum)
    );
  };

  return (
    <div className="main-container">
      <motion.div className="form">
        <h1>SNOW Bulk Cancellation</h1>
        <span className="directions">
          Enter Incident numbers separated by commas or spaces
        </span>
        <textarea
          className="incidents"
          placeholder="INC12345, INC12345, INC12345, INC12345"
          //value="INC111111, INC122222, INC123333, INC144444"
        ></textarea>
        <div className="button-container">
          <button className="clear-btn" onClick={clear}>
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
