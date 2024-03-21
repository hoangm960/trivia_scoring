import React from 'react';
import './style/team.css';


const TeamPage = () => {
    return (
        <>
            <div className="container">
                <div className="team-info">
                    <div className="team-name">Team’s name</div>
                    <div>
                        <div className="question">Question:</div>
                        <div className="question-number">1/10</div>
                    </div>
                </div>
                <div className="question-container">
                    <div className="question-text">What answer did the team choose?</div>
                    <form className="answers">
                        <div className="answer-row">
                            <input type="radio" id="choiceA" name="choices" />
                            <label htmlFor="choiceA" className="answer">A</label>
                            <input type="radio" id="choiceB" name="choices" />
                            <label htmlFor="choiceB" className="answer">B</label>
                        </div>
                        <div className="answer-row">
                            <input type="radio" id="choiceC" name="choices" />
                            <label htmlFor="choiceC" className="answer">C</label>
                            <input type="radio" id="choiceD" name="choices" />
                            <label htmlFor="choiceD" className="answer">D</label>
                        </div>
                        <button className="submit">
                            <div>Submit</div>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TeamPage;
