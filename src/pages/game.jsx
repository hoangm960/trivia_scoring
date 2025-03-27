import React, { useState, useEffect } from "react";
import BettingPage from "./betting";
import QuestionPage from "./question";
import { API_BASE } from "../constants/api";
import Loading from "../components/loading";
import "./style/team.css";
import { Button } from "../components/button";
import { useHistory } from "react-router-dom";
import LogOutIcon from "../assets/logout.png";
import { socket } from "../socket.js";
import { QUESTION_STATUS } from "../constants/questionConst.js";

function Game() {
	const [gameStatus, setGameStatus] = useState();
	const [currentQuestion, setCurrentQuestion] = useState(1);
	const [questionDurations, setQuestionDurations] = useState([]);
	const [isInitialized, setIsInitialized] = useState(false);

	const teamId = localStorage.getItem("team");
	const history = useHistory();
	const [teamName, setTeamName] = useState();
	const [currentCredit, setCurrentCredit] = useState(0);
	const [betSubmitted, setBetSubmitted] = useState(false);

	useEffect(() => {
		function onGameDataEvent(newData) {
			setGameStatus(newData.status);
			setCurrentQuestion(newData.current_index);
		}

		socket.on("gameData", onGameDataEvent);

		return () => {
			socket.off("gameData", onGameDataEvent);
		};
	}, [history]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			fetch(`${API_BASE}/api/teamName`, {
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
					setTeamName(data.name);
					setIsInitialized(true);
					clearInterval(intervalId);
				})
				.catch(err => console.error("Error fetching team name:", err));
		}, 2000);
		return () => clearInterval(intervalId);
	}, [teamId]);

	useEffect(() => {
		fetch(`${API_BASE}/api/teamCredit`, {
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
				setCurrentCredit(data.credit);
				setIsInitialized(true);
			})
			.catch(err => console.error("Error fetching team credit:", err));
	}, [gameStatus, currentQuestion, teamId]);

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
		questionDurations?.find(item => item.index === currentQuestion)
			?.duration || 30;

	const handleLogOut = async () => {
		fetch(`${API_BASE}/api/logout`, {
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ teamID: teamId }),
		});
		localStorage.removeItem("team");
		history.push("/");
	};

	if (!isInitialized) {
		return (
			<div className="team-container">
				<Loading msg="Waiting for host to initialize the game..." />
				<Button
					id="logout"
					type="destructive"
					icon={LogOutIcon}
					text="Logout"
					onClick={handleLogOut}
				/>
			</div>
		);
	}

	if (questionDurations === 0 || !gameStatus || !teamName) {
		return (
			<div className="team-container">
				<Loading msg="Loading..." />
			</div>
		);
	}

	if (betSubmitted && gameStatus === QUESTION_STATUS.NOT_STARTED) {
		return (
			<div className="team-container">
				<Loading msg="Waiting for host to start the question..." />
			</div>
		);
	}

	if (gameStatus === QUESTION_STATUS.FINISHED) {
		return (
			<div className="team-container">
				<Loading msg="Waiting for host to tally up the score..." />
			</div>
		);
	}

	if (gameStatus === QUESTION_STATUS.SUMMARIZED) {
		return (
			<div className="team-container">
				<Loading msg="Waiting for next question..." />
				<Button
					id="logout"
					type="destructive"
					icon={LogOutIcon}
					text="Logout"
					onClick={handleLogOut}
				/>
			</div>
		);
	}

	if (gameStatus === QUESTION_STATUS.NOT_STARTED) {
		return (
			<div className="team-container">
				<BettingPage
					currentQuestion={currentQuestion}
					numQuestions={questionDurations.length}
					teamInfo={{
						teamId: teamId,
						name: teamName,
						credit: currentCredit,
					}}
					setBetSubmitted={setBetSubmitted}
				/>
			</div>
		);
	}

	if (gameStatus === QUESTION_STATUS.IN_PROGRESS) {
		return (
			<div className="team-container">
				<QuestionPage
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
			<Loading msg="Something went wrong! Please wait..." />
		</div>
	);
}

export default Game;
