import React from 'react';
import './style/team.css';
import { Button } from '../components/button';
import CheckIcon from '../assets/check.png';
import { Answer } from '../components/radio_answer';
import { getDoc, doc, onSnapshot, where, query, collection, getDocs, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';


const TeamPage = () => {
    const [teamName, setTeamName] = React.useState("Team Name");
    const [questionNumber, setQuestionNumber] = React.useState(0);
    const teamID = localStorage.getItem("team");
    const teamRef = doc(db, "teams", teamID);

    const onLoad = () => {
        updateQuestionNumber();
        updateTeamName();
    }

    const updateQuestionNumber = () => {
        const gameRef = doc(db, "game", "2024g");
        onSnapshot(gameRef, (doc) => {
            setQuestionNumber(doc.data().current_index);
        });
    }

    const updateTeamName = () => {
        getDoc(teamRef).then(
            (doc) => {
                setTeamName(doc.data().name);
            }
        );
    }

    const handleSubmit = async () => {
        const [correctAnswer, points] = await getCorrectAnswer();
        checkAnswer(correctAnswer, points);
    }

    const getCorrectAnswer = async () => {
        const gameRef = doc(db, "game", "2024g");
        const questionRef = collection(db, "questions");
        const currentQuestion = query(questionRef, where("game", "==", gameRef.id), where("index", "==", questionNumber));
        const questionSnap = await getDocs(currentQuestion);
        var correctAnswer = "";
        var points = 0;
        questionSnap.forEach(doc => {
            if (doc.data() !== undefined) {
                correctAnswer = doc.data().answer;
                points = doc.data().points;
            }
        });
        return [correctAnswer, points];
    }

    const checkAnswer = async (correctAnswer, points) => {
        const checkedID = document.querySelector('input[name=choices]:checked').id;
        const checkedValue = document.querySelector('label[for=' + checkedID + ']').textContent;
        if (checkedValue === correctAnswer) {
            await updateDoc(teamRef, {
                score: increment(points)
            });
        }
    }


    return (
        <div className="container" onLoad={onLoad}>
            <div className="team-info">
                <div className="team-name">{teamName}</div>
                <div className="question-counter-container">
                    <div className="question">Question:</div>
                    <div className="question-number">{questionNumber}/10</div>
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
