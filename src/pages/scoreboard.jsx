import React, { useEffect } from 'react';
import './style/scoreboard.css';
import Loading from '../components/loading';
import logo from "../assets/stem_club_logo.png";
import useQuestions from '../hooks/useQuestions';
import useQuestionStatus from '../hooks/useQuestionStatus';
import useQuestionCurrentIndex from '../hooks/useQuestionCurrentIndex';
import useTeams from '../hooks/useTeams';
import { QUESTION_STATUS } from '../constants/questionConst';

function Scoreboard() {
	const questions = useQuestions();
	const questionStatus = useQuestionStatus();
	const currentQuestionIndex = useQuestionCurrentIndex();
	const teams = useTeams();
	const [duration, setDuration] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);


	useEffect(() => {
        if (questionStatus === QUESTION_STATUS.NOT_STARTED) {
            setDuration(0);
        }
        if (questionStatus === QUESTION_STATUS.IN_PROGRESS) {
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

	useEffect(() => {
		setIsLoading(questions.length === 0 || teams.length === 0);
	}, [questions, teams]);


	return (
		<div className="scoreboard-container">
			<img src={logo} alt="Logo" className="logo" />
			<div className="scoreboard-timer">10</div>
			<div className='scoreboard-title-container'>
				<span className="scoreboard-title">SCOREBOARD</span>
			</div>
			{isLoading ?
				 <Loading msg="Loading scoreboard..." /> :
				<>
					<table>
						<tr className='column-labels'>
							<td><div className="label-rank team-info-text-2">Rank</div></td>
							<td><div className="label-name-scoreboard team-info-text-2">Team name</div></td>
							<td><div className="label-correct-answer team-info-text-2">Correct</div></td>
							<td><div className="label-score team-info-text-2">Score</div></td>
						</tr>
						{teams}
					</table>
				</>
			}
		</div>
	);
}


export default Scoreboard;