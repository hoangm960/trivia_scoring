import { doc, onSnapshot } from 'firebase/firestore';
import { useState } from 'react';
import { QUESTION_STATUS } from '../constants/questionConst';
import { db } from '../firebase';


export default function useQuestionStatus() {
    const [questionStatus, setQuestionStatus] = useState(QUESTION_STATUS.NOT_STARTED);

    const gameRef = doc(db, "game", "2024g");
    onSnapshot(gameRef, (gameSnap) => {
        setQuestionStatus(gameSnap.data().status);
    });

    return questionStatus;
}