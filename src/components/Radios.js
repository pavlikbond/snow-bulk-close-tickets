import { Container } from "postcss";
import { useState } from "react";

const Radios = ({ changeRadios }) => {
    const [environment, setEnvironment] = useState("Test");
    const [version, setVersion] = useState("V1");
    const [state, setState] = useState("resolve");

    let handleEnvironment = (e) => {
        setEnvironment(e.target.value);
        changeRadios(version, e.target.value, state);
    };
    let handleVersion = (e) => {
        setVersion(e.target.value);
        changeRadios(e.target.value, environment, state);
    };

    let handleState = (e) => {
        setState(e.target.value);
        changeRadios(version, environment, e.target.value);
    };

    return (
        <div className="radios-container flex justify-between">
            <div className="options-container">
                <div className="btn-group inline-block">
                    <div className="py-1 font-bold">
                        <p>Environment</p>
                    </div>
                    <input
                        onChange={handleEnvironment}
                        value="Test"
                        type="radio"
                        name="environment"
                        data-title="Test"
                        className="btn text-xs px-3 md:px-1 lg:text-sm lg:px-3"
                        checked={environment === "Test"}
                    />
                    <input
                        value="Prod"
                        onChange={handleEnvironment}
                        type="radio"
                        name="environment"
                        data-title="Prod"
                        className="btn text-xs px-3 md:px-1 lg:text-sm lg:px-3"
                        checked={environment === "Prod"}
                    />
                </div>
            </div>

            <div className="options-container">
                <div className="btn-group inline-block">
                    <div className="py-1 font-bold">
                        <p className="">Version</p>
                    </div>
                    <input
                        onChange={handleVersion}
                        value="V1"
                        type="radio"
                        name="version"
                        data-title="V1"
                        className="btn text-xs px-3 md:px-1 lg:text-sm lg:px-3"
                        checked={version === "V1"}
                    />
                    <input
                        onChange={handleVersion}
                        value="V2"
                        type="radio"
                        name="version"
                        data-title="Env-X"
                        className="btn text-xs px-3 md:px-1 lg:text-sm lg:px-3"
                        checked={version === "V2"}
                    />
                </div>
            </div>

            <div className="options-container">
                <div className="btn-group inline-block">
                    <div className="py-1 font-bold">
                        <p>State</p>
                    </div>
                    <input
                        onChange={handleState}
                        value="resolve"
                        type="radio"
                        name="state"
                        data-title="resolve"
                        className="btn text-xs px-3 md:px-1 lg:text-sm lg:px-3"
                        checked={state === "resolve"}
                    />
                    <input
                        value="cancel"
                        onChange={handleState}
                        type="radio"
                        name="state"
                        data-title="cancel"
                        className="btn text-xs px-3 md:px-1 lg:text-sm lg:px-3"
                        checked={state === "cancel"}
                    />
                </div>
            </div>
        </div>
    );
};

export default Radios;
