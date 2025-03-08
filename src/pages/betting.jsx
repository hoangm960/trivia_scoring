import React, { useState } from "react";

const BettingPage = ({
	onBetSubmit,
	betSubmitted,
	initialBet,
	currentQuestion,
	teamCredit,
}) => {
	const [bet, setBet] = useState(initialBet || "");

	const handleSubmit = e => {
		e.preventDefault();
		const betValue = parseInt(bet, 10);

		if (isNaN(betValue) || betValue <= 0) {
			alert("Please enter a positive number for your bet.");
			return;
		}
		if (betValue > teamCredit) {
			alert("Your bet cannot exceed your current team credit.");
			return;
		}
		if (
			currentQuestion <= 10 &&
			betValue > Math.floor((teamCredit + 1) / 2)
		) {
			alert(
				`For the first 10 questions, your bet can only be up to ${Math.floor((teamCredit + 1) / 2)}.`
			);
			return;
		}
		onBetSubmit(betValue);
	};

	return (
		<div>
			<h1>Betting Page</h1>
			<div style={{ marginBottom: "1em" }}>
				<p>
					Current Question: <strong>{currentQuestion}</strong>
				</p>
				<p>
					Team Credit: <strong>{teamCredit}</strong>
				</p>
			</div>
			{betSubmitted ? (
				<p>Bet submitted! Waiting for host to start the question...</p>
			) : (
				<form onSubmit={handleSubmit}>
					<label>
						Enter your bet:
						<input
							type="number"
							value={bet}
							onChange={e => setBet(e.target.value)}
						/>
					</label>
					<button type="submit">Submit Bet</button>
				</form>
			)}
		</div>
	);
};

export default BettingPage;
