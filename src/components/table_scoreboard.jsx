import RowScoreboard from "./row_scoreboard.jsx";

function Table({ teams, currentQuestion }) {
	return (
		<table>
			<thead>
				<tr className="column-labels">
					<td>
						<div className="label-rank team-info-text-2">Rank</div>
					</td>
					<td>
						<div className="label-name-scoreboard team-info-text-2">
							Team name
						</div>
					</td>
					<td>
						<div className="label-correct-answer team-info-text-2">
							Correct
						</div>
					</td>
					<td>
						<div className="label-score team-info-text-2">
							Score
						</div>
					</td>
				</tr>
			</thead>
			<tbody>
				{teams.map((team, index) => (
					<RowScoreboard
						key={index}
						index={index + 1}
						name={team.name}
						correct={team.correctAnswers}
						total={currentQuestion}
						score={team.credit}
					/>
				))}
			</tbody>
		</table>
	);
}

export default Table;
