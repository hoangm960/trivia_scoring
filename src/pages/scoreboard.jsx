import React, { useEffect, useState } from "react";
import "./style/scoreboard.css";
import Loading from "../components/loading";
import logo from "../assets/stem_club_logo.png";
import { QUESTION_STATUS } from "../constants/questionConst";
import { API_BASE } from "../constants/api.js";
import Table from "../components/table_scoreboard";
import { socket } from "../socket.js";

function Scoreboard() {
	const [questionDurations, setQuestionDurations] = useState([]);
	const [gameStatus, setGameStatus] = useState();
	const [currentQuestion, setCurrentQuestion] = useState(1);
	const [teamsInfo, setTeamsInfo] = useState([]);
	const [timeLeft, setTimeLeft] = React.useState(null);

	useEffect(() => {
		fetch(`${API_BASE}/api/teams`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		})
			.then(res => {
				if (res.status === 400) return;
				return res.json();
			})
			.then(data => {
				if (!data) return;
				setTeamsInfo(data.teams);
			})
			.catch(err => console.error("Error fetching team name:", err));
	}, []);

	useEffect(() => {
		function onGameStatusEvent(newStatus) {
			setGameStatus(newStatus);
		}

		socket.on("gameStatus", onGameStatusEvent);

		return () => {
			socket.off("gameStatus", onGameStatusEvent);
		};
	}, []);

	useEffect(() => {
		fetch(`${API_BASE}/api/currentQuestion`)
			.then(res => res.json())
			.then(data => setCurrentQuestion(data.currentQuestion))
			.catch(err =>
				console.error("Error fetching current question:", err)
			);
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

	useEffect(() => {
		if (gameStatus === "started") {
			const currentDuration =
				questionDurations?.find(item => item.index === currentQuestion)
					?.duration || 30;
			setTimeLeft(currentDuration);
		}
	}, [gameStatus, currentQuestion, questionDurations]);

	useEffect(() => {
		if (timeLeft <= 0) return;
		const timerId = setInterval(() => {
			setTimeLeft(prev => prev - 1);
		}, 1000);
		return () => clearInterval(timerId);
	}, [timeLeft]);

	return (
		<div className="scoreboard-container">
			<img src={logo} alt="Logo" className="logo" />
			{gameStatus === QUESTION_STATUS.IN_PROGRESS ? (
				<div className="scoreboard-timer">{timeLeft}</div>
			) : (
				<></>
			)}
			<div className="scoreboard-title-container">
				<span className="scoreboard-title">SCOREBOARD</span>
			</div>
			{questionDurations === 0 || !gameStatus ? (
				<Loading msg="Loading scoreboard..." />
			) : (
				<Table
					teams={teamsInfo}
					currentQuestion={currentQuestion}
				></Table>
			)}
		</div>
	);
}

export default Scoreboard;
