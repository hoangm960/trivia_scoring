import React from 'react';
import './style/team.css';
import { Button } from '../components/button';
import CheckIcon from '../assets/check.png';


const TeamPage = () => {
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
                        <Button inputType="radio" id="choiceA" text="A"></Button>
                        <Button inputType="radio" id="choiceB" text="B"></Button>
                    </div>
                    <div className="answer-row">
                        <Button inputType="radio" id="choiceC" text="C"></Button>
                        <Button inputType="radio" id="choiceD" text="D"></Button>
                    </div>
                    <Button text="Submit" icon={CheckIcon} type="submit"></Button>
                </form>
            </div>
        </div>
    );
};

export default TeamPage;
