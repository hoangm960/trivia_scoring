import React, { useState, useEffect } from "react";
import { API_BASE } from "../constants/api";
import { Answer } from "../components/radio_answer";
import { Button } from "../components/button";
import CheckIcon from "../assets/check.png";

function QuestionPage({
	bet,
	teamId,
	currentQuestion,
	currentDuration,
	teamName,
	numQuestions,
}) {
	// currentQuestion: the current question index (assumed 1-based)
	const [selectedAnswer, setSelectedAnswer] = useState("");
	const [timeLeft, setTimeLeft] = useState(currentDuration);

	// When the questionDuration prop changes (new question), reset the timer.
	useEffect(() => {
		setTimeLeft(currentDuration);
	}, [currentDuration]);

	// Countdown timer logic.
	useEffect(() => {
		if (timeLeft <= 0) return;
		const timerId = setInterval(() => {
			setTimeLeft(prev => prev - 1);
		}, 1000);
		return () => clearInterval(timerId);
	}, [timeLeft]);

	// Update selected answer.
	const updateAnswer = value => {
		setSelectedAnswer(value);
	};

	// Handle answer submission.
	const handleSubmit = async e => {
		e.preventDefault();
		if (!selectedAnswer) {
			alert("Please select an answer");
			return;
		}
		try {
			const response = await fetch(`${API_BASE}/api/answerQuestion`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					teamId,
					answer: selectedAnswer,
					bet,
				}),
			});
			const data = await response.json();
			console.log("Answer submitted:", data);
		} catch (error) {
			console.error("Error submitting answer", error);
		}
	};

	return (
		<>
			<div className="team-info">
				<div className="team-name">{teamName}</div>
				<div className="question-counter-container">
					<div className="question">Question:</div>
					<div className="question-number">
						{currentQuestion}/{numQuestions}
					</div>
				</div>
			</div>
			<div className="timer">{timeLeft}</div>
			<div className="question-container">
				<div className="question-text">
					What answer did the team choose?
				</div>
				<div className="answers">
					<div className="answer-row">
						<Answer
							id="choiceA"
							value="A"
							onClick={() => updateAnswer("A")}
						/>
						<Answer
							id="choiceB"
							value="B"
							onClick={() => updateAnswer("B")}
						/>
					</div>
					<div className="answer-row">
						<Answer
							id="choiceC"
							value="C"
							onClick={() => updateAnswer("C")}
						/>
						<Answer
							id="choiceD"
							value="D"
							onClick={() => updateAnswer("D")}
						/>
					</div>
				</div>
				<div className="submit-button-container">
					<Button
						text="Submit"
						icon={CheckIcon}
						inputType="submit"
						onClick={handleSubmit}
					/>
				</div>
			</div>
		</>
	);
}

export default QuestionPage;
