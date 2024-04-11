import { doc, where, query, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useState, useEffect } from 'react';

const gameRef = doc(db, "game", "2024g");
const questionRef = collection(db, "questions");
const questionInGameSnap = await getDocs(query(
    questionRef,
    where("game", "==", gameRef.id))
);

export default function useQuestions() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        var tmpQuestions = [];
        questionInGameSnap.forEach((question) => {
            const questionID = question.id;
            const questionIndex = question.data().index;
            const questionDuration = question.data().duration;
            const correctAnswer = question.data().answer;
            tmpQuestions.push({
                "answer": correctAnswer,
                "questionID": questionID,
                "duration": questionDuration,
                "index": questionIndex
            });
        });
        setQuestions(tmpQuestions)
    });
    return questions;
}