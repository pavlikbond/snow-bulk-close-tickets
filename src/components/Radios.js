import { Container } from "postcss";
import { useState } from "react";

const Radios = ({ updateVandE }) => {
    const [environment, setEnvironment] = useState("Test");
    const [version, setVersion] = useState("V1");

    let handleEnvironment = (e) => {
        setEnvironment(e.target.value);
        updateVandE(version, e.target.value);
    };
    let handleVersion = (e) => {
        setVersion(e.target.value);
        updateVandE(e.target.value, environment);
    };

    return (
        <div className="radios-container flex justify-between">
            <div className="options-container">
                <div className="btn-group inline-block">
                    <div className="py-1 font-bold">
                        <p>Select Environment</p>
                    </div>
                    <input
                        onChange={handleEnvironment}
                        value="Test"
                        type="radio"
                        name="environment"
                        data-title="Test"
                        className="btn"
                        checked={environment === "Test"}
                    />
                    <input
                        value="Prod"
                        onChange={handleEnvironment}
                        type="radio"
                        name="environment"
                        data-title="Prod"
                        className="btn"
                        checked={environment === "Prod"}
                    />
                </div>
            </div>

            <div className="options-container">
                <div className="btn-group inline-block">
                    <div className="py-1 font-bold">
                        <p className="">Select Version</p>
                    </div>
                    <input
                        onChange={handleVersion}
                        value="V1"
                        type="radio"
                        name="version"
                        data-title="V1"
                        className="btn"
                        checked={version === "V1"}
                    />
                    <input
                        onChange={handleVersion}
                        value="V2"
                        type="radio"
                        name="version"
                        data-title="Envision-X"
                        className="btn"
                        checked={version === "V2"}
                    />
                </div>
            </div>
        </div>
    );
};

export default Radios;
