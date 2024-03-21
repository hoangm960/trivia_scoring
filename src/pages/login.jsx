import { React } from 'react';
import { useHistory } from 'react-router-dom';
import './style/login.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { LoginInput } from '../components/login_input';
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
                history.push('/game_team');
            } else {
                alert("Wrong Password");
            }
        } else {
            alert("Wrong ID");
        }
    }

    return (
        <div className="container1">
            <p className="title">
                <span>Trivia</span>
                <span>Scoring</span>
            </p>
            <div className="form">
                <LoginInput id='uid' placeHolder='Enter UID here' title='ID' />
                <LoginInput id='password' placeHolder='Enter password here' title='Password' isPassword={true} />
            </div>
            <Button text='Login' icon={ArrowRightIcon} onClick={handleLogin}></Button>
        </div>
    );
};

export default LoginPage;
