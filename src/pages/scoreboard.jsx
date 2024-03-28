import React, { useEffect } from 'react';
import './style/scoreboard.css';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '../firebase';

function Scoreboard() {

	const getScoreboard = async () => {
		const teamRef = query(collection(db, "teams"));
		onSnapshot(teamRef, (docs) => {
			const teams = [];
			docs.forEach((doc) => {
				teams.push(doc.data());
			});
			const sortedTeams = teams.sort((a, b) => {
				return b.score - a.score;
			}).map((team) => {
				return { name: team.name, score: team.score };
			});
			console.log(sortedTeams);
			return sortedTeams;
		});
	}

	useEffect(() => {
		getScoreboard();
	}, []);

	return (
		<div className="container">
			<div className="scoreboard-title">Scoreboard</div>
			<div className="teams-info-container">
				<div className="teams-rank">
					<div className="team-rank"><div className="team-info-text">1</div></div>
					<div className="team-rank"><div className="team-info-text">2</div></div>
					<div className="team-rank"><div className="team-info-text">3</div></div>
				</div>
				<div className="teams-name">
					<div className="team-name"><div className="team-info-text">Team 1</div></div>
					<div className="team-name"><div className="team-info-text">Team 2</div></div>
					<div className="team-name"><div className="team-info-text">Team 3</div></div>
				</div>
				<div className="teams-score">
					<div className="team-score"><div className="team-info-text">150</div></div>
					<div className="team-score"><div className="team-info-text">100</div></div>
					<div className="team-score"><div className="team-info-text">50</div></div>
				</div>
			</div>
		</div>
	);
}


export default Scoreboard;