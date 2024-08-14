import { doc, where, query, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useState, useEffect } from 'react';

export default function useQuestions() {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getQuestions = async () => {
        try {
            setIsLoading(true);
            const gameRef = doc(db, "game", "2024g");
            const questionRef = collection(db, "questions");
            const questionInGameSnap = await getDocs(query(
                questionRef,
                where("game", "==", gameRef.id))
            );

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
            tmpQuestions.sort((a, b) => a.index - b.index);
            setQuestions(tmpQuestions);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getQuestions();
    }, []);
    return [questions, isLoading];
}