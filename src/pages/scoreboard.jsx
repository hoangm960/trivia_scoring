import React, { useEffect } from 'react';
import './style/scoreboard.css';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '../firebase';
import RowScoreboard from '../components/row_scoreboard';
import Loading from '../components/loading';

function Scoreboard() {
	const [sortedTeams, setSortedTeams] = React.useState([]);

	const getScoreboard = async () => {
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
			<div className="scoreboard-title">Scoreboard</div>
			{sortedTeams.length === 0 ?
				<Loading msg="Loading scoreboard..." /> :
				<div className="teams-info-container">
					{sortedTeams}
				</div>
			}
		</div>
	);
}


export default Scoreboard;