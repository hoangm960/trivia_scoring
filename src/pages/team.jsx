import React, { useEffect } from 'react';
import './style/team.css';
import { Button } from '../components/button';
import CheckIcon from '../assets/check.png';
import { Answer } from '../components/radio_answer';
import { getDoc, doc, onSnapshot, where, query, collection, getDocs, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../components/loading';
import GameOver from './game_over';


const TeamPage = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [teamName, setTeamName] = React.useState("Team Name");
    const [questionNumber, setQuestionNumber] = React.useState(0);
    const [prevQuestionNumber, setPrevQuestionNumber] = React.useState(0);
    const [questions, setQuestions] = React.useState([]);
    const [answer, setAnswer] = React.useState([]);
    const teamID = localStorage.getItem("team");
    const teamRef = doc(db, "teams", teamID);

    const onLoad = async () => {
        setIsLoading(true);
        updateTeamName();
        updateQuestionNumber();
        await getQuestions();
        await getCorrectAnswer();
    }

    const updateQuestionNumber = async () => {
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

    const getQuestions = async () => {
        if (questionNumber === 0)
            return

        const gameRef = doc(db, "game", "2024g");
        const questionRef = collection(db, "questions");
        var tempQuestions = [];
        const questionInGameSnap = await getDocs(query(
            questionRef,
            where("game", "==", gameRef.id))
        );
        questionInGameSnap.forEach(doc =>
            tempQuestions.push(doc.id)
        );
        setQuestions(tempQuestions);
    }

    const getCorrectAnswer = async () => {
        if (questions.length === 0)
            return
        const currentQuestionID = questions[questionNumber - 1];
        const currentQuestionRef = doc(db, "questions", currentQuestionID);

        var correctAnswer, points;
        getDoc(currentQuestionRef).then(doc => {
            if (doc.data() !== undefined) {
                correctAnswer = doc.data().answer;
                points = doc.data().points;
                setAnswer([correctAnswer, points]);
            }
        });
    }

    const handleSubmit = async () => {
        const checkedAnswer = document.querySelector('input[name=choices]:checked');
        const checkedValue = document.querySelector('label[for=' + checkedAnswer.id + ']').textContent;
        console.log(answer);
        if (checkedValue === answer[0]) {
            await updateDoc(teamRef, {
                score: increment(answer[1])
            });
        }
        if (questionNumber === questions.length) {
            window.location.href = "/game_over";
        }
        else {
            checkedAnswer.checked = false;
            setPrevQuestionNumber(questionNumber);
        }
    }


    useEffect(() => {
        if ((questionNumber === 0) | (answer.length === 0) | (prevQuestionNumber === questionNumber)) {
            onLoad();
        }
        setIsLoading(prevQuestionNumber === questionNumber);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionNumber, prevQuestionNumber, answer]);


    return (
        <div className="container">
            {isLoading ?
                <Loading /> :
                <>
                    <div className="team-info">
                        <div className="team-name">{teamName}</div>
                        <div className="question-counter-container">
                            <div className="question">Question:</div>
                            <div className="question-number">{questionNumber}/{questions.length}</div>
                        </div>
                    </div>
                    <div className="question-container">
                        <div className="question-text">What answer did the team choose?</div>
                        <div className="answers">
                            <div className="answer-row">
                                <Answer id={"choiceA"} text={"A"} />
                                <Answer id={"choiceB"} text={"B"} />
                            </div>
                            <div className="answer-row">
                                <Answer id={"choiceC"} text={"C"} />
                                <Answer id={"choiceD"} text={"D"} />
                            </div>
                        </div>
                        <Button text="Submit" icon={CheckIcon} inputType="submit" onClick={handleSubmit}></Button>
                    </div>
                </>}
        </div>
    );
};

export default TeamPage;
