import React from "react";
import Link from "@mui/material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const UsefulLink = ({ link, name }) => {
  let handleCopy = () => {
    navigator.clipboard.writeText(link);
  };
  return (
    <div className="bg-slate-100 py-2 px-4 flex justify-between">
      <Link underline="hover" href={link} className="text-lg font-semibold truncate" target="blank">
        {name || link}
      </Link>
      <ContentCopyIcon
        onClick={handleCopy}
        className="hover:bg-slate-300 rounded duration-500 transition-all cursor-pointer"
      />
    </div>
  );
};

export default UsefulLink;
