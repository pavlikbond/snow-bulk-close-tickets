import React from "react";
import IndividualResponse from "./individualResponse";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

const ResponseCont = ({ responses, onDelete, retryApi, isClicked, setIsClicked }) => {
    //convert visible responses to a csv file and download it
    const downloadCSV = (responses) => {
        //turns the responses array of objects into a CSV string
        const csvString = [
            ["Ticket Number", "TimeStamp", "Response Info", "Response Errors"], //headers
            ...responses.map((item) => [
                item.ticketNum,
                item.timestamp,
                item.snowResponse.join("  ---  ").replaceAll(", ", " "),
                item.errors.join("  ---  ").replaceAll(",", " "),
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");

        //add data type to beginning of string
        let csvContent = "data:text/csv;charset=utf-8," + csvString;
        //generate an invisible a tag
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "SNOW_bulk_close.csv"); //put any name you want
        document.body.appendChild(link); // Required for FF

        link.click();
    };

    //animation logic to animate the responses container and stagger children
    const variants = {
        hidden: {
            onpacity: 0.5,
        },
        visible: {
            onpacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    //each response appears
    const childVariants = {
        hidden: {
            opacity: 0,
            scale: 0.98,
        },
        visible: {
            opacity: 1,
            scale: 1,
        },
    };

    let progressVals = {
        max: responses.length,
        success: 0,
        failed: responses.filter(({ errors }) => errors.length > 0).length,
    };

    for (let response of responses) {
        if (response.snowResponse === []) {
            continue;
        } else {
            try {
                let note = response.snowResponse.join();
                note = note.toLowerCase();
                if (
                    note.includes("resolved") ||
                    note.includes("was cancelled") ||
                    note.includes("has been cancelled")
                ) {
                    progressVals.success++;
                }
            } catch (error) {
                continue;
            }
        }
    }

    return (
        <>
            <h3 className="responses-header">Responses</h3>
            <div className="flex flex-col">
                <div className="flex flex-col font-bold pl-1 py-2 pr-1 gap-2">
                    <button className="print-csv-btn btn-secondary" onClick={() => downloadCSV(responses)}>
                        Download CSV
                    </button>
                    <div className="border-[1px] rounded border-slate-200 p-2">
                        <p className="py-1 text-slate-600">
                            Succeeded: {progressVals.success}/{progressVals.max}
                        </p>
                        <Box sx={{ width: "100%" }}>
                            <LinearProgressWithLabel
                                color="success"
                                variant="determinate"
                                value={(progressVals.success / progressVals.max) * 100}
                            />
                        </Box>
                        {/* <progress
                        className="progress progress-success w-100 h-2"
                        value={progressVals.success}
                        max={progressVals.max}
                    ></progress> */}
                    </div>
                    <div className="border-[1px] rounded border-slate-200 p-2">
                        <p className="py-1 text-slate-600">
                            Failed: {progressVals.failed}/{progressVals.max}
                        </p>
                        {/* <progress
                        className="progress progress-error w-100 h-2"
                        value={progressVals.failed}
                        max={progressVals.max}
                    ></progress> */}

                        <Box sx={{ width: "100%" }}>
                            <LinearProgressWithLabel
                                color="error"
                                variant="determinate"
                                value={(progressVals.failed / progressVals.max) * 100}
                            />
                        </Box>
                    </div>
                </div>
            </div>
            <motion.div variants={variants} initial="hidden" animate="visible" className="all-responses p-2">
                {responses.map((response) => (
                    <motion.div variants={childVariants} key={response.uuid}>
                        <IndividualResponse
                            response={response}
                            onDelete={onDelete}
                            retryApi={retryApi}
                            isClicked={isClicked}
                            setIsClicked={setIsClicked}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </>
    );
};

export default ResponseCont;
