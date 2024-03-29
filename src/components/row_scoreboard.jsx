import React from 'react';
import "./style/row_scoreboard.css";

function RowScoreboard ({index, name, score}) {
    return (
        <div className="team-info">
            <div className="team-rank team-info-text">{index}</div>
            <div className="team-name team-info-text">{name}</div>
            <div className="team-score team-info-text">{score}</div>
        </div>
    );
}

export default RowScoreboard;