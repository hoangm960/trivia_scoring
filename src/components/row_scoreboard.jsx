import React from 'react';
import "./style/row_scoreboard.css";

function RowScoreboard ({index, name, correct, score}) {
    return (
        <div className="team-info">
            <div className="team-rank team-info-text">{index}</div>
            <div className="team-name-scoreboard team-info-text">{name}</div>
            <div className="team-correct-answer team-info-text">
                <span className="team-info-text">1</span>/<span className="team-info-text">1</span>
            </div>
            <div className="team-score team-info-text">{score}</div>
        </div>
    );
}

export default RowScoreboard;