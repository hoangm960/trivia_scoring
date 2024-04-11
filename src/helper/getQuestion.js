import { doc, where, query, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';


export default async function getQuestion() {
    const gameRef = doc(db, "game", "2024g");
    const questionRef = collection(db, "questions");
    const questionInGameSnap = await getDocs(query(
        questionRef,
        where("game", "==", gameRef.id))
    );
    var questions = [];
    questionInGameSnap.forEach((question) => {
        const questionID = question.id;
        const questionIndex = question.data().index;
        const questionDuration = question.data().duration;
        const correctAnswer = question.data().answer;
        questions.push({
            "answer": correctAnswer,
            "questionID": questionID,
            "duration": questionDuration,
            "index": questionIndex
        });
    });
    if (questions.length !== 0)
        return questions;
}