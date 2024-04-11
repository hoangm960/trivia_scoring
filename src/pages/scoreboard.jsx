import React, { useEffect } from 'react';
import './style/scoreboard.css';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import RowScoreboard from '../components/row_scoreboard';
import Loading from '../components/loading';
import logo from "../assets/stem_club_logo.png";

const QuestionStatus = {
    NOT_STARTED: 'pending',
    IN_PROGRESS: 'started',
    FINISHED: 'ended'
};

function Scoreboard() {
	const [sortedTeams, setSortedTeams] = React.useState([]);
    const [questionStatus, setQuestionStatus] = React.useState(QuestionStatus.NOT_STARTED);
	const [duration, setDuration] = React.useState(null);
	const [questionNumber, setQuestionNumber] = React.useState(0);
    const [questions, setQuestions] = React.useState([]);

	useEffect(() => {
        if (questionStatus === QuestionStatus.NOT_STARTED) {
            setDuration(0);
        }
        if (questionStatus === QuestionStatus.IN_PROGRESS) {
            setDuration(questions[questionNumber - 1].duration);
        }
    }, [questionStatus, questions, questionNumber]);

    useEffect(() => {
        if (duration === 0) {
            setDuration(null);
        }

        if (!duration) return;

        const interval = setInterval(() => {
            setDuration(duration - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [duration]);

	const getScoreboard = async () => {
		const questionSnap = await getDoc(doc(db, "game", "2024g"));
		const teamRef = query(collection(db, "history"));
		onSnapshot(teamRef, (docs) => {
			const teams = [];
			docs.forEach((doc) => {
				teams.push(doc.data());
			});
			setSortedTeams(teams.sort((a, b) => {
				return b.score - a.score;
			},).map((team, index) => {
				return (
					<RowScoreboard
					index={index + 1}
					name={team.name}
					correct={team.correctAnswers}
					total={questionSnap.data().current_index}
					score={team.credit}
					key={index}
					/>
				);
			}));
			setQuestionStatus(questionSnap.data().status);

		});
	}

	useEffect(() => {
		getScoreboard();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="scoreboard-container">
			<img src={logo} alt="Logo" className="logo" />
			<div className="timer">{duration</div>
			<div className='scoreboard-title-container'>
				<span className="scoreboard-title">Scoreboard</span>
			</div>
			{sortedTeams.length === 0 ?
				 <Loading msg="Loading scoreboard..." /> :
				<>
					<table>
						<tr className='column-labels'>
							<td><div className="label-rank team-info-text">Rank</div></td>
							<td><div className="label-name-scoreboard team-info-text">Team name</div></td>
							<td><div className="label-correct-answer team-info-text">Correct</div></td>
							<td><div className="label-score team-info-text">Score</div></td>
						</tr>
						{sortedTeams}
					</table>
				</>
			}
		</div>
	);
}


export default Scoreboard;