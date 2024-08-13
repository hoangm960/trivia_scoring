import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './style/login.css';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { InputBox } from '../components/input_box';
import { Button } from '../components/button';
import ArrowRightIcon from '../assets/arrow-right.png';
import removeVietnameseTones from '../helper/removeVN';


const LoginPage = () => {
    const history = useHistory();

    const handleLogin = async () => {
        const nameInput = document.getElementById("uid");
        const name = nameInput.value;
        if (name === "") {
            alert("Please enter a valid team name");
            return;
        }
        const uid = removeVietnameseTones(name).toLowerCase().replaceAll(" ", "_");

        const teamSnap = await getDoc(doc(db, "teams", uid));
        if (teamSnap.exists()) {
            alert("Team name already exists");
            return;
        }

        await setDoc(doc(db, "teams", uid), {
            name: name,
        });

        localStorage.setItem("team", uid);
        history.push('/game_team');
    }

    useEffect(() => {
        if (localStorage.getItem("team")) {
            history.push('/game_team');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="login-container">
            <p className="title">
                <span>Trivia</span>
                <span>Scoring</span>
            </p>
            <div className="form">
                <InputBox id='uid' placeHolder='Enter team name here' title='Team name' />
            </div>
            <Button text='Login' icon={ArrowRightIcon} onClick={handleLogin}></Button>
        </div>
    );
};

export default LoginPage;
