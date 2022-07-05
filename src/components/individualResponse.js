import React from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const IndividualResponse = ({ response, onDelete }) => {
  return (
    <motion.div className="response">
      <span className="ticket-number">{response.ticketNum}</span>
      <span className="response-message">{response.response}</span>
      {/* <span className="response-timestamp">{response.timestamp}</span> */}
      <FaTimes
        className="close-btn"
        onClick={() => onDelete(response.ticketNum)}
      />
    </motion.div>
  );
};

export default IndividualResponse;
