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
import Loading from "../components/loading";
import "./style/team.css";

function Game() {
	const [gameStatus, setGameStatus] = useState("pending"); // e.g. "pending" or "started"
	const [currentQuestion, setCurrentQuestion] = useState(1);
	const [bet, setBet] = useState(null);
	const [betSubmitted, setBetSubmitted] = useState(false);
	const [teamCredit, setTeamCredit] = useState(30); // initial team credit; adjust as needed
	const [questionDurations, setQuestionDurations] = useState([]);

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

	if (questionDurations == 0) {
		return (
			<div className="team-container">
				<Loading msg="Loading..." />
			</div>
		);
	}

	return (
		<div className="team-container">
			<Switch>
				<Route path={`${path}/betting`}>
					<BettingPage
						onBetSubmit={handleBetSubmit}
						betSubmitted={betSubmitted}
						currentQuestion={currentQuestion}
						currentCredit={teamCredit}
						numQuestions={questionDurations.length}
						teamName="meng"
					/>
				</Route>
				<Route path={`${path}/question`}>
					<QuestionPage
						bet={bet}
						teamId={teamId}
						currentQuestion={currentQuestion}
						currentDuration={currentDuration}
						numQuestions={questionDurations.length}
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
