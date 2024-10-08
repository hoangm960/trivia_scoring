import React from "react";
import "./style/radio_answer.css";

export const Answer = ({
    id,
    text
}) => {

    return (
        <>
            <input type="radio" id={id} name="choices" value="A"/>
            <label htmlFor={id} className="answer">{text}</label>
        </>
    );
};