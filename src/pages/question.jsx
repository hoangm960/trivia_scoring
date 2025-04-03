import React, { useState, useEffect } from "react";
import Loading from "../components/loading";
import { Answer } from "../components/radio_answer";
import { fetchData } from "../helper/handleData";
import { socket } from "../socket.js";

function QuestionPage({
	teamId,
	currentQuestion,
	currentDuration,
	teamName,
	numQuestions,
	setAnswerSubmitted,
}) {
	const [selectedAnswer, setSelectedAnswer] = useState("E");
	const [timeLeft, setTimeLeft] = useState(null);

	const handleAnswer = async answer => {
		await fetchData(
			"answerQuestion",
			"POST",
			{
				teamId,
				answer: answer,
			},
			_ => {
				setAnswerSubmitted(true);
				console.log("Answer submitted:", answer);
			}
		);
	};

	const updateAnswer = value => {
		if (value === selectedAnswer) return;
		setSelectedAnswer(value);
		handleAnswer(value);
	};

	useEffect(() => {
		socket.on("timeLeft", setTimeLeft);
		return () => socket.off("timeLeft", setTimeLeft);
	}, []);

	useEffect(() => {
		if (timeLeft === 0) handleAnswer(selectedAnswer);
	}, [timeLeft]);

	if (timeLeft === null) {
		return <Loading msg={"Loading..."}></Loading>;
	}

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
			</div>
		</>
	);
}

export default QuestionPage;
