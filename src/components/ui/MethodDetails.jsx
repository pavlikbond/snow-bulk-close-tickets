import React from "react";

const MethodDetails = ({ details, type, contentType = "application/json", env = "dev" }) => {
  return type === "Request" ? (
    <div className="rounded shadow-sm bg-slate-50 p-4">
      <h2 className="text-2xl font-bold text-slate-600 mb-4">Request Details</h2>
      <div className="flex flex-col space-y-1 divide-y-2">
        <div className="flex flex-row space-x-4">
          <span className="font-semibold">Method:</span>
          <span>{details.method}</span>
        </div>
        <div className="flex flex-row space-x-4">
          <span className="font-semibold">Endpoint:</span>
          <span>
            <span className="text-slate-500">https://www.smconnect.ensono.com/companyname/</span>
            <span className={env === "echo" ? "font-bold text-slate-800 bg-orange-200 pb-1" : ""}>{env}</span>
            <span className="font-bold text-slate-800 bg-emerald-200 pr-2 pb-1">{details.endpoint}</span>
          </span>
        </div>
        {contentType && (
          <div className="flex flex-row space-x-4">
            <span className="font-semibold">Content-Type:</span>
            <span>{contentType}</span>
          </div>
        )}
        {/* <DirectionCell direction={details.direction} /> */}
      </div>
    </div>
  ) : (
    <div className="rounded shadow-sm bg-slate-50 p-4">
      <h2 className="text-2xl font-bold text-slate-600 mb-4">Response Details</h2>
      <div className="flex flex-col space-y-1 divide-y-2">
        <div className="flex flex-row space-x-4">
          <span className="font-semibold">Status Code:</span>
          <span>200</span>
        </div>
        <div className="flex flex-row space-x-4">
          <span className="font-semibold">Content-Type:</span>
          <span>application/json</span>
        </div>
        {/* <DirectionCell direction={details.direction} /> */}
      </div>
    </div>
  );
};

export default MethodDetails;
