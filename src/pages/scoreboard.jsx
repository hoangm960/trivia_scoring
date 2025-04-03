import React, { useEffect, useState } from "react";
import "./style/scoreboard.css";
import Loading from "../components/loading";
import logo from "../assets/stem_club_logo.png";
import { GAME_STATUS } from "../constants/gameStatus.js";
import Table from "../components/table_scoreboard";
import { socket } from "../socket.js";
import { fetchData } from "../helper/handleData.js";

function Scoreboard() {
	const [questionDurations, setQuestionDurations] = useState([]);
	const [gameStatus, setGameStatus] = useState();
	const [currentQuestion, setCurrentQuestion] = useState(1);
	const [teamsInfo, setTeamsInfo] = useState([]);
	const [timeLeft, setTimeLeft] = React.useState(null);

	useEffect(() => {
		fetchData("teams", undefined, undefined, data =>
			setTeamsInfo(data.teams)
		);
	}, [gameStatus]);

	useEffect(() => {
		function onGameDataEvent(newData) {
			setGameStatus(newData.status);
			setCurrentQuestion(newData.current_index);
		}

		socket.connect();
		socket.on("gameData", onGameDataEvent);

		return () => {
			socket.off("gameData", onGameDataEvent);
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		fetchData("allQuestionDurations", undefined, undefined, data =>
			setQuestionDurations(data.durations)
		);
	}, []);

	useEffect(() => {
		if (gameStatus === GAME_STATUS.IN_PROGRESS) {
			const currentDuration =
				questionDurations?.find(item => item.index === currentQuestion)
					?.duration || 30;
			setTimeLeft(currentDuration);
		}
	}, [gameStatus, currentQuestion, questionDurations]);

	useEffect(() => {
		const timerId = setInterval(() => {
			setTimeLeft(time => {
				if (time === 0) {
					clearInterval(timerId);
					return 0;
				} else return time - 1;
			});
		}, 1000);
		return () => clearInterval(timerId);
		//eslint-disable-next-line
	}, []);

	return (
		<div className="scoreboard-container">
			{/* <img src={logo} alt="Logo" className="logo" /> */}
			{gameStatus === GAME_STATUS.IN_PROGRESS && (
				<div className="scoreboard-timer">{timeLeft}</div>
			)}
			<div className="scoreboard-title-container">
				<span className="scoreboard-title">SCOREBOARD</span>
			</div>
			{questionDurations === 0 || !gameStatus ? (
				<Loading msg="Loading scoreboard..." />
			) : gameStatus === GAME_STATUS.NOT_INITIALIZE ? (
				<Loading msg="Waiting for host to initialize the game..." />
			) : (
				<div className="scoreboard-table-container">
					<Table
						teams={teamsInfo}
						currentQuestion={currentQuestion}
					></Table>
				</div>
			)}
		</div>
	);
}

export default Scoreboard;
