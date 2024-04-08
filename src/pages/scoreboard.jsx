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
		});
	}

	useEffect(() => {
		getScoreboard();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="scoreboard-container">
			<img src={logo} alt="Logo" className="logo" />
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
						{/* {sortedTeams} */}
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						<tr>
							<td><div className="team-rank team-info-text">1</div></td>
							<td><div className="team-name-scoreboard team-info-text">Team 1</div></td>
							<td><div className="team-correct-answer team-info-text-2">
									{1}/{2}
								</div></td>
								<td><div className="team-score team-info-text-2">{100}</div></td>
						</tr>
						
					</table>
				</>
			}
		</div>
	);
}


export default Scoreboard;