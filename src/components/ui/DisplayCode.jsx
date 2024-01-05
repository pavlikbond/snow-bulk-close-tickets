import JSONPretty from "react-json-pretty";
import CopyButton from "./CopyButton";
const customTheme = {
  main: "background: #1a1a1a; color: white; font-family: monospace; font-size: 14px; padding: 12px; line-height: 1.5; border-radius: 8px; white-space: pre-wrap; word-wrap: break-word;", // Updated background and added border-radius
  key: "color: #8cb4f5; font-weight: bold;",
  string: "color: #FFA500;", // Orange for values
  value: "color: #FFA500;", // Orange for values
  punctuation: "font-weight: bold;", // Make curly braces thicker and white
};

const DisplayCode = ({ jsonData, heading }) => {
  return (
    <div className="">
      <div className="rounded-md p-4 shadow  bg-slate-50 min-w-[24rem] max-w-5xl">
        <h2 className="text-2xl font-bold text-slate-600 mb-4">{heading}</h2>
        <CopyButton data={jsonData} />
        <JSONPretty themeClassName="custom-json-pretty" data={jsonData} theme={customTheme} />
      </div>
    </div>
  );
};

export default DisplayCode;
