import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./style/login.css";
import { InputBox } from "../components/input_box";
import { Button } from "../components/button";
import ArrowRightIcon from "../assets/arrow-right.png";
import removeVietnameseTones from "../helper/removeVN";
import { API_BASE } from "../constants/api";

const LoginPage = () => {
	const history = useHistory();

	const handleLogin = async () => {
		const nameInput = document.getElementById("uid");
		const name = nameInput.value;
		if (name === "") {
			alert("Please enter a valid team name");
			return;
		}
		const uid = removeVietnameseTones(name)
			.toLowerCase()
			.replaceAll(" ", "_");

		const rawResponse = await fetch(`${API_BASE}/api/login`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ teamID: uid }),
		});

		if (rawResponse.status === 400) {
			rawResponse.json().then(message => alert(message.error));
			return;
		}
		localStorage.setItem("team", uid);
		history.push("/game");
	};

	useEffect(() => {
		if (localStorage.getItem("team")) {
			history.push("/game");
		}
	}, [history]);

	return (
		<div className="login-container">
			<p className="title">
				<span>Trivia</span>
				<span>Scoring</span>
			</p>
			<div className="form">
				<InputBox
					id="uid"
					placeHolder="Enter team name here"
					title="Team name"
				/>
			</div>
			<Button
				text="Login"
				icon={ArrowRightIcon}
				onClick={handleLogin}
			></Button>
		</div>
	);
};

export default LoginPage;
