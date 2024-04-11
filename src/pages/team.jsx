import React, { useEffect } from 'react';
import './style/team.css';
import { Button } from '../components/button';
import CheckIcon from '../assets/check.png';
import { Answer } from '../components/radio_answer';
import { getDoc, doc, onSnapshot, collection, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../components/loading';
import { useHistory } from 'react-router-dom';
import { InputBox } from '../components/input_box';
import getQuestion from '../helper/getQuestion';

const QuestionStatus = {
    NOT_STARTED: 'pending',
    IN_PROGRESS: 'started',
    FINISHED: 'ended'
};


const TeamPage = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isWaiting, setIsWaiting] = React.useState(false);
    const [teamName, setTeamName] = React.useState("Team Name");
    const [questionNumber, setQuestionNumber] = React.useState(0);
    const [questions, setQuestions] = React.useState([]);
    const [questionStatus, setQuestionStatus] = React.useState(QuestionStatus.NOT_STARTED);
    const [duration, setDuration] = React.useState(null);
    const [betValue, setBetValue] = React.useState(0);
    const teamID = localStorage.getItem("team");
    const teamRef = doc(db, "history", teamID);


    const onLoad = async () => {
        setIsLoading(true);
        updateQuestionStatus();
        updateTeamName();
        updateQuestionNumber();
        setQuestions(await getQuestion());
        // await getQuestionInfo();
        setIsLoading(false);
    }

    useEffect(() => {
        onLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateQuestionStatus = () => {
        const gameRef = doc(db, "game", "2024g");
        onSnapshot(gameRef, (gameSnap) => {
            setQuestionStatus(gameSnap.data().status);
        });
    }

    useEffect(() => {
        if (questionStatus === QuestionStatus.NOT_STARTED) {
            setIsWaiting(false);
            setBetValue(0);
            setDuration(0);
        }
        if (questionStatus === QuestionStatus.IN_PROGRESS) {
            setDuration(questions[questionNumber - 1].duration);
        }
    }, [questionStatus, questions, questionNumber]);

    useEffect(() => {
        if (duration === 0) {
            setDuration(null);
        }

        if (!duration) return;

        const interval = setInterval(() => {
            setDuration(duration - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [duration]);

    const updateTeamName = async () => {
        const teamSnap = await getDoc(teamRef);
        setTeamName(teamSnap.data().name);
    }

    const updateQuestionNumber = () => {
        const gameRef = doc(db, "game", "2024g");
        onSnapshot(gameRef, (doc) => {
            const tmpQuestionNumber = doc.data().current_index;
            setQuestionNumber(tmpQuestionNumber);
        });
    }


    useEffect(
        () => {
            if (questions.length !== 0)
                questions.sort((a, b) => a.index - b.index);
            else
                setIsLoading(true);
        },
        [questions]
    );

    const handleBet = async () => {
        const betInput = document.getElementById('betInput');
        var betValue = +betInput.value;
        const historyCollectionRef = collection(db, 'history');
        const historyRef = doc(historyCollectionRef, teamID);
        const historySnapshot = await getDoc(historyRef)
        const historyData = historySnapshot.data()
        const currentCredit = historyData.credit

        if (currentCredit === 0) {
            alert("You don't have enough credit to bet. Setting credit to 1.");
            setBetValue(1);
            return;
        }

        // if bet is more than half of current credit or more than current credit
        if ((betValue > (currentCredit + 1) / 2) && questionNumber <= 10) {
            betValue = Math.floor((currentCredit + 1) / 2)
        }
        if (questionNumber > 10 && betValue > currentCredit) {
            betValue = currentCredit
            return
        }

        setBetValue(parseInt(betValue));
    }

    const handleSubmit = async () => {
        const checkedAnswer = document.querySelector('input[name=choices]:checked');
        const checkedValue = document.querySelector('label[for=' + checkedAnswer.id + ']').textContent;

        // fetch("https://trivia-backend-avcm.onrender.com/api/answerQuestion", {
        //     method: "POST",
        //     body: JSON.stringify({
        //         answer: checkedValue,
        //         teamId: teamID,
        //         bet: betValue
        //     }),
        //     headers: {
        //         "Content-type": "application/json"
        //     }
        // });

        const currentQuestion = questions[questionNumber - 1];
        const isCorrect = currentQuestion.answer === checkedValue;
        const historyCollectionRef = collection(db, 'history');
        const historyRef = doc(historyCollectionRef, teamID);
        const historySnapshot = await getDoc(historyRef)
        const historyData = historySnapshot.data()

        const newHistory = {
            ...historyData.history, [currentQuestion.questionID]: {
                bet: betValue,
                answer: isCorrect,
                status: 'answered'
            }
        }
        await updateDoc(historyRef, {
            history: newHistory,
        })

        if (questionNumber === questions.length) {
            history.push("/game_over");
        }
        else {
            checkedAnswer.checked = false;
            setIsWaiting(true);
            setBetValue(0);
            setDuration(0);
        }
    }

    return (
        <div className="team-container">
            {(isLoading) ?
                <Loading msg="Loading..." /> :
                (isWaiting) ?
                    <Loading msg="Wait for the next question..." /> :
                    (questionStatus === QuestionStatus.NOT_STARTED && betValue === 0) ?
                        <div className="submit-button-container">
                            <div className="question-counter-container">
                                <div className="question">Question:</div>
                                <div className="question-number">{questionNumber}/{questions.length}</div>
                            </div>
                            <InputBox id="betInput" title="Bet EC" placeHolder="Enter bet EC here..." type="number" />
                            <Button text="Submit" icon={CheckIcon} inputType="submit" onClick={handleBet} />
                        </div> :
                        (questionStatus !== QuestionStatus.IN_PROGRESS) ?
                            <Loading msg="Waiting for host to start the question..." /> :
                            <>
                                <div className="team-info">
                                    <div className="team-name">{teamName}</div>
                                    <div className="question-counter-container">
                                        <div className="question">Question:</div>
                                        <div className="question-number">{questionNumber}/{questions.length}</div>
                                    </div>
                                </div>
                                <div className="timer">{duration}</div>
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
                                    <div className="submit-button-container">
                                        <Button text="Submit" icon={CheckIcon} inputType="submit" onClick={handleSubmit} />
                                    </div>
                                </div>
                            </>
            }
        </div>
    );
};

export default TeamPage;
