import { useState, useRef, useEffect } from "react";

const Modal = ({ setEnvironment, modalState, setModalState }) => {
    const [confirmValue, setConfirmValue] = useState("");
    const [border, setBorder] = useState("input-primary");
    const inputRef = useRef(null);

    //focus on modal input when opened
    useEffect(() => {
        inputRef.current.focus();
    }, [modalState]);

    //update input state
    function handleConfirmInput(e) {
        setConfirmValue(e.target.value);
        if (e.target.value === "") {
            setBorder("input-primary");
        }
    }

    //check Confirm input to see if what is entered is correct
    function confirmBtnHandler(e) {
        e.preventDefault();
        if (confirmValue.trim() === "Confirm") {
            setModalState("");
            setConfirmValue("");
            setBorder("input-primary");
        } else {
            setBorder("input-error");
        }
    }

    //minimize modal when user clicks close or x button
    function removeModal(e) {
        e.preventDefault();
        setModalState("");
        setEnvironment("Test");
        setConfirmValue("");
    }

    //when user clicks enter check input
    const handleKeypress = (e) => {
        //it triggers by pressing the enter key
        if (e.key === "Enter") {
            e.preventDefault();
            confirmBtnHandler(e);
        }
    };

    return (
        <>
            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
            <div className={"modal " + modalState}>
                <div className="modal-box relative">
                    <label
                        htmlFor="my-modal-3"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                        onClick={removeModal}
                    >
                        ✕
                    </label>
                    <h3 className="text-lg font-bold">Wait!</h3>
                    <p className="py-4 text-lg">You are about to select the "Production" environment!</p>
                    <div className="flex mb-4">
                        <p className="">
                            Type <span className="italic inline-block mr-1">Confirm</span> to continue
                        </p>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Confirm"
                            className={`input input-bordered w-full max-w-xs inline-block ${border}`}
                            onChange={handleConfirmInput}
                            value={confirmValue}
                            onKeyPress={handleKeypress}
                        />
                    </div>
                    <div className="flex justify-end">
                        <label htmlFor="my-modal-3" className="btn btn-outline mr-3" onClick={removeModal}>
                            Cancel
                        </label>
                        <label htmlFor="my-modal-3" className="btn btn-primary" onClick={confirmBtnHandler}>
                            Confirm
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
