import { doc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useState, useEffect } from 'react';

export default function useTeamCurrentCredit() {
    const [teamCurrentCredit, setTeamCurrentCredit] = useState(0);

    const getCredit = async () => {
        const teamID = localStorage.getItem("team");
        const historyCollectionRef = collection(db, 'history');
        const historyRef = doc(historyCollectionRef, teamID);
        onSnapshot(historyRef, (doc) => {
            setTeamCurrentCredit(doc.data().credit);
        });
    }

    useEffect(() => {
        getCredit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return teamCurrentCredit;
}