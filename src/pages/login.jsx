import { React, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './style/login.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { InputBox } from '../components/input_box';
import { Button } from '../components/button';
import ArrowRightIcon from '../assets/arrow-right.png';


const LoginPage = () => {
    const history = useHistory();

    const handleLogin = async () => {
        const uid = document.getElementById("uid").value;
        if (uid === "") {
            alert("Please enter a valid ID");
            return;
        }
        const password = document.getElementById("password").value;
        const docRef = doc(db, "scorer", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            if (docSnap.get("password") === password) {
                localStorage.setItem("team", uid);
                history.push('/game_team');
            } else {
                alert("Wrong Password");
            }
        } else {
            alert("Wrong ID");
        }
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
                <InputBox id='uid' placeHolder='Enter UID here' title='ID' />
                <InputBox id='password' placeHolder='Enter password here' title='Password' isPassword={true} type="password" />
            </div>
            <Button text='Login' icon={ArrowRightIcon} onClick={handleLogin}></Button>
        </div>
    );
};

export default LoginPage;
