import React, { useEffect } from 'react';
import './style/team.css';
import { Button } from '../components/button';
import CheckIcon from '../assets/check.png';
import { Answer } from '../components/radio_answer';
import { getDoc, doc, onSnapshot, where, query, collection, getDocs, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../components/loading';
import { useHistory } from 'react-router-dom';



const TeamPage = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = React.useState(false);
    const [teamName, setTeamName] = React.useState("Team Name");
    const [questionNumber, setQuestionNumber] = React.useState(0);
    const [prevQuestionNumber, setPrevQuestionNumber] = React.useState(0);
    const [answers, setAnswers] = React.useState([]);
    const teamID = localStorage.getItem("team");
    const teamRef = doc(db, "teams", teamID);

    const onLoad = () => {
        setIsLoading(true);
        updateTeamName();
        updateQuestionNumber();
        getCorrectAnswers();
    }

    const updateTeamName = async () => {
        const teamSnap = await getDoc(teamRef);
        setTeamName(teamSnap.data().name);
    }

    const updateQuestionNumber = () => {
        const gameRef = doc(db, "game", "2024g");
        onSnapshot(gameRef, (doc) => {
            const tmpQuestionNumber = doc.data().current_index;
            setQuestionNumber(tmpQuestionNumber);
            if ((questionNumber !== 0) | (prevQuestionNumber !== tmpQuestionNumber)) {
                setIsLoading(false);
            }
        });
    }

    const getCorrectAnswers = async () => {
        const gameRef = doc(db, "game", "2024g");
        const questionRef = collection(db, "questions");
        var tempAnswers = [];
        const questionInGameSnap = await getDocs(query(
            questionRef,
            where("game", "==", gameRef.id))
        );
        questionInGameSnap.forEach((question) => {
            const currentQuestionID = question.id;
            const currentQuestionRef = doc(db, "questions", currentQuestionID);
            var correctAnswer, points;
            getDoc(currentQuestionRef).then(doc => {
                if (doc.data() !== undefined) {
                    correctAnswer = doc.data().answer;
                    points = doc.data().points;
                    tempAnswers.push([correctAnswer, points]);
                }
            });
        });
        while (tempAnswers.length === 0) {
            await new Promise(r => setTimeout(r, 10));
        }
        setAnswers(tempAnswers);
    }

    const handleSubmit = async () => {
        const checkedAnswer = document.querySelector('input[name=choices]:checked');
        const checkedValue = document.querySelector('label[for=' + checkedAnswer.id + ']').textContent;
        console.log(answers[questionNumber - 1]);
        if (checkedValue === answers[questionNumber - 1][0]) {
            await updateDoc(teamRef, {
                score: increment(answers[questionNumber - 1][1])
            });
        }
        if (questionNumber === answers.length) {
            history.push("/game_over");
        }
        else {
            checkedAnswer.checked = false;
            setPrevQuestionNumber(questionNumber);
            setIsLoading(true);
        }
    }


    useEffect(() => {
        onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <div className="container">
            {isLoading ?
                <Loading msg="Waiting for host..."/> :
                <>
                    <div className="team-info">
                        <div className="team-name">{teamName}</div>
                        <div className="question-counter-container">
                            <div className="question">Question:</div>
                            <div className="question-number">{questionNumber}/{answers.length}</div>
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
