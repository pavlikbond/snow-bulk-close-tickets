import React from "react";
import { FaTimes } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { motion } from "framer-motion";

const IndividualResponse = ({ response, onDelete }) => {
    return (
        <motion.div className="response">
            <span className="ticket-number">{response.ticketNum}</span>
            <div className="response-message">
                {response.snowResponse.map((note, index) => {
                    let check = note.toLowerCase();
                    return (
                        <div key={index} className={check.includes("resolved") ? "resolved shadow" : "note"}>
                            <BsDot className="inline" />
                            {note}
                        </div>
                    );
                })}
            </div>
            <div className="response-message">
                {response.errors.map((note, index) => {
                    return (
                        <div key={index} className="bg-error inline-block rounded pr-2 py-1 shadow">
                            <BsDot className="inline" />
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
