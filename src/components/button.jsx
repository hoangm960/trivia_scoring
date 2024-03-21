import React from "react";
import { useReducer } from "react";
import "./style/button.css";

export const Button = ({
    text,
    type,
    icon,
    stateProp,
    onClick
}) => {
    const [state, dispatch] = useReducer(reducer, {
        type: type || "action",
        state: stateProp || "default",
    });

    return (
        <button
            className={`button ${state.state}`}
            onMouseLeave={() => {
                dispatch("mouse_leave");
            }}
            onMouseEnter={() => {
                dispatch("mouse_enter");
            }}
            onClick={onClick}
        >
            {text != null && <button className="btn-text">{text}</button>}

            {icon != null && <img className="right-icon" src={icon} alt="right-icon" />}
        </button>
    );
};

function reducer(state, action) {
    switch (action) {
        case "mouse_enter":
            return {
                ...state,
                state: "hover",
            };

        case "mouse_leave":
            return {
                ...state,
                state: "default",
            };
        default:
            return state;
    }
}