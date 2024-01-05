import React from "react";

const InfoTable = ({ tableHeaders, tableData, tableFooter }) => {
  return (
    <table className="table table-compact w-full min-w-[800px]">
      <thead>
        <tr>
          {tableHeaders.map((header, index) => {
            return (
              <th key={index} className="text-slate-700 font-semibold px-4">
                {header}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => {
          return (
            <tr key={index} className="hover border-t border-slate-200">
              {Object.values(row).map((cell, index) => {
                let className = "";
                if (cell === "Required") className = " font-bold text-red-500";
                if (cell === "Required*") className = "font-bold text-orange-500";
                return (
                  <td key={index} className={`px-4 py-2 whitespace-normal ${className}`}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      {tableFooter && (
        <tfoot>
          <tr>
            <td colSpan={tableHeaders.length} className="px-4 py-2 whitespace-normal !normal-case">
              {tableFooter.split("\n").map((line, index) => {
                return (
                  <p key={index} className="mb-2">
                    {line}
                  </p>
                );
              })}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default InfoTable;
