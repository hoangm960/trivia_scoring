import React, { useEffect } from 'react';
import './style/scoreboard.css';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import RowScoreboard from '../components/row_scoreboard';
import Loading from '../components/loading';
import logo from "../assets/stem_club_logo.png";
import useQuestions from '../hooks/useQuestions';
import useQuestionStatus from '../hooks/useQuestionStatus';
import useQuestionCurrentIndex from '../hooks/useQuestionCurrentIndex';

const QuestionStatus = {
    NOT_STARTED: 'pending',
    IN_PROGRESS: 'started',
    FINISHED: 'ended'
};

function Scoreboard() {
	const [sortedTeams, setSortedTeams] = React.useState([]);
	const questions = useQuestions();
	const questionStatus = useQuestionStatus();
	const currentQuestionIndex = useQuestionCurrentIndex();
	const [duration, setDuration] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);


	const onLoad = async () => {
        setIsLoading(true);
        getScoreboard();
        setIsLoading(false);
    }

	useEffect(() => {
		onLoad();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
        if (questionStatus === QuestionStatus.NOT_STARTED) {
            setDuration(0);
        }
        if (questionStatus === QuestionStatus.IN_PROGRESS) {
            setDuration(questions[currentQuestionIndex - 1].duration);
        }
    }, [questionStatus, questions, currentQuestionIndex]);

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
		const gameSnap = await getDoc(doc(db, "game", "2024g"));
		const teamRef = query(collection(db, "history"));
		onSnapshot(teamRef, (docs) => {
			const teams = [];
			docs.forEach((doc) => {
				teams.push(doc.data());
			});
			const sortedTeams = teams.sort((a, b) => {
				return b.score - a.score;
			},).map((team, index) => {
				return (
					<RowScoreboard
					index={index + 1}
					name={team.name}
					correct={team.correctAnswers}
					total={gameSnap.data().current_index}
					score={team.credit}
					key={index}
					/>
				);
			});
			console.log(sortedTeams);
			setSortedTeams(sortedTeams);
		});
	}


	return (
		<div className="scoreboard-container">
			<img src={logo} alt="Logo" className="logo" />
			<div className="timer">{duration}</div>
			<div className='scoreboard-title-container'>
				<span className="scoreboard-title">Scoreboard</span>
			</div>
			{isLoading ?
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