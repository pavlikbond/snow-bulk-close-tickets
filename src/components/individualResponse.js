import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { motion } from "framer-motion";
import { TailSpin } from "react-loader-spinner";

const IndividualResponse = ({ response, onDelete, retryApi, isClicked, setIsClicked }) => {
    function retryHandler() {
        setIsClicked(true);
        retryApi(response.uuid);
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
        <motion.div className="response queue-card w-full border-[1px] border-slate-200 shadow-md">
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
            {response.isError && (
                <div className="flex justify-end">
                    <button
                        className=" btn btn-error btn-sm relative bottom-0 right-0 mr-0 normal-case p-0"
                        onClick={retryHandler}
                    >
                        {!isClicked ? (
                            <p className="text-center">Retry</p>
                        ) : (
                            <>
                                <TailSpin color="#fff" height={20} width={20} />
                                <p className="ml-2">Retrying...</p>
                            </>
                        )}
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default IndividualResponse;
