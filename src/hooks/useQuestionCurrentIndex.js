import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useState } from 'react';


export default function useQuestionCurrentIndex() {
    const [questionIndex, setQuestionIndex] = useState(0);

    const gameRef = doc(db, "game", "2024g");
    onSnapshot(gameRef, (doc) => {
        setQuestionIndex(doc.data().current_index);
    });

    return questionIndex
}