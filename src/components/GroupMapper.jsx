import { useState, useEffect, useRef } from "react";
import JSONPretty from "react-json-pretty";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CircularProgress from "@mui/material/CircularProgress";

const GroupMapper = () => {
  const [ensonoGroups, setEnsonoGroups] = useState("");
  const [clientGroups, setClientGroups] = useState("");
  const [mappedGroups, setMappedGroups] = useState([]);
  const [verifiedGroups, setVerifiedGroups] = useState([]); // State to track whether data was copied
  const [loading, setLoading] = useState(false); // State to track whether data is loading
  const cleanGroups = useRef([]);
  const caseNumber = useRef("");
  const [isCopied, setIsCopied] = useState(false); // State to track whether data was copied
  const customTheme = {
    main: "background: #1a1a1a; color: white; font-family: monospace; font-size: 14px; padding: 12px; line-height: 1.5; border-radius: 8px;", // Updated background and added border-radius
    key: "color: #8cb4f5; font-weight: bold;",
    string: "color: #FFA500;", // Orange for values
    value: "color: #FFA500;", // Orange for values
    punctuation: "font-weight: bold;", // Make curly braces thicker and white
  };

  // Create a useEffect to automatically update mappedGroups when ensonoGroups or clientGroups change
  useEffect(() => {
    mapGroups();
  }, [ensonoGroups, clientGroups]); // Include mapGroups as a dependency

  const mapGroups = () => {
    let eGroups = ensonoGroups.length ? ensonoGroups.trim().split("\n") : [];
    let cGroups = clientGroups.length ? clientGroups.trim().split("\n") : [];

    // Go through both lists and trim each value
    if (eGroups?.length) eGroups = eGroups.map((group) => group.trim());
    if (cGroups?.length) cGroups = cGroups.map((group) => group.trim());
    cleanGroups.current = eGroups;
    // Figure out the length of the longer list
    const longerLength = Math.max(eGroups.length, cGroups.length);

    let mappedGroups = [];
    for (let i = 0; i < longerLength; i++) {
      mappedGroups.push({
        ensonoVal: eGroups[i] || "",
        clientVal: cGroups[i] || "",
      });
    }

    setMappedGroups(mappedGroups);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(mappedGroups, null, 2));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000); // Reset "Copied" state after 3 seconds
    } catch (error) {
      console.error("Failed to copy to clipboard: ", error);
    }
  };

  const checkGroups = () => {
    if (!cleanGroups.current.length) return console.log("No groups to check");
    setLoading(true);
    fetch(process.env.REACT_APP_API_ENDPOINT + "/groupchecker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseNum: caseNumber.current,
        groupList: cleanGroups.current,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.caseNum) caseNumber.current = data.caseNum;
        //reorder data to match original order. Data is a single object where the key is the group name and value is either 'success' or 'error'
        const reorderedData = [];
        cleanGroups.current.forEach((group) => {
          reorderedData.push({
            [group]: data.results[group],
          });
        });
        console.log(reorderedData);
        setVerifiedGroups(reorderedData);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="mx-auto mt-10 mb-24 flex flex-col items-center gap-8 w-full max-w-screen-2xl">
      <h1>Group Mapper</h1>

      <div className="flex gap-4 w-full px-24">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="label">
            <span className="label-text font-bold text-2xl text-slate-600">Ensono Groups</span>
            {cleanGroups.current.length ? (
              <button className="btn btn-sm" onClick={checkGroups} disabled={loading}>
                {loading ? <CircularProgress className="mr-2" size={20} /> : null}
                <span>Verify Groups</span>
              </button>
            ) : null}
          </label>
          <textarea
            placeholder="Empty"
            className="textarea textarea-bordered textarea-xs h-96 shadow-md w-full"
            value={ensonoGroups}
            onChange={(e) => {
              setEnsonoGroups(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label className="label">
            <span className="label-text font-bold text-2xl text-slate-600">Client Groups</span>
          </label>
          <textarea
            placeholder="Empty"
            className="textarea textarea-bordered textarea-xs h-96 shadow-md w-full"
            value={clientGroups}
            onChange={(e) => {
              setClientGroups(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex gap-4 w-full px-24">
        <div className="rounded-md p-2 shadow w-1/2 bg-slate-50 min-w-[24rem]">
          {mappedGroups.length ? (
            <div className="flex justify-end mb-2">
              {isCopied ? (
                <div className="text-emerald-500 font-bold mr-2">Copied!</div>
              ) : (
                <button className="btn btn-success btn-sm" onClick={copyToClipboard}>
                  <ContentCopyIcon className="mr-2" />
                  Copy
                </button>
              )}
            </div>
          ) : null}
          <h3 className="text-center font-bold text-3xl text-slate-700 mb-6">Results</h3>
          {mappedGroups.length ? (
            <JSONPretty data={mappedGroups} theme={customTheme} />
          ) : (
            <div className="text-center bg-slate-200 text-slate-600 rounded shadow py-4">No Results</div>
          )}
        </div>
        {verifiedGroups.length ? (
          <div className="rounded-md shadow w-1/2 h-fit bg-slate-50 min-w-[24rem] p-6">
            <h3 className="text-center font-bold text-3xl text-slate-700 mb-6">Verification Results</h3>
            {!loading ? (
              <div className="grid grid-cols-1 divide-y">
                {verifiedGroups.map((group, index) => {
                  const groupName = Object.keys(group)[0];
                  const groupStatus = group[groupName];

                  return (
                    <div key={index} className="flex justify-between items-center px-2 py-1">
                      <div className="text-slate-600">{groupName}</div>
                      <div
                        className={`${groupStatus === "Success" ? "bg-green-300" : "bg-red-300"} px-1 rounded shadow`}
                      >
                        {groupStatus}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <CircularProgress className="mr-2" size={20} />
                <span>Verifying...</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GroupMapper;
