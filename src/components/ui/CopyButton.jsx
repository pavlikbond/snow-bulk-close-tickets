import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const CopyButton = ({ data }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  //function to copy the data to the clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000); // Reset "Copied" state after 3 seconds
    } catch (error) {
      console.error("Failed to copy to clipboard: ", error);
    }
  };
  //return a component that copies the data to the clipboard
  return (
    <div className="flex flex-row-reverse h-12 p-2">
      {isCopied ? (
        <span className="text-emerald-400 font-semibold text-base">Copied to clipboard</span>
      ) : (
        <button
          className="bg-slate-50 hover:bg-slate-300 rounded-md p-1 transition-all duration-100"
          onClick={copyToClipboard}
        >
          <ContentCopyIcon />
        </button>
      )}
    </div>
  );
};

export default CopyButton;
