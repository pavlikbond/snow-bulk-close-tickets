import React from "react";
import IndividualResponse from "./individualResponse";
import { motion } from "framer-motion";

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

    return (
        <div>
            <h3 className="responses-header">Responses</h3>
            <div>
                <button className="print-csv-btn" onClick={() => downloadCSV(responses)}>
                    Download CSV
                </button>
            </div>
            <motion.div variants={variants} initial="hidden" animate="visible">
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
        </div>
    );
};

export default ResponseCont;
