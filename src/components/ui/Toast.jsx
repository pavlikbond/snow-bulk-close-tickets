import React from "react";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Toast = ({ type, message, clear = false }) => {
  return (
    <div
      className={`relative flex items-center p-2 py-1 rounded-md bg-white shadow-sm br border-l-8 ${
        type === "Error" ? "border-red-400" : "border-emerald-400"
      }`}
    >
      {type === "Error" ? (
        <ErrorIcon className="mr-2 text-red-400" fontSize="large" />
      ) : (
        <CheckCircleIcon className="mr-2 text-emerald-400" fontSize="large" />
      )}
      <div className="flex flex-col">
        <span className="text-slate-600 text-xl font-semibold">{type}</span>
        <span className="font-medium text-slate-500 text-sm">{message}</span>
      </div>
      {clear && (
        <div className="inset-center">
          <IconButton
            onClick={() => {
              console.log("clicked");
            }}
          >
            <ClearIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Toast;
