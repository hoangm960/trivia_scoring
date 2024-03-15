import React from 'react';
import { useHistory } from 'react-router-dom';
import './dashboard_login.css';

const DashboardLogin = () => {
    const history = useHistory();

    const handleLogin = () => {
        // Perform any login logic here

        // Then navigate to the GameTeam route
        history.push('/game_team');
    };

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
                        <input className="input" placeholder='Enter UID here' />
                    </div>
                    <div className="input-field">
                        <div className="input-label">
                            <div>
                                <div>Password</div>
                            </div>
                        </div>
                        <input type="password" className="input" placeholder="Enter password here"/>
                    </div>
                </div>
                <div className="button" onClick={handleLogin}>
                    <div>Login</div>
                </div>
            </div>
        </>
    );
};

export default DashboardLogin;
