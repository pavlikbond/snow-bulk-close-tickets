import React from "react";
import { FaTimes } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { motion } from "framer-motion";
import { TailSpin } from "react-loader-spinner";

const IndividualResponse = ({ response, onDelete }) => {
    function retryHandler() {
        console.log("retry");
    }
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
            <FaTimes className="close-btn" onClick={() => onDelete(response.uuid)} />
            {response.isError && <button className="btn btn-error btn-sm w-3">Retry</button>}
            <div className="flex justify-end">
                <button
                    className=" btn btn-error btn-sm w-3 relative bottom-0 right-0 mr-0 normal-case p-0"
                    onClick={retryHandler}
                >
                    <TailSpin color="#fff" height={20} width={20} /> <p className="ml-2">Processing</p>
                </button>
            </div>
        </motion.div>
    );
};

export default IndividualResponse;
