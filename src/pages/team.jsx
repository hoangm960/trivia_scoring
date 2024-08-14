import React, { useEffect } from 'react';
import './style/team.css';
import { Button } from '../components/button';
import CheckIcon from '../assets/check.png';
import LogOutIcon from '../assets/logout.png';
import { Answer } from '../components/radio_answer';
import { getDoc, doc, collection, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../components/loading';
import { useHistory } from 'react-router-dom';
import { InputBox } from '../components/input_box';
import useQuestions from '../hooks/useQuestions';
import useQuestionStatus from '../hooks/useQuestionStatus';
import useQuestionCurrentIndex from '../hooks/useQuestionCurrentIndex';
import useTeamCurrentCredit from '../hooks/useTeamCurrentCredit';
import { QUESTION_STATUS } from '../constants/questionConst';
import useTeamName from '../hooks/useTeamName';

const TeamPage = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isWaiting, setIsWaiting] = React.useState(false);
    const [teamName, teamLoading] = useTeamName();
    const questionStatus = useQuestionStatus();
    const [questions, questionLoading] = useQuestions();
    const currentCredit = useTeamCurrentCredit();
    const currentQuestionIndex = useQuestionCurrentIndex();
    const [duration, setDuration] = React.useState(null);
    const [betValue, setBetValue] = React.useState(0);
    const [isOverTime, setIsOverTime] = React.useState(false);
    const [isReInitialize, setIsReInitialize] = React.useState(false);
    const teamID = localStorage.getItem("team");

    useEffect(() => {
        onSnapshot(doc(db, "history", teamID), (doc) => {
            setIsReInitialize(doc.exists());
        });
    });

    useEffect(() => {
        setIsLoading((questionLoading || teamLoading) && isReInitialize);
    }, [questionLoading, teamLoading, isReInitialize]);

    useEffect(() => {
        if (questionStatus === QUESTION_STATUS.NOT_STARTED) {
            setIsWaiting(false);
            setBetValue(0);
            setDuration(null);
        } else if (questionStatus === QUESTION_STATUS.IN_PROGRESS && !isOverTime) {
            setDuration(questions[currentQuestionIndex - 1].duration);
        } else if (questionStatus === QUESTION_STATUS.FINISHED) {
            // add 3 seconds buffer for user to input answer
            if (isOverTime)
                setTimeout(() => {
                    setIsOverTime(false);
                }, 3000);
        }
    }, [questionStatus, questions, currentQuestionIndex, isOverTime, isReInitialize]);

    useEffect(() => {
        if (duration === 0) {
            setDuration(null);
            setIsOverTime(true);
        }

        if (!duration) return;

        const interval = setInterval(() => {
            setDuration(duration - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [duration]);

    const handleBet = async () => {
        const betInput = document.getElementById('betInput');
        var betValue = +betInput.value;

        if (currentCredit === 0) {
            alert("You don't have enough credit to bet. Setting credit to 1.");
            setBetValue(1);
        } else
            // if bet is more than half of current credit or more than current credit
            if ((betValue > (currentCredit + 1) / 2) && currentQuestionIndex <= 10) {
                alert("For the first 10 questions, you can only bet half of your credit. Setting bet to half of your credit.");
                setBetValue(Math.floor((currentCredit + 1) / 2));
            } else
                if (currentQuestionIndex > 10 && betValue > currentCredit) {
                    alert("You can only bet your current credit. Setting bet to your current credit.");
                    setBetValue(currentCredit);
                } else
                    setBetValue(parseInt(betValue));
    }

    const handleLogOut = async () => {
        localStorage.removeItem("team");
        history.push('/');
    }

    const handleSubmit = async () => {
        const checkedAnswer = document.querySelector('input[name=choices]:checked');
        const checkedValue = checkedAnswer ? document.querySelector('label[for=' + checkedAnswer.id + ']').textContent : "";

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

        const currentQuestion = questions[currentQuestionIndex - 1];
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

        if (currentQuestionIndex === questions.length) {
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
            {(!isReInitialize) ?
                <div className="team-container">
                    <Loading msg="Waiting for host to initialize the game..." />
                    <Button
                        id="logout"
                        type="destructive"
                        icon={LogOutIcon}
                        text="Logout"
                        onClick={handleLogOut}
                    />
                </div> :
                (isLoading) ?
                    <Loading msg="Loading..." /> :
                    (isWaiting) ?
                        <Loading msg="Wait for the next question..." /> :
                        (questionStatus === QUESTION_STATUS.NOT_STARTED && betValue === 0) ?
                            <div className="submit-button-container">
                                <div className="question-counter-container">
                                    <div className="question">Question:</div>
                                    <div className="question-number">{currentQuestionIndex}/{questions.length}</div>
                                </div>
                                <div className="team-info-container">
                                    <div className="info-container">
                                        <div className="team-label">Team:</div>
                                        <div className="team-name">{teamName}</div>
                                    </div>
                                    <div className="info-container">
                                        <div className="team-label">Credits:</div>
                                        <div className="team-value">{currentCredit}</div>
                                    </div>
                                </div>
                                <InputBox
                                    id="betInput"
                                    title="Bet EC"
                                    placeHolder="Enter bet EC here..."
                                    type="number"
                                />
                                <Button
                                    text="Submit"
                                    icon={CheckIcon}
                                    inputType="submit"
                                    onClick={handleBet}
                                />
                            </div> :
                            (questionStatus !== QUESTION_STATUS.IN_PROGRESS && !isOverTime) ?
                                <Loading msg="Waiting for host to start the question..." /> :
                                <>
                                    <div className="team-info">
                                        <div className="team-name">{teamName}</div>
                                        <div className="question-counter-container">
                                            <div className="question">Question:</div>
                                            <div className="question-number">{currentQuestionIndex}/{questions.length}</div>
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
                                            <Button
                                                text="Submit"
                                                icon={CheckIcon}
                                                inputType="submit"
                                                onClick={handleSubmit}
                                            />
                                        </div>
                                    </div>
                                </>
            }
        </div>
    );
};

export default TeamPage;
