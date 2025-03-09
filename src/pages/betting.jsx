import React, { useState } from "react";
import { InputBox } from "../components/input_box";
import { Button } from "../components/button";
import CheckIcon from "../assets/check.png";
import Loading from "../components/loading";

const BettingPage = ({
	onBetSubmit,
	currentQuestion,
	numQuestions,
	teamInfo,
}) => {
	const [bet, setBet] = useState("");
	const [betSubmitted, setBetSubmitted] = useState(false);

	const handleBet = e => {
		e.preventDefault();
		const betValue = parseInt(bet, 10);
		const currentCredit = teamInfo.credit;

		if (isNaN(betValue) || betValue <= 0) {
			alert("Please enter a positive number for your bet.");
			return;
		}
		if (betValue > currentCredit) {
			alert("Your bet cannot exceed your current team credit.");
			return;
		}
		if (
			currentQuestion <= 10 &&
			betValue > Math.floor((currentCredit + 1) / 2)
		) {
			alert(
				`For the first 10 questions, your bet can only be up to ${Math.floor((currentCredit + 1) / 2)}.`
			);
			return;
		}

		setBetSubmitted(true);
		onBetSubmit(betValue);
	};

	// Optionally show a waiting message if the bet has been submitted.
	if (betSubmitted) {
		return (
			<div className="submit-button-container">
				<Loading msg="Waiting for host to start the question..." />
			</div>
		);
	}

	return (
		<div className="submit-button-container">
			<div className="question-counter-container">
				<div className="question">Question:</div>
				<div className="question-number">
					{currentQuestion}/{numQuestions}
				</div>
			</div>
			<div className="team-info-container">
				<div className="info-container">
					<div className="team-label">Team:</div>
					<div className="team-name">{teamInfo.name}</div>
				</div>
				<div className="info-container">
					<div className="team-label">Credits:</div>
					<div className="team-value">{teamInfo.credit}</div>
				</div>
			</div>
			<InputBox
				id="betInput"
				title="Bet EC"
				placeHolder="Enter bet EC here..."
				type="number"
				value={bet}
				onChange={e => setBet(e.target.value)}
			/>
			<Button
				text="Submit"
				icon={CheckIcon}
				inputType="submit"
				onClick={handleBet}
			/>
		</div>
	);
};

export default BettingPage;
