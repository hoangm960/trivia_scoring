import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../firebase';

export default function useTeamName() {
    const [teamName, setTeamName] = useState("Team Name");

    const getTeamName = async () => {
        const teamID = localStorage.getItem("team");
        const teamRef = doc(db, "history", teamID);
        const teamSnap = await getDoc(teamRef);
        setTeamName(teamSnap.data().name);
    }

    useEffect(() => {
        getTeamName();
    }, []);

    return teamName;
}