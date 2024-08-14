import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../firebase';

export default function useTeamName() {
    const [teamName, setTeamName] = useState(null);
    const [loading, setLoading] = useState(false);

    const getTeamName = async () => {
        try {
            setLoading(true);
            const teamID = localStorage.getItem("team");
            const teamRef = doc(db, "history", teamID);
            const teamSnap = await getDoc(teamRef);
            if (teamSnap.exists()) {
                setTeamName(teamSnap.data().name);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTeamName();
    }, []);

    return [teamName, loading];
}