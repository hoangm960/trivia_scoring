import React, { useEffect } from 'react';
import './style/team.css';
import { Button } from '../components/button';
import CheckIcon from '../assets/check.png';
import { getDoc, doc, onSnapshot, where, query, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../components/loading';
import { useHistory } from 'react-router-dom';
import { InputBox } from '../components/input_box';

const QuestionStatus = {
    NOT_STARTED: 'pending',
    IN_PROGRESS: 'started',
    FINISHED: 'ended'
};


const TeamBet = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = React.useState(false);
    const [teamName, setTeamName] = React.useState("Team Name");
    const [questionNumber, setQuestionNumber] = React.useState(0);
    const [prevQuestionNumber, setPrevQuestionNumber] = React.useState(0);
    const [questions, setQuestions] = React.useState([]);
    const [questionStatus, setQuestionStatus] = React.useState(QuestionStatus.NOT_STARTED);
    const [duration, setDuration] = React.useState(null);
    const teamID = localStorage.getItem("team");
    const teamRef = doc(db, "history", teamID);


    const onLoad = async () => {
        setIsLoading(true);
        updateQuestionStatus();
        updateTeamName();
        updateQuestionNumber();
        await getCorrectAnswers();
    }

    const updateQuestionStatus = () => {
        const gameRef = doc(db, "game", "2024g");
        onSnapshot(gameRef, (gameSnap) => {
            setQuestionStatus(gameSnap.data().status);
            if (gameSnap.data().status === QuestionStatus.IN_PROGRESS) {
                // console.log(questions);
                // const questionRef = doc(db, "questions", questions[gameSnap.data().current_index - 1].questionID);
                // getDoc(questionRef).then((questionSnap) => {
                setDuration(10);
                // });
            }
        });
    }

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
            if ((questionNumber !== 0) | (prevQuestionNumber !== tmpQuestionNumber)) {
                setIsLoading(false);
            }
        });
    }

    const getCorrectAnswers = async () => {
        const gameRef = doc(db, "game", "2024g");
        const questionRef = collection(db, "questions");
        const questionInGameSnap = await getDocs(query(
            questionRef,
            where("game", "==", gameRef.id))
        );
        questionInGameSnap.forEach(async (question) => {
            const currentQuestionID = question.id;
            const currentQuestionRef = doc(db, "questions", currentQuestionID);
            const currentQuestionSnap = await getDoc(currentQuestionRef);
            const correctAnswer = currentQuestionSnap.data().answer;
            setQuestions(answers => [...answers, { "answer": correctAnswer, "questionID": currentQuestionID }]);
        });
    }

    const handleSubmit = async () => {
        const betInput = document.getElementById("bet");
        var betValue = +betInput.value;

        const currentQuestion = questions[questionNumber - 1];
        const historyCollectionRef = collection(db, 'history');
        const historyRef = doc(historyCollectionRef, teamID);
        const historySnapshot = await getDoc(historyRef)
        const historyData = historySnapshot.data()
        const currentCredit = historyData.credit

        const newHistory = {
            ...historyData.history, [currentQuestion.questionID]: {
                bet: betValue,
                status: 'betted'
            }
        }

        await updateDoc(historyRef, {
            history: newHistory,
        })
    }


    useEffect(() => {
        onLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <div className="team-container">
            {(isLoading || questionStatus !== QuestionStatus.IN_PROGRESS) ?
                <Loading msg="Waiting for host..." /> :
                <>
                    <div className="submit-button-container">
                        <InputBox id="bet" title="Bet EC" placeHolder="Enter bet EC here..." type="number" />
                        <Button text="Submit" icon={CheckIcon} inputType="submit" onClick={handleSubmit} />
                    </div>
                </>}
        </div>
    );
};

export default TeamBet;
