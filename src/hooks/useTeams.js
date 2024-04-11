import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '../firebase';
import RowScoreboard from '../components/row_scoreboard';
import { useState, useEffect } from 'react';
import useQuestionCurrentIndex from './useQuestionCurrentIndex';

export default function useTeams() {
    const [sortedTeams, setSortedTeams] = useState([]);
    const currentQuestionIndex = useQuestionCurrentIndex();

    const getTeams = async () => {
        const teamRef = query(collection(db, "history"));
        onSnapshot(teamRef, (docs) => {
            const teams = [];
            docs.forEach((doc) => {
                teams.push(doc.data());
            });

            const sortedTeams = teams
                .sort((a, b) => b.score - a.score)
                .map((team, index) => {
                    return (
                        <RowScoreboard
                            key={index}
                            index={index + 1}
                            name={team.name}
                            correct={team.correctAnswers}
                            total={currentQuestionIndex}
                            score={team.credit}
                        />
                    );
                });
            setSortedTeams(sortedTeams);
        });
    }

    useEffect(() => {
        if (currentQuestionIndex > 0)
            getTeams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestionIndex]);

    return sortedTeams;
}