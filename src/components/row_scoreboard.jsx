import React from 'react';
import "./style/row_scoreboard.css";

function RowScoreboard ({index, name, correct, total, score}) {
    return (
        <div className="team-info">
            <div className="team-rank team-info-text">{index}</div>
            <div className="team-name-scoreboard team-info-text">{name}</div>
            <div className="team-correct-answer team-info-text-2">
                {correct}/{total}
            </div>
            <div className="team-score team-info-text-2">{score}</div>
        </div>
    );
}

export default RowScoreboard;