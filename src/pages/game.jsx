import React, { useState, useEffect } from "react";
import BettingPage from "./betting";
import QuestionPage from "./question";
import Loading from "../components/loading";
import "./style/team.css";
import { Button } from "../components/button";
import { useHistory } from "react-router-dom";
import LogOutIcon from "../assets/logout.png";
import { socket } from "../socket.js";
import { QUESTION_STATUS } from "../constants/questionConst.js";
import { fetchData } from "../helper/handleData.js";

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
		fetchData("teamName", "POST", { teamID: teamId }, data => {
			setTeamName(data.name);
		});
	}, [teamId]);

	useEffect(() => {
		fetchData("teamCredit", "POST", { teamID: teamId }, data => {
			setCurrentCredit(data.credit);
			setIsInitialized(true);
		});
	}, [gameStatus, currentQuestion, teamId]);

	useEffect(() => {
		fetchData("allQuestionDurations", undefined, undefined, data =>
			setQuestionDurations(data.durations)
		);
	}, []);

	useEffect(() => {
		if (gameStatus === QUESTION_STATUS.SUMMARIZED) {
			setBetSubmitted(false);
		}
	}, [gameStatus]);

	const currentDuration = questionDurations.find(
		item => item.index === currentQuestion
	)?.duration;

	const handleLogOut = async () => {
		fetchData("logout", "PUT", { teamID: teamId }, _ => {
			localStorage.removeItem("team");
			history.push("/");
		});
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

	if (questionDurations?.length === 0 || !gameStatus || !teamName) {
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

	if (currentQuestion === questionDurations.length) {
		return history.push("/game_over");
	}

	return (
		<div className="team-container">
			<Loading msg="Something went wrong! Please wait..." />
		</div>
	);
}

export default Game;
