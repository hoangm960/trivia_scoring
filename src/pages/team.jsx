import React from 'react';
import './style/team.css';
import { Button } from '../components/button';
import CheckIcon from '../assets/check.png';
import { Answer } from '../components/radio_answer';


const TeamPage = () => {
    // TODO: handle question number in realtime

    const handleSubmit = () => {
        // TODO: add code to submit the team. Evaluate score and update score to database.
        alert("Submitted");
    }

    return (
        <div className="container">
            <div className="team-info">
                <div className="team-name">Team’s name</div>
                <div className="question-counter-container">
                    <div className="question">Question:</div>
                    <div className="question-number">1/10</div>
                </div>
            </div>
            <div className="question-container">
                <div className="question-text">What answer did the team choose?</div>
                <form className="answers">
                    <div className="answer-row">
                        <Answer id={"choiceA"} text={"A"} />
                        <Answer id={"choiceB"} text={"B"} />
                    </div>
                    <div className="answer-row">
                        <Answer id={"choiceC"} text={"C"} />
                        <Answer id={"choiceD"} text={"D"} />
                    </div>
                    <Button text="Submit" icon={CheckIcon} inputType="submit" onClick={handleSubmit}></Button>
                </form>
            </div>
        </div>
    );
};

export default TeamPage;
