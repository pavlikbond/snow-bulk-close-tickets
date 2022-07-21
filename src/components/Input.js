import React from "react";
export function Input({ setCloseNotes, closeNotes }) {
    return (
        <div className="mt-3 mb-2">
            <p className="mb-2 font-bold pl-1">
                Close Notes - <span className="italic font-normal">optional</span>
            </p>
            <input
                onChange={(e) => setCloseNotes(e.target.value)}
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full block input-primary mr-0"
                value={closeNotes}
            />
        </div>
    );
}
