import React, { useState, useEffect } from "react";
import {
	Switch,
	Route,
	useRouteMatch,
	useHistory,
	Redirect,
} from "react-router-dom";
import BettingPage from "./betting";
import QuestionPage from "./question";
import { API_BASE } from "../constants/api";

function Game() {
	const [gameStatus, setGameStatus] = useState("pending"); // e.g. "pending" or "started"
	const [currentQuestion, setCurrentQuestion] = useState(1);
	const [bet, setBet] = useState(null);
	const [betSubmitted, setBetSubmitted] = useState(false);
	const [teamCredit, setTeamCredit] = useState(30); // initial team credit; adjust as needed

	// Get teamId from localStorage.
	const teamId = localStorage.getItem("team");

	const { path, url } = useRouteMatch();
	const history = useHistory();

	// Poll backend every 2 seconds for game status and current question.
	useEffect(() => {
		const intervalId = setInterval(() => {
			fetch(`${API_BASE}/api/gameStatus`)
				.then(res => res.json())
				.then(data => {
					setGameStatus(data.status);
					if (data.status === "started") {
						history.push(`${url}/question`);
					} else {
						history.push(`${url}/betting`);
					}
				})
				.catch(err =>
					console.error("Error fetching game status:", err)
				);

			fetch(`${API_BASE}/api/currentQuestion`)
				.then(res => res.json())
				.then(data => setCurrentQuestion(data.currentQuestion))
				.catch(err =>
					console.error("Error fetching current question:", err)
				);
		}, 2000);

		return () => clearInterval(intervalId);
	}, [history, url]);

	const handleBetSubmit = betValue => {
		setBet(betValue);
		setBetSubmitted(true);
		// Optionally send the bet to your backend here.
		history.push(`${url}/question`);
	};

	return (
		<div>
			<Switch>
				<Route path={`${path}/betting`}>
					<BettingPage
						onBetSubmit={handleBetSubmit}
						betSubmitted={betSubmitted}
						initialBet={bet}
						currentQuestion={currentQuestion}
						teamCredit={teamCredit}
					/>
				</Route>
				<Route path={`${path}/question`}>
					<QuestionPage
						bet={bet}
						teamId={teamId}
						currentQuestion={currentQuestion}
					/>
				</Route>
				<Route exact path={path}>
					<Redirect to={`${url}/betting`} />
				</Route>
			</Switch>
		</div>
	);
}

export default Game;
