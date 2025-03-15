import React, { useState, useEffect } from "react";
import BettingPage from "./betting";
import QuestionPage from "./question";
import { API_BASE } from "../constants/api";
import Loading from "../components/loading";
import "./style/team.css";
import { Button } from "../components/button";
import { useHistory } from "react-router-dom";
import LogOutIcon from "../assets/logout.png";

function Game() {
	const [gameStatus, setGameStatus] = useState();
	const [currentQuestion, setCurrentQuestion] = useState(1);
	const [bet, setBet] = useState(null);
	const [questionDurations, setQuestionDurations] = useState([]);
	const [isInitialized, setIsInitialized] = useState(false);

	const teamId = localStorage.getItem("team");
	const history = useHistory();
	const [teamName, setTeamName] = useState("Team Name");
	const [currentCredit, setCurrentCredit] = useState(0);

	useEffect(() => {
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
			})
			.catch(err => console.error("Error fetching team name:", err));
	}, []);

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
		}, 1000);
		return () => clearInterval(intervalId);
	}, [gameStatus, teamId]);

	useEffect(() => {
		fetch(`${API_BASE}/api/currentQuestion`)
			.then(res => res.json())
			.then(data => setCurrentQuestion(data.currentQuestion))
			.catch(err =>
				console.error("Error fetching current question:", err)
			);
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
			.catch(err => console.error("Error fetching team name:", err));
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

	const handleLogOut = async () => {
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

	if (questionDurations === 0 || !gameStatus) {
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

	if (gameStatus === "pending") {
		return (
			<div className="team-container">
				<BettingPage
					onBetSubmit={setBet}
					currentQuestion={currentQuestion}
					numQuestions={questionDurations.length}
					teamInfo={{
						name: teamName,
						credit: currentCredit,
					}}
				/>
			</div>
		);
	}

	if (gameStatus === "started") {
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
			<Loading msg="Something went wrong! Please wait..." />
		</div>
	);
}

export default Game;
