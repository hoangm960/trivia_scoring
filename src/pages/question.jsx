import React, { useState, useEffect } from "react";
import { Answer } from "../components/radio_answer";
import { fetchData } from "../helper/handleData";

function QuestionPage({
	teamId,
	currentQuestion,
	currentDuration,
	teamName,
	numQuestions,
	setAnswerSubmitted,
}) {
	const [selectedAnswer, setSelectedAnswer] = useState("E");
	const [timeLeft, setTimeLeft] = useState(currentDuration);

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

	useEffect(() => {
		const timerId = setInterval(() => {
			setTimeLeft(time => {
				if (time === 0) {
					clearInterval(timerId);
					handleAnswer(selectedAnswer);
					return 0;
				} else return time - 1;
			});
		}, 1000);
		return () => clearInterval(timerId);
		//eslint-disable-next-line
	}, []);

	const updateAnswer = value => {
		if (value === selectedAnswer) return;
		setSelectedAnswer(value);
		handleAnswer(value);
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
			</div>
		</>
	);
}

export default QuestionPage;
