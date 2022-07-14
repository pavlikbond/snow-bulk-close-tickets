import React from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const IndividualResponse = ({ response, onDelete }) => {
    return (
        <motion.div className="response">
            <span className="ticket-number">{response.ticketNum}</span>
            <div className="response-message">
                {response.snowResponse.map((note, index) => {
                    return (
                        <div key={index} className={note.startsWith("Incident Resolved") ? "resolved" : "note"}>
                            {index + 1 + ". "}
                            {note}
                        </div>
                    );
                })}
            </div>

            {/* <span className="response-timestamp">{response.timestamp}</span> */}
            <FaTimes className="close-btn" onClick={() => onDelete(response.uuid)} />
        </motion.div>
    );
};

export default IndividualResponse;
