import React from "react";
import "./style/radio_answer.css";

export const Answer = ({ id, value, onClick }) => {
	return (
		<>
			<input
				type="radio"
				id={id}
				name="choices"
				value={value}
				onClick={onClick}
			/>
			<label htmlFor={id} className="answer">
				{value}
			</label>
		</>
	);
};
