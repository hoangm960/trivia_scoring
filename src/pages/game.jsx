import React, { useState, useEffect } from "react";
import BettingPage from "./betting";
import QuestionPage from "./question";
import { API_BASE } from "../constants/api";
import Loading from "../components/loading";
import "./style/team.css";

function Game() {
	const [gameStatus, setGameStatus] = useState();
	const [currentQuestion, setCurrentQuestion] = useState(1);
	const [bet, setBet] = useState(null);
	const [betSubmitted, setBetSubmitted] = useState(false);
	const [questionDurations, setQuestionDurations] = useState([]);
	const [isInitialized, setIsInitialized] = useState(false);

	const teamId = localStorage.getItem("team");
	const [teamInfo, setTeamInfo] = useState({});

	// Poll backend every 2 seconds for game status and current question.
	useEffect(() => {
		const intervalId = setInterval(() => {
			fetch(`${API_BASE}/api/gameStatus`)
				.then(res => res.json())
				.then(data => {
					setGameStatus(data.status);
				})
				.catch(err =>
					console.error("Error fetching game status:", err)
				);

			fetch(`${API_BASE}/api/teamInfo`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ teamID: teamId }),
			})
				.then(res => {
					if (res.status === 400) return;
					return res.json();
				})
				.then(data => {
					if (!data) return;
					setTeamInfo({ ...data });
					setIsInitialized(true);
				})
				.catch(err => console.error("Error fetching team info:", err));

			fetch(`${API_BASE}/api/currentQuestion`)
				.then(res => res.json())
				.then(data => setCurrentQuestion(data.currentQuestion))
				.catch(err =>
					console.error("Error fetching current question:", err)
				);
		}, 500);

		return () => clearInterval(intervalId);
	}, [gameStatus]);

	useEffect(() => {
		fetch(`${API_BASE}/api/allQuestionDurations`)
			.then(res => res.json())
			.then(data => {
				setQuestionDurations(data.durations);
			})
			.catch(err =>
				console.error("Error fetching question durations:", err)
			);
	}, []);

	const currentDuration =
		questionDurations.find(item => item.index === currentQuestion)
			?.duration || 30;

	const handleBetSubmit = betValue => {
		setBet(betValue);
		setBetSubmitted(true);
	};

	useEffect(() => {
		if (gameStatus === "ended") setBetSubmitted(false);
	}, [gameStatus]);

	if (!isInitialized) {
		return (
			<div className="team-container">
				<Loading msg="Waiting for host to initialize the game..." />
			</div>
		);
	}

	if (questionDurations == 0 || !gameStatus) {
		return (
			<div className="team-container">
				<Loading msg="Loading..." />
			</div>
		);
	}

	if (gameStatus === "ended") {
		return (
			<div className="team-container">
				<Loading msg="Waiting for host to tally up the score..." />
			</div>
		);
	}

	if (gameStatus === "summarized") {
		return (
			<div className="team-container">
				<Loading msg="Waiting for next question..." />
			</div>
		);
	}

	if (gameStatus === "pending" && betSubmitted) {
		return (
			<div className="team-container">
				<Loading msg="Waiting for host to start the question..." />
			</div>
		);
	}

	if (gameStatus === "pending" && !betSubmitted) {
		return (
			<div className="team-container">
				<BettingPage
					onBetSubmit={handleBetSubmit}
					betSubmitted={betSubmitted}
					currentQuestion={currentQuestion}
					numQuestions={questionDurations.length}
					teamInfo={teamInfo}
				/>
			</div>
		);
	}

	if (gameStatus === "started" && betSubmitted) {
		return (
			<div className="team-container">
				<QuestionPage
					bet={bet}
					teamId={teamId}
					currentQuestion={currentQuestion}
					currentDuration={currentDuration}
					numQuestions={questionDurations.length}
				/>
			</div>
		);
	}

	return (
		<div className="team-container">
			<Loading msg="Loading..." />
		</div>
	);
}

export default Game;
