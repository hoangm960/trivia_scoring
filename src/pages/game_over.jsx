import React from "react";
import { useHistory } from "react-router-dom";
import "./style/game_over.css";
import { Button } from "../components/button";
import LogOutIcon from "../assets/logout.png";

function GameOver() {
	const history = useHistory();

	const handleLogOut = async () => {
		localStorage.removeItem("team");
		history.push("/");
	};

	return (
		<div className="gameover-container">
			<div className="gameover-text">Thank you for supporting us!</div>

			<Button
				id="logout"
				type="destructive"
				icon={LogOutIcon}
				text="Logout"
				onClick={handleLogOut}
			/>
		</div>
	);
}

export default GameOver;

