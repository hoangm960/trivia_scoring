import React, { useEffect } from 'react';
import './style/scoreboard.css';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import RowScoreboard from '../components/row_scoreboard';
import Loading from '../components/loading';
import logo from "../assets/stem_club_logo.png";

function Scoreboard() {
	const [sortedTeams, setSortedTeams] = React.useState([]);

	const getScoreboard = async () => {
		const questionSnap = await getDoc(doc(db, "game", "2024g"));
		const teamRef = query(collection(db, "teams"));
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
						correct={team.correctAnswer}
						total={questionSnap.data().current_index}
						score={team.score}
						key={index}
					/>
				);
			}));
		});
	}

	useEffect(() => {
		getScoreboard();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="container">
			<img src={logo} alt="Logo" className="logo" />
			<div className='scoreboard-title-container'>
				<span className="scoreboard-title">Scoreboard</span>
			</div> 
			{sortedTeams.length === 0 ?
				<Loading msg="Loading scoreboard..." /> :
				<>
					<div className="teams-info-container">
						<div className="column-labels">
							<div className="label-rank team-info-text">Rank</div>
							<div className="label-name-scoreboard team-info-text">Team name</div>
							<div className="label-correct-answer team-info-text">Correct</div>
							<div className="label-score team-info-text">Score</div>
						</div>
						{sortedTeams}
					</div>
				</>
			}
		</div>
	);
}


export default Scoreboard;