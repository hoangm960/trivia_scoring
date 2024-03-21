import { React } from 'react';
import { useHistory } from 'react-router-dom';
import './style/dashboard_login.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';


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
        <>
            <div className="container1">
                <div className="title">
                    <span>Trivia</span>
                    <span>Scoring</span>
                </div>
                <div className="form">
                    <div className="input-field">
                        <div className="input-label">
                            <div>
                                <div>ID</div>
                            </div>
                        </div>
                        <input id='uid' className="input" placeholder='Enter UID here' />
                    </div>
                    <div className="input-field">
                        <div className="input-label">
                            <div>
                                <div>Password</div>
                            </div>
                        </div>
                        <input id='password' type="password" className="input" placeholder="Enter password here" />
                    </div>
                </div>
                <div className="button" onClick={handleLogin}>
                    <div>Login</div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
