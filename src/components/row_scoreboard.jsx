import React from 'react';
import "./style/row_scoreboard.css";

function RowScoreboard ({index, name, correct, total, score}) {
    return (
        <tr>
            <td><div className="team-rank team-info-text">{index}</div></td>
            <td><div className="team-name-scoreboard team-info-text">{name}</div></td>
            <td><div className="team-correct-answer team-info-text-2">
                    {correct}/{total}
                </div></td>
                <td><div className="team-score team-info-text-2">{score}</div></td>
        </tr>
    );
}

export default RowScoreboard;