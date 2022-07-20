import React from "react";
import { FaTimes } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { motion } from "framer-motion";

const IndividualResponse = ({ response, onDelete }) => {
    //className={check.includes("resolved") ? "resolved shadow" : "note"}
    let check = (note) => {
        note = note.toLowerCase();
        if (note.includes("cannot") || note.includes("unable")) {
            return "bg-error shadow rounded";
        } else if (note.includes("resolved") || note.includes("was cancelled") || note.includes("has been cancelled")) {
            return "resolved shadow";
        } else {
            return "note";
        }
    };

    return (
        <motion.div className="response">
            <span className="ticket-number">{response.ticketNum}</span>
            <div className="response-message">
                {response.snowResponse.map((note, index) => {
                    return (
                        <div key={index} className={check(note)}>
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
