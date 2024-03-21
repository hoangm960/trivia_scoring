import React from "react";
import "./style/login_input.css";

export const LoginInput = ({
    id,
    placeHolder = "Enter text here...",
    isPassword = false,
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
                    type={isPassword ? "password" : "text"}
                    id={id}
                    className="input"
                    placeholder={placeHolder}
                />
            </div>
        </div>
    );
};