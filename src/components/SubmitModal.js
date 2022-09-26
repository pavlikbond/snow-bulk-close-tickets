import React from "react";

const SubmitModal = ({ modalState, setModalState, handler }) => {
    //check Confirm input to see if what is entered is correct
    function submitBtnHandler(e) {
        e.preventDefault();
        setModalState("");
        handler();
    }

    //minimize modal when user clicks close or x button
    function removeModal(e) {
        e.preventDefault();
        setModalState("");
    }
    return (
        <>
            <input type="checkbox" id="my-modal-1" className="modal-toggle" />
            <div className={"modal " + modalState}>
                <div className="modal-box relative">
                    <label
                        htmlFor="my-modal-1"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                        onClick={removeModal}
                    >
                        ✕
                    </label>
                    <h2 className="text-2xl font-bold uppercase">Wait!</h2>
                    <p className="py-4 text-lg">
                        You are about to close tickets in the{" "}
                        <span className="font-bold uppercase bg-red-300 rounded px-2 inline-block">"Production"</span>{" "}
                        environment!
                    </p>
                    <div className="flex justify-end">
                        <label htmlFor="my-modal-1" className="btn btn-outline mr-3" onClick={removeModal}>
                            Back
                        </label>
                        <label htmlFor="my-modal-1" className="btn btn-primary" onClick={submitBtnHandler}>
                            Continue
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SubmitModal;
