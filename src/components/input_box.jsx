import React from "react";
import "./style/input_box.css";

export const InputBox = ({
    id,
    placeHolder = "Enter text here...",
    type = "text",
    title = "Text",
}) => {
    return (
        <div className="input-field">
            <div className="input-label">
                <div className="label-frame">
                    <div className="label">{title}</div>
                </div>
            </div>
            <div className="input-frame">
                <input
                    type={type}
                    id={id}
                    className="input"
                    placeholder={placeHolder}
                />
            </div>
        </div>
    );
};